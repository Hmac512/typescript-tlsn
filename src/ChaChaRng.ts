//@ts-ignore
import chacha from "chacha";

export class ChaChaRng {
  seed: Uint8Array;
  // stream: number;
  cipher: any;

  constructor(seedBytes: Uint8Array | Array<number>, stream = 0n) {
    if (seedBytes instanceof Array || seedBytes instanceof Uint8Array) {
      seedBytes = Buffer.from(seedBytes);
    }
    if (!(seedBytes instanceof Buffer)) {
      throw new Error("Seed is not an array");
      return;
    }
    if (seedBytes.length != 32) {
      throw new Error("Seed is not 32 bytes long");
      return;
    }

    // this.stream = stream
    this.seed = seedBytes;
    const nonce = int64ToUint8Array(stream);
    this.cipher = chacha.chacha20(seedBytes, nonce);
  }

  // Array is an array or Uint8Array of the desired size
  // that will be filled with random bytes.
  // The array is modified in place.
  fillBytes(array: Uint8Array) {
    const size = array.length;
    let output = new Uint8Array(size);
    output = this.cipher.update(output);

    output.reverse();
    // console.log("output", new Uint8Array(output))
    for (let i = 0; i < output.length; i++) {
      array[i] = output[output.length - i - 1];
    }
  }

  // Returns a number in range 0 <= n < 4294967296

  nextU8() {
    const n = nextFromBytes(1, this.cipher);
    return n;
  }

  nextU32() {
    const n = nextFromBytes(4, this.cipher);
    return n;
  }

  // Returns a BigInt in range 0 <= n < 18446744073709551616
  nextU64() {
    const n = nextFromBytes(8, this.cipher);
    return n;
  }
}

function nextFromBytes(n: number, cipher: any) {
  let bytes = new Uint8Array(n);
  bytes = cipher.update(bytes);
  let v = 0n;
  // fetch 4 bytes for a u32
  for (let i = 0; i < n; i++) {
    const b = bytes[i];
    const bi = BigInt(b);
    const e = 8n * BigInt(i);
    v = v + bi * 2n ** e;
  }
  if (n == 4) {
    // u32 is not BigInt, so convert it to a number
    v = BigInt(parseInt(v.toString()));
  }
  return v;
}

function int64ToUint8Array(value: bigint): Uint8Array {
  const uint8Array = new Uint8Array(8); // 64 bits => 8 bytes

  for (let i = 0; i < 8; i++) {
    uint8Array[i] = Number((value >> BigInt(i * 8)) & BigInt(0xff));
  }

  const result = new Uint8Array([0, 0, 0, 0, ...uint8Array]);

  return result;
}

export const ChaCha20RngFromRng = (rng: ChaChaRng) => {
  const seed = new Uint8Array(32).fill(0);
  rng.fillBytes(seed);
  return new ChaChaRng(seed);
};
