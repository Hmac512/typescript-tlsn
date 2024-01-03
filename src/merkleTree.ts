import { InclusionProof } from "../test/proof";
import lodash from "lodash"
function hasDuplicates<T>(arr: T[]): boolean {
    return new Set(arr).size < arr.length;
}


export const verifyInclusionProof = (inclusionProof: InclusionProof, merkleRoot: number[], leafHashes_: Uint8Array[], leafIndices_: number[]): boolean => {


    if (leafHashes_.length != leafIndices_.length) throw new Error("leafHashes and leafIndices must have the same length")

    if (hasDuplicates(leafIndices_)) throw new Error("leafIndices must be unique")

    let zippedLeafs = lodash.zip(leafIndices_, leafHashes_)
    zippedLeafs = lodash.sortBy(zippedLeafs, o => o[0])

    let leafIndices = new Uint8Array(leafIndices_.length).fill(0)
    let leafHashes = new Array(leafHashes_.length).fill(0)
    for (let i = 0; i < zippedLeafs.length; i++) {
        const [leafIndex, leafHash] = zippedLeafs[i];

        leafIndices[i] = leafIndex!
        leafHashes[i] = leafHash!
    }



    // Actually do the merkle proof
    return true
}