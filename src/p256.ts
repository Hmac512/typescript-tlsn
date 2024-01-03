
//@ts-ignore
import ECDHCrypto from "ecdh-crypto"
export const importPrivateKey = (pem: string) => {
    return new ECDHCrypto(pem, 'pem');
}