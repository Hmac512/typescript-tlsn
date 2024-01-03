import { Direction, SessionHeaderInterface, SubstringsProofInterface } from "../test/proof";
import { RangeSet, Range } from "tree-range-set";
import { ChaChaEncoder, EncodingInterface } from "./ChaChaEncoder";
import { blake3 } from '@napi-rs/blake-hash'
import { encode } from "./opening";




const MAX_TOTAL_COMMITTED_DATA = 1_000_000_000;
export const TX_TRANSCRIPT_ID = "tx";
export const RX_TRANSCRIPT_ID = "rx";
export type TranscriptId = typeof TX_TRANSCRIPT_ID | typeof RX_TRANSCRIPT_ID;

export const verifySubstrings = (substringsProof: SubstringsProofInterface, header: SessionHeaderInterface) => {

    const { openings, inclusion_proof } = substringsProof


    let indicies: number[] = []
    let expectedHashes = []

    let sent = new Uint8Array(new Array(header.sent_len).fill(0))
    let recv = new Uint8Array(new Array(header.recv_len).fill(0))


    let sent_ranges = RangeSet.numeric()
    let recv_ranges = RangeSet.numeric()

    let total_opened = 0

    header.encoder_seed
    const Encoder = new ChaChaEncoder(new Uint8Array(header.encoder_seed))

    for (const key in openings) {
        // console.log(key)
        const [{ ranges, direction }, opening] = openings[key]


        let opened_len = 0

        const rangeSet = RangeSet.numeric()
        let maxR = 0
        ranges.forEach((range) => {
            const newRange = Range.close(range.start, range.end)
            rangeSet.add(newRange)
            opened_len += newRange.upper - newRange.lower
            maxR = Math.max(maxR, newRange.upper)
        })


        total_opened += opened_len;

        // Make sure the amount of data being proved is bounded.
        if (total_opened > MAX_TOTAL_COMMITTED_DATA) {
            throw new Error("Too much data opened")
        }


        // Make sure the opening length matches the ranges length.
        if (opening.Blake3.data.length != opened_len) {
            throw new Error("InvalidOpening")
        }


        // Match direction
        if (direction === "Sent") {
            let intersects = false
            for (const sentRange of sent_ranges.subranges) {
                for (const range of rangeSet.subranges) {
                    if (sentRange.intersection(range).isEmpty === false) {
                        intersects = true
                        break
                    }
                }

                if (intersects) break
            }

            if (intersects) throw new Error("Duplicate Data")
        }

        if (direction === "Received") {
            let intersects = false
            for (const sentRange of recv_ranges.subranges) {
                for (const range of rangeSet.subranges) {
                    if (sentRange.intersection(range).isEmpty === false) {
                        intersects = true
                        break
                    }
                }

                if (intersects) break
            }

            if (intersects) throw new Error("Duplicate Data")
        }


        let transcriptLength = 0

        if (direction === "Sent") transcriptLength = header.sent_len
        if (direction === "Received") transcriptLength = header.recv_len

        if (maxR > transcriptLength) throw new Error("RangeOutOfBounds")


        let ids = getValueIds(rangeSet, direction)
        let encodings: EncodingInterface[] = []
        ids.forEach((stringId) => {
            const hash = new Uint8Array(blake3(stringId)).slice(0, 8)
            const view = new DataView(hash.buffer, 0);
            const id = view.getBigUint64(0, false)
            // const encoder = Encoder.getRng(id)
            encodings.push(Encoder.encode(id))

        })


        indicies.push(Number(key))
        const encoded = encode(opening, encodings);
        const jsonString = JSON.stringify(encoded)
        console.log("jsonString", JSON.stringify(jsonString))
        // let utf8Encode = new TextEncoder();
        // const jsonBuffer = utf8Encode.encode(JSON.stringify(jsonString));
        console.log(key, new Uint8Array(blake3(jsonString)))




    }


    return true
}




export const getValueIds = (ranges: RangeSet<number>, direction: Direction): string[] => {


    let id = direction === "Sent" ? TX_TRANSCRIPT_ID : RX_TRANSCRIPT_ID
    const ids = []



    for (const range of ranges.subranges) {
        for (let idx: number = range.lower; idx < range.upper; idx++) {
            ids.push(`${id}/${idx}`)
        }
    }


    return ids
}