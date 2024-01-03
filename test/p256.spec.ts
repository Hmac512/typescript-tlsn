import { sha256 } from "js-sha256";
import { SessionHeader } from "../src/BCS";
import { importPrivateKey } from "../src/p256";
import { NotaryPublicKey } from "./notary";
import { Proof } from "./proof";
//@ts-ignore
import { encode, decode } from 'uint8-to-base64';


describe('P256 Pem', () => {
    describe('Parse Pem', () => {
        it('should be able to parse', () => {
            const key = importPrivateKey(NotaryPublicKey);

            expect(key).toBeTruthy();
        });


        // it('Check Signature', () => {

        //     const serialized = SessionHeader.serialize({
        //         encoder_seed: new Uint8Array(Proof.session.header.encoder_seed),
        //         merkle_root: {
        //             0: new Uint8Array(Proof.session.header.merkle_root)
        //         },
        //         sent_len: BigInt(Proof.session.header.sent_len),
        //         recv_len: BigInt(Proof.session.header.recv_len),
        //         handshake_summary: {
        //             time: BigInt(Proof.session.header.handshake_summary.time),
        //             server_public_key: {
        //                 group: 0,
        //                 key: new Uint8Array(Proof.session.header.handshake_summary.server_public_key.key)
        //             },
        //             handshake_commitment: {
        //                 0: new Uint8Array(Proof.session.header.handshake_summary.handshake_commitment)
        //             }
        //         }
        //     }, { maxSize: 1e7 }).toBytes()
        //     const expected = new Uint8Array([84, 45, 46, 95, 190, 46, 45, 78, 2, 133, 107, 94, 149, 242, 32, 50, 169, 48, 105, 50, 74, 218, 90, 230, 15, 3, 171, 200, 145, 250, 173, 71, 158, 184, 186, 136, 98, 246, 112, 32, 12, 213, 200, 91, 232, 237, 109, 180, 21, 193, 147, 220, 155, 225, 196, 42, 228, 168, 100, 191, 226, 47, 239, 26, 220, 0, 0, 0, 0, 0, 0, 0, 103, 3, 0, 0, 0, 0, 0, 0, 50, 201, 148, 101, 0, 0, 0, 0, 0, 65, 4, 139, 135, 53, 253, 221, 149, 133, 132, 233, 251, 99, 129, 233, 9, 10, 111, 217, 45, 18, 115, 167, 27, 136, 127, 106, 46, 3, 58, 161, 164, 145, 231, 231, 39, 90, 233, 59, 106, 80, 142, 54, 86, 236, 84, 50, 101, 108, 24, 100, 244, 104, 121, 251, 196, 95, 76, 189, 166, 223, 146, 109, 212, 252, 158, 153, 106, 178, 17, 162, 247, 23, 107, 110, 161, 145, 133, 159, 158, 170, 173, 233, 119, 128, 42, 185, 84, 159, 218, 234, 71, 126, 35, 111, 168, 174, 118])
        //     expect(serialized).toEqual(expected)


        //     const sig = Proof.session.signature.P256;
        //     const hexSig = Uint8Array.from(Buffer.from(sig, 'hex'));
        //     const expectedSig = new Uint8Array([23, 224, 52, 43, 221, 182, 156, 219, 6, 46, 32, 102, 230, 189, 226, 106, 229, 141, 202, 51, 144, 248, 31, 146, 210, 50, 236, 161, 206, 241, 26, 196, 2, 66, 91, 56, 241, 114, 67, 234, 219, 80, 135, 30, 183, 211, 20, 230, 176, 90, 250, 46, 218, 40, 10, 194, 84, 211, 13, 144, 90, 171, 35, 253])
        //     expect(hexSig).toEqual(expectedSig);
        //     const base64String = encode(hexSig);
        //     const key = importPrivateKey(NotaryPublicKey);
        //     const res = key.doVerify(serialized, base64String)

        //     console.log("Result", res)

        // });



    });
});
