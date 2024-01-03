import { Range, RangeSet } from "tree-range-set";

export interface RedactedTranscriptSlice {
    range: Range<number>;
    data: Uint8Array;
}

export interface RedactedTranscript {
    headerLength: number;
    slices: RedactedTranscriptSlice[];
}


let encoder = new TextEncoder()
const REDACTED_BYTE = encoder.encode("X")[0]

export const cleanTranscript = (transcript: RedactedTranscript) => {

    let data = Array.from(new Uint8Array(transcript.headerLength).fill(0))
    let auth = RangeSet.numeric()


    for (const slice of transcript.slices) {
        const range = slice.range
        const sliceData = slice.data
        data.splice(range.lower, range.upper - range.lower, ...sliceData);
        auth.add(range)
    }

    let difference = RangeSet.numeric()
    difference.add(Range.close(0, transcript.headerLength))

    for (const range of auth.subranges) {
        difference = difference.subtract(range)
    }

    let sum = 0

    for (const range of difference.subranges) {
        for (let i = range.lower; i < range.upper; i++) {
            sum += data[i]
            data[i] = REDACTED_BYTE
        }
    }

    if (sum !== 0) throw new Error("Transcript is not clean")

    return new Uint8Array(data)



}