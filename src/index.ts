import { ProofInterface } from "../test/proof";
import { verifySubstrings } from "./substrings";

export const verify = (proof: ProofInterface, publicKey: string): boolean => {
    const { session, substrings } = proof;

    const { server_name, header } = session;

    const time = parseUnixTimestamp(header.handshake_summary.time);
    const isVerified = verifySubstrings(substrings, header);
    return true;
};

const parseUnixTimestamp = (timestamp: number): Date => {
    // The timestamp needs to be in milliseconds, so we multiply by 1000
    return new Date(timestamp * 1000);
};
