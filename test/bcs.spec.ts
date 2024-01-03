import { blake3 } from "@napi-rs/blake-hash";
import { Decommitment, SessionHeader } from "../src/BCS";
import { testCase2, testBCS1 } from "./data";
import { Proof } from "./proof";
import BN from "bn.js";
import { sha256 } from "js-sha256";

describe('Test BCS', () => {
    describe('Test serialization/deserialization', () => {
        it('test case 1', () => {
            const str = "[{\"U8\":{\"state\":null,\"labels\":[[23,132,163,220,59,89,75,180,139,209,77,239,247,95,23,211],[136,156,8,204,233,226,238,3,248,34,13,18,229,157,246,143],[142,17,211,120,172,133,158,111,154,75,253,63,150,207,203,67],[242,219,201,165,20,1,11,82,246,21,237,168,224,70,233,112],[5,101,188,190,145,104,66,224,138,92,89,106,87,33,18,244],[239,48,60,218,219,226,206,88,22,154,48,226,255,143,89,185],[206,110,147,113,230,208,4,230,89,87,98,3,213,182,222,102],[51,237,67,220,163,200,212,235,91,27,73,47,186,94,184,208]]}},{\"U8\":{\"state\":null,\"labels\":[[233,204,199,169,19,160,251,3,130,3,72,245,183,126,213,214],[147,160,118,151,131,14,70,69,243,229,60,22,238,197,135,149],[128,1,170,87,25,244,45,99,193,24,249,11,113,154,7,248],[236,254,82,55,120,231,100,47,231,110,155,80,111,199,222,211],[129,59,253,50,48,137,74,15,193,140,157,55,81,121,53,65],[116,88,26,124,59,126,60,33,198,13,80,108,138,155,171,104],[121,215,20,239,47,132,240,174,178,143,130,20,189,150,205,138],[104,61,66,213,206,140,121,16,125,212,31,112,0,94,248,109]]}},{\"U8\":{\"state\":null,\"labels\":[[136,139,236,49,84,49,42,172,84,104,75,222,36,81,177,14],[39,190,230,113,27,2,63,42,167,56,46,74,234,125,180,167],[143,102,13,202,47,58,152,65,180,47,96,204,218,87,212,197],[191,90,19,7,170,179,164,157,109,35,48,18,227,62,116,97],[131,226,212,27,199,218,94,168,84,176,206,214,197,114,33,191],[96,232,157,47,88,208,129,118,249,224,190,42,164,2,162,116],[15,163,125,26,63,82,66,171,145,120,66,229,238,17,241,142],[6,198,232,175,89,221,93,64,12,8,69,18,43,216,173,68]]}},{\"U8\":{\"state\":null,\"labels\":[[222,84,156,26,34,203,87,94,114,37,108,96,60,69,111,254],[71,53,104,41,197,177,198,29,144,208,175,132,20,36,188,106],[97,198,4,33,154,207,140,203,144,32,34,66,203,153,97,43],[223,160,241,8,185,193,76,25,178,200,72,14,59,4,225,234],[61,123,255,146,76,231,225,47,99,149,3,137,218,238,169,199],[179,114,90,213,179,252,189,165,115,45,101,144,105,172,233,190],[76,201,14,39,75,115,227,111,248,227,65,86,12,112,213,56],[136,218,11,219,107,239,65,87,93,126,67,158,137,224,238,79]]}}]"


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


    describe('Session Header', () => {
        it('Serialize Header', () => {

            const serialized = SessionHeader.serialize({
                encoder_seed: new Uint8Array(Proof.session.header.encoder_seed),
                merkle_root: {
                    0: new Uint8Array(Proof.session.header.merkle_root)
                },
                sent_len: BigInt(Proof.session.header.sent_len),
                recv_len: BigInt(Proof.session.header.recv_len),
                handshake_summary: {
                    time: BigInt(Proof.session.header.handshake_summary.time),
                    server_public_key: {
                        group: 0,
                        key: new Uint8Array(Proof.session.header.handshake_summary.server_public_key.key)
                    },
                    handshake_commitment: {
                        0: new Uint8Array(Proof.session.header.handshake_summary.handshake_commitment)
                    }
                }
            }, { maxSize: 1e7 }).toBytes()
            const expected = new Uint8Array([84, 45, 46, 95, 190, 46, 45, 78, 2, 133, 107, 94, 149, 242, 32, 50, 169, 48, 105, 50, 74, 218, 90, 230, 15, 3, 171, 200, 145, 250, 173, 71, 158, 184, 186, 136, 98, 246, 112, 32, 12, 213, 200, 91, 232, 237, 109, 180, 21, 193, 147, 220, 155, 225, 196, 42, 228, 168, 100, 191, 226, 47, 239, 26, 220, 0, 0, 0, 0, 0, 0, 0, 103, 3, 0, 0, 0, 0, 0, 0, 50, 201, 148, 101, 0, 0, 0, 0, 0, 65, 4, 139, 135, 53, 253, 221, 149, 133, 132, 233, 251, 99, 129, 233, 9, 10, 111, 217, 45, 18, 115, 167, 27, 136, 127, 106, 46, 3, 58, 161, 164, 145, 231, 231, 39, 90, 233, 59, 106, 80, 142, 54, 86, 236, 84, 50, 101, 108, 24, 100, 244, 104, 121, 251, 196, 95, 76, 189, 166, 223, 146, 109, 212, 252, 158, 153, 106, 178, 17, 162, 247, 23, 107, 110, 161, 145, 133, 159, 158, 170, 173, 233, 119, 128, 42, 185, 84, 159, 218, 234, 71, 126, 35, 111, 168, 174, 118])
            expect(serialized).toEqual(expected)


            const expectedHash = new Uint8Array([212, 12, 189, 6, 71, 141, 244, 197, 43, 173, 6, 2, 145, 143, 255, 139, 224, 187, 26, 0, 161, 32, 8, 180, 5, 155, 82, 120, 29, 223, 121, 204])


            let hasher = sha256.create()
            hasher.update(serialized)
            const result = new Uint8Array(hasher.digest())
            expect(result).toEqual(expectedHash)


        });




    });


});
