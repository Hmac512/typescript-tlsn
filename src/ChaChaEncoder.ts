import { ChaChaRng } from "./ChaChaRng";

export const DELTA_STREAM_ID = 18446744073709551615n;

export class ChaChaEncoder {
    seed: Uint8Array;
    delta: Uint8Array;
    constructor(seed: Uint8Array) {
        const rng = new ChaChaRng(seed, DELTA_STREAM_ID);
        const delta = new Uint8Array(16);

        this.seed = seed;

        for (let i = 0; i < delta.length; i++) {
            delta[i] = Number(rng.nextU32());
        }
        this.delta = delta;
    }

    getRng(id: bigint) {
        return new ChaChaRng(this.seed, id);
    }

    encode(id: bigint): EncodingInterface {
        const rng = new ChaChaRng(this.seed, id);
        const blocks = [];

        for (let i = 0; i < 8; i++) {
            const block = new Uint8Array(16);
            for (let i = 0; i < block.length; i++) {
                block[i] = Number(rng.nextU32());
            }
            blocks.push(block);
        }


        return {
            labels: blocks,
            delta: this.delta,
        };
    }
}

export interface EncodingInterface {
    labels: Uint8Array[];
    delta: Uint8Array;
}
