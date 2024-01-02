import Chacha20 from "ts-chacha20";


const DELTA_STREAM_ID = 18446744073709551615

export class ChaChaEncoder {
    seed: Uint8Array
    delta?: Uint8Array
    constructor(seed: number[]) {
        this.seed = new Uint8Array(seed)
    }
}