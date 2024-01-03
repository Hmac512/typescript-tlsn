import { ProofInterface } from "../test/proof";
import { verifySubstrings as parseTranscript } from "./substrings";
import { cleanTranscript } from "./Transcript";

export const verify = (proof: ProofInterface, publicKey: string) => {
  const { session, substrings } = proof;

  const { server_name, header } = session;

  const time = parseUnixTimestamp(header.handshake_summary.time);
  const { sentTranscript, recvTranscript } = parseTranscript(
    substrings,
    header
  );

  const sent = cleanTranscript(sentTranscript);
  const recv = cleanTranscript(recvTranscript);

  const decoder = new TextDecoder();

  const sentTx = decoder.decode(sent);
  const recievedTx = decoder.decode(recv);

  console.log(`Sent Transcript: \n${sentTx}\n`);
  console.log(`Received Transcript: \n${recievedTx}\n`);


  return {
    server_name,
    time,
    sentTx,
    recievedTx,
  };
};

const parseUnixTimestamp = (timestamp: number): Date => {
  // The timestamp needs to be in milliseconds, so we multiply by 1000
  return new Date(timestamp * 1000);
};
