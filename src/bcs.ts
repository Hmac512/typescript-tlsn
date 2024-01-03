import { bcs } from "@mysten/bcs";

const Nonce = bcs.struct('Nonce', {
    0: bcs.bytes(32),
});

export const Decommitment = bcs.struct('Decommitment', {
    nonce: Nonce,
    data: bcs.string(),
});


export const MerkleRoot = bcs.struct('MerkleRoot', {
    0: bcs.bytes(32),
});


export const Hash = bcs.struct('Hash', {
    0: bcs.bytes(32),
});






export const PublicKey = bcs.struct('PublicKey', {
    group: bcs.u8(),
    key: bcs.vector(bcs.u8())
});

export const HandshakeSummary = bcs.struct('HandshakeSummary', {
    time: bcs.u64(),
    server_public_key: PublicKey,
    handshake_commitment: Hash,

});

export const SessionHeader = bcs.struct('SessionHeader', {
    encoder_seed: bcs.bytes(32),
    merkle_root: MerkleRoot,
    sent_len: bcs.u64(),
    recv_len: bcs.u64(),
    handshake_summary: HandshakeSummary,
});
