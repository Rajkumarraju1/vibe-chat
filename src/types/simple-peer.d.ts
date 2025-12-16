declare module 'simple-peer' {
    import { Instance } from 'simple-peer';
    export = SimplePeer;

    class SimplePeer {
        constructor(opts?: SimplePeer.Options);
        signal(data: string | SimplePeer.SignalData): void;
        send(data: string | ArrayBuffer | ArrayBufferView | Blob | Buffer): void;
        on(event: string, listener: (...args: any[]) => void): this;
        on(event: 'signal', listener: (data: SimplePeer.SignalData) => void): this;
        on(event: 'stream', listener: (stream: MediaStream) => void): this;
        on(event: 'data', listener: (data: any) => void): this;
        destroy(err?: Error): void;

        static Instance: SimplePeer.Instance;
    }

    namespace SimplePeer {
        interface Options {
            initiator?: boolean;
            channelName?: string;
            channelConfig?: any;
            config?: any;
            offerOptions?: any;
            answerOptions?: any;
            sdpTransform?: (sdp: string) => string;
            stream?: MediaStream;
            streams?: MediaStream[];
            trickle?: boolean;
            allowHalfTrickle?: boolean;
            wrtc?: any;
            objectMode?: boolean;
        }

        interface SignalData {
            type: 'offer' | 'answer' | 'candidate' | 'pranswer' | 'rollback' | 'bye';
            sdp?: string;
            candidate?: any;
        }

        type Instance = SimplePeer;
    }
}
