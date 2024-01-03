import { InclusionProof } from "../test/proof";
import lodash from "lodash";
import { sha256 } from 'js-sha256';
import MerkleTree from "merkletreejs";

function hasDuplicates<T>(arr: T[]): boolean {
  return new Set(arr).size < arr.length;
}


function toHexString(byteArray: Uint8Array) {
  var s = '0x';
  byteArray.forEach(function (byte) {
    s += ('0' + (byte & 0xFF).toString(16)).slice(-2);
  });
  return s;
}

export const verifyInclusionProof = (
  inclusionProof: InclusionProof,
  merkleRoot: number[],
  leafHashes_: Uint8Array[],
  leafIndices_: number[]
): boolean => {
  if (leafHashes_.length != leafIndices_.length)
    throw new Error('leafHashes and leafIndices must have the same length');

  if (hasDuplicates(leafIndices_))
    throw new Error('leafIndices must be unique');


  let zippedLeafs = lodash.zip(leafIndices_, leafHashes_);
  zippedLeafs = lodash.sortBy(zippedLeafs, (o) => o[0]);

  const leafIndices = new Uint8Array(leafIndices_.length).fill(0);
  const leafHashes: Uint8Array[] = []
  for (let i = 0; i < zippedLeafs.length; i++) {
    const [leafIndex, leafHash] = zippedLeafs[i];
    leafIndices[i] = leafIndex!;
    leafHashes.push(leafHash!);
  }
  const expectedHash = toHexString(new Uint8Array(merkleRoot));
  const caclulatedHash = calculateMerkleRoot(leafHashes)
  return caclulatedHash === expectedHash
};

export const calculateMerkleRoot = (leafHashes: Uint8Array[]): string => {
  const tree = new MerkleTree(leafHashes, sha256, { hashLeaves: false })
  const root = tree.getRoot()
  return toHexString(new Uint8Array(root))
}