import { ProofInterface } from "../test/proof";
// import { cleanTranscript } from "./transcript";
import { verifySubstrings as parseTranscript } from "./substrings";
import { cleanTranscript } from "./Transcript";

export const verify = (proof: ProofInterface, publicKey: string) => {
    const { session, substrings } = proof;

    const { server_name, header } = session;

    const time = parseUnixTimestamp(header.handshake_summary.time);
    let { sentTranscript, recvTranscript } = parseTranscript(substrings, header);

    let sent = cleanTranscript(sentTranscript)
    let recv = cleanTranscript(recvTranscript)


    const decoder = new TextDecoder()
    //console.log("sent", sent)


    const sentTx = decoder.decode(sent)
    const recievedTx = decoder.decode(recv)

    console.log(`Sent Transcript: \n${sentTx}\n`)
    console.log(`Received Transcript: \n${recievedTx}\n`)


    return true
};

const parseUnixTimestamp = (timestamp: number): Date => {
    // The timestamp needs to be in milliseconds, so we multiply by 1000
    return new Date(timestamp * 1000);
};
