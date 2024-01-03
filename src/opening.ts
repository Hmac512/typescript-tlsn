import { assert } from "console";
import { CommitmentOpeningInterface } from "../test/proof";
import { EncodingInterface } from "./ChaChaEncoder";
import BN from "bn.js"

export interface LeafInterface {
    U8: {
        state: null;
        labels: number[][];
    }
}




export const encode = (opening: CommitmentOpeningInterface, encodings: EncodingInterface[]) => {


    if (encodings.length != opening.Blake3.data.length) throw new Error("encodings and data must have the same length")


    let resp: LeafInterface[] = []

    for (let i = 0; i < encodings.length; i++) {
        const encoding = encodings[i];
        const data = opening.Blake3.data[i];

        const bits = [...Array(8)].map((x, i) => data >> i & 1)

        // console.log("recoverHash data", data)
        //console.log("recoverHash encoding", encoding)



        const delta = new BN(encoding.delta)

        // const encodedVals = {
        //     state: null,
        //     labels: []
        // }
        const labels = []
        for (let j = 0; j < 8; j++) {
            let label = new BN(encoding.labels[j])
            label.xor
            // console.log("label", label, delta, bits[j])
            let val: BN;
            if (bits[j]) val = label.xor(delta)
            else val = label




            // console.log("val", val)
            let encoded = val.toArray("be", 16)
            //  console.log("encoded", data, bits[j], encoding.labels[j], encoded)
            labels.push(encoded)
        }
        resp.push({
            U8: {
                state: null,
                labels: labels
            }
        })
    }


    return resp


}