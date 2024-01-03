from ecdsa import VerifyingKey


pem = '''-----BEGIN PUBLIC KEY-----
MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEBv36FI4ZFszJa0DQFJ3wWCXvVLFr
cRzMG5kaTeHGoSzDu6cFqx3uEWYpFGo6C0EOUgf+mEgbktLrXocv5yHzKg==
-----END PUBLIC KEY-----
'''

raw_sig = "17E0342BDDB69CDB062E2066E6BDE26AE58DCA3390F81F92D232ECA1CEF11AC402425B38F17243EADB50871EB7D314E6B05AFA2EDA280AC254D30D905AAB23FD"
digest = bytearray([212, 12, 189, 6, 71, 141, 244, 197, 43, 173, 6, 2, 145, 143, 255, 139, 224, 187, 26, 0, 161, 32, 8, 180, 5, 155, 82, 120, 29, 223, 121, 204])
signature =  bytearray.fromhex(raw_sig)

vk = VerifyingKey.from_pem(pem)
print(vk.verify_digest(signature, digest))
