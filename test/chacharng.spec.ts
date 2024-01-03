import { ChaCha20RngFromRng, ChaChaRng } from "../src/ChaChaRng";
import { blake3 } from '@napi-rs/blake-hash'
import { testBCS1, testCase2 } from "./data";
import { bcs } from "@mysten/bcs";
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


    describe('hash', () => {
        it('test case 1', () => {
            const str = "[{\"U8\":{\"state\":null,\"labels\":[[23,132,163,220,59,89,75,180,139,209,77,239,247,95,23,211],[136,156,8,204,233,226,238,3,248,34,13,18,229,157,246,143],[142,17,211,120,172,133,158,111,154,75,253,63,150,207,203,67],[242,219,201,165,20,1,11,82,246,21,237,168,224,70,233,112],[5,101,188,190,145,104,66,224,138,92,89,106,87,33,18,244],[239,48,60,218,219,226,206,88,22,154,48,226,255,143,89,185],[206,110,147,113,230,208,4,230,89,87,98,3,213,182,222,102],[51,237,67,220,163,200,212,235,91,27,73,47,186,94,184,208]]}},{\"U8\":{\"state\":null,\"labels\":[[233,204,199,169,19,160,251,3,130,3,72,245,183,126,213,214],[147,160,118,151,131,14,70,69,243,229,60,22,238,197,135,149],[128,1,170,87,25,244,45,99,193,24,249,11,113,154,7,248],[236,254,82,55,120,231,100,47,231,110,155,80,111,199,222,211],[129,59,253,50,48,137,74,15,193,140,157,55,81,121,53,65],[116,88,26,124,59,126,60,33,198,13,80,108,138,155,171,104],[121,215,20,239,47,132,240,174,178,143,130,20,189,150,205,138],[104,61,66,213,206,140,121,16,125,212,31,112,0,94,248,109]]}},{\"U8\":{\"state\":null,\"labels\":[[136,139,236,49,84,49,42,172,84,104,75,222,36,81,177,14],[39,190,230,113,27,2,63,42,167,56,46,74,234,125,180,167],[143,102,13,202,47,58,152,65,180,47,96,204,218,87,212,197],[191,90,19,7,170,179,164,157,109,35,48,18,227,62,116,97],[131,226,212,27,199,218,94,168,84,176,206,214,197,114,33,191],[96,232,157,47,88,208,129,118,249,224,190,42,164,2,162,116],[15,163,125,26,63,82,66,171,145,120,66,229,238,17,241,142],[6,198,232,175,89,221,93,64,12,8,69,18,43,216,173,68]]}},{\"U8\":{\"state\":null,\"labels\":[[222,84,156,26,34,203,87,94,114,37,108,96,60,69,111,254],[71,53,104,41,197,177,198,29,144,208,175,132,20,36,188,106],[97,198,4,33,154,207,140,203,144,32,34,66,203,153,97,43],[223,160,241,8,185,193,76,25,178,200,72,14,59,4,225,234],[61,123,255,146,76,231,225,47,99,149,3,137,218,238,169,199],[179,114,90,213,179,252,189,165,115,45,101,144,105,172,233,190],[76,201,14,39,75,115,227,111,248,227,65,86,12,112,213,56],[136,218,11,219,107,239,65,87,93,126,67,158,137,224,238,79]]}}]"
            // const encoder = new TextEncoder()
            // let data = encoder.encode(str)
            // // console.log("STR HASH", data)
            // // console.log("ENDING", data.slice(-20));

            const nonce = new Uint8Array([80, 226, 182, 133, 207, 208, 176, 136, 151, 156, 28, 44, 40, 146, 158, 22, 202, 62, 25, 42, 183, 134, 118, 42, 110, 188, 20, 16, 201, 185, 226, 228])


            let decommitment = Decommitment.serialize({
                nonce: { 0: nonce },
                data: str

            }, { maxSize: 1e6 }).toBytes()


            const result = new Uint8Array(blake3(Buffer.from(decommitment.buffer)))
            const expected = new Uint8Array([143, 38, 30, 78, 44, 235, 235, 53, 117, 235, 5, 140, 51, 242, 186, 79, 17, 161, 198, 219, 134, 219, 141, 138, 7, 141, 207, 99, 1, 24, 249, 48])

            expect(result).toEqual(expected)

        });
        it('test case 2', () => {
            const str = testCase2

            const nonce = new Uint8Array([68, 227, 195, 13, 157, 11, 17, 48, 45, 157, 103, 35, 141, 145, 83, 153, 108, 119, 240, 189, 0, 18, 195, 113, 50, 105, 237, 45, 124, 49, 38, 223])



            let decommitment = Decommitment.serialize({
                nonce: { 0: nonce },
                data: str

            }, { maxSize: 1e6 }).toBytes()

            const result = new Uint8Array(blake3(Buffer.from(decommitment.buffer)))

            const expected = new Uint8Array([208, 208, 0, 0, 99, 46, 106, 110, 203, 101, 106, 208, 150, 34, 67, 123, 240, 248, 16, 14, 54, 85, 0, 142, 36, 172, 168, 6, 20, 171, 200, 101])

            expect(result).toEqual(expected)


        });
    });

    describe('hash', () => {
        it('BCS', () => {
            const parsed = Decommitment.parse(new Uint8Array(testBCS1))
            expect(parsed).toBeDefined()
            const serialized = Decommitment.serialize(parsed, { maxSize: 1e7 }).toBytes()
            // console.log(testBCS1.length, serialized.length)
            expect(serialized).toEqual(new Uint8Array(testBCS1))
        });

    });


});
