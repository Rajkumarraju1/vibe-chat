const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const Razorpay = require("razorpay");
const crypto = require("crypto");

const app = express();
app.use(cors());
app.use(express.json()); // Enable JSON body parsing

// REPLACE THESE WITH YOUR ACTUAL KEYS
const razorpay = new Razorpay({
  key_id: "rzp_test_RQzTCSQezDt3qq",
  key_secret: "TUn0tMsECdh97s3t1kYHtADH"
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins for now (dev)
    methods: ["GET", "POST"],
  },
});

let users = {}; // Store user information
let waitingUsers = []; // This will now only hold IDs of users who couldn't find an immediate match

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join_pool", ({ gender, targetGender } = {}) => {
    // Store user info
    users[socket.id] = {
      id: socket.id,
      gender: gender || "unknown",
      targetGender: targetGender || "any", // 'any', 'male', 'female'
      isPremium: !!targetGender // Only premium users can set targetGender
    };

    console.log(`User ${socket.id} joined pool. Gender: ${gender}, Target: ${targetGender}`);

    // Find a match
    const partner = findMatch(socket.id);

    if (partner) {
      // Remove both from pool (conceptually - in this simple array implementation we just pair them)
      // In a real app with a queue, you'd pop them. 
      // Here we just notify them.

      console.log(`Matched ${socket.id} with ${partner.id}`);

      // Notify initiator (current socket)
      socket.emit("matched", { partnerId: partner.id, initiator: true });

      // Notify partner
      io.to(partner.id).emit("matched", { partnerId: socket.id, initiator: false });
    } else {
      // If no immediate match, add to waiting list
      waitingUsers.push(socket.id);
      console.log(`User ${socket.id} added to waiting pool.`);
    }
  });

  socket.on("signal", (data) => {
    // data: { target, signal }
    io.to(data.target).emit("signal", {
      sender: socket.id,
      signal: data.signal,
    });
  });

  socket.on("leave_chat", (data) => {
    if (data && data.partnerId) {
      io.to(data.partnerId).emit("partner_left");
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    waitingUsers = waitingUsers.filter((id) => id !== socket.id);
    // Note: We might want to notify the partner if they were in a call, 
    // but usually the "signal" connection closure handles it or we can track active pairs.
    // For simplicity, we rely on client pings or clean "leave" events, 
    // but here we just ensure they aren't in the waiting list.
  });
});

// Helper: Find a match based on criteria
function findMatch(myId) {
  const myUser = users[myId];

  // Critically important: Only look for partners who are explicitly WAITING
  // and not already in a chat.
  const pool = waitingUsers
    .filter(id => id !== myId) // Exclude self (though unlikely to be in there yet)
    .map(id => users[id])      // Get user objects
    .filter(u => u);           // Filter out any undefineds

  // 1. If I am Premium and want a specific gender
  if (myUser.isPremium && myUser.targetGender !== 'any') {
    const exactMatch = pool.find(u => u.gender === myUser.targetGender);
    if (exactMatch) return exactMatch;
  }

  // 2. If I am Free (or Premium with 'any'), match with anyone
  // Ideally, we should also check if the *other* person has filtered ME out.
  // For MVP, simplistic matching:
  return pool.find(u => {
    // Make sure the other user hasn't filtered ME out
    if (u.isPremium && u.targetGender !== 'any') {
      return u.targetGender === myUser.gender;
    }
    return true;
  });
}

// Razorpay Endpoints
app.post("/create-order", async (req, res) => {
  try {
    const options = {
      amount: 99900, // amount in smallest currency unit (999.00 INR)
      currency: "INR",
      receipt: "order_rcptid_" + Date.now(),
    };
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).send("Error creating order");
  }
});

app.post("/verify-payment", (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, socketId } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", "YOUR_RAZORPAY_KEY_SECRET") // MUST MATCH KEY_SECRET ABOVE
    .update(body.toString())
    .digest("hex");

  if (expectedSignature === razorpay_signature) {
    // Payment Success!
    console.log(`Payment verified for user ${socketId}`);

    // Mark user as premium in memory
    if (users[socketId]) {
      users[socketId].isPremium = true;
      console.log(`User ${socketId} upgraded to PREMIUM`);
    }

    res.json({ status: "success" });
  } else {
    res.status(400).json({ status: "failure" });
  }
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Signaling server running on port ${PORT}`);
});
