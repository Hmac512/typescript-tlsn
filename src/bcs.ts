import { bcs } from "@mysten/bcs";



const Nonce = bcs.struct('Nonce', {
    0: bcs.bytes(32)
});

export const Decommitment = bcs.struct('Decommitment', {
    nonce: Nonce,
    data: bcs.string()
});
