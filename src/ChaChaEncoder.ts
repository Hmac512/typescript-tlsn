import { ChaChaRng } from "./ChaChaRng";

export const DELTA_STREAM_ID = 18446744073709551615n;

export class ChaChaEncoder {
  // rng: ChaChaRng;
  seed: Uint8Array;
  delta: Uint8Array;
  constructor(seed: Uint8Array) {
    const rng = new ChaChaRng(seed, DELTA_STREAM_ID);
    const delta = new Uint8Array(16);
    // 137, 162, 8, 223, 189, 238, 205, 108, 124, 232, 48, 103, 222, 82, 185, 51

    //[
    //     137,  77, 241, 229, 162,
    //     147, 145, 139,   8,  50,
    //      51,  46, 223, 180,  17,
    //     242
    //   ]

    // [
    //     137, 162,   8, 223, 189,
    //     238, 205, 108, 124, 232,
    //      48, 103, 222,  82, 185,
    //      51
    //   ]
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

    blocks.forEach((block) => {
      //      console.log("block", id, block)
    });

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
