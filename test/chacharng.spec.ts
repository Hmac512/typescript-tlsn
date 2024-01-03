import { ChaCha20RngFromRng, ChaChaRng } from "../src/ChaChaRng";
import { blake3 } from '@napi-rs/blake-hash'
import { testBCS1, testCase2 } from "./data";
import { Decommitment } from "../src/BCS";

describe('ChaChaRng', () => {
    describe('ChaChaRng seed', () => {
        it('test case should be valid', () => {
            let seed = [
                0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0,
                0, 0, 0,
            ];

            const rng20 = new ChaChaRng(seed)
            const output = rng20.nextU32()
            expect(output).toBe(BigInt(137206642))

            const rng20_2 = ChaCha20RngFromRng(rng20)

            const output2 = rng20_2.nextU32()
            expect(output2).toBe(BigInt(1325750369))

        });
    });


    describe('ChaChaRng stream/nonce', () => {
        it('test case should be valid', () => {
            let seed = new Uint8Array(32).fill(0);
            let stream = BigInt(144115188075855872n);
            const rng20 = new ChaChaRng(seed, stream)



            let results = new Uint32Array(16).fill(0);

            for (let i = 0; i < results.length; i++) {
                results[i] = Number(rng20.nextU32());
            }


            let expected = new Uint32Array([
                0x374dc6c2, 0x3736d58c, 0xb904e24a, 0xcd3f93ef, 0x88228b1a, 0x96a4dfb3, 0x5b76ab72,
                0xc727ee54, 0x0e0e978a, 0xf3145c95, 0x1b748ea8, 0xf786c297, 0x99c28f5f, 0x628314e8,
                0x398a19fa, 0x6ded1b53,
            ])
            expect(results).toEqual(expected)


        });
    });





});
