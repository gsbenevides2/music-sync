import Crypto from 'crypto-js'

const { CRYPTO_HASH } = process.env

export function encrypt(text: string): string {
  return Crypto.AES.encrypt(text, CRYPTO_HASH as string).toString()
}

export function decrypt(decrypted: string): string {
  return Crypto.AES.decrypt(decrypted, CRYPTO_HASH as string).toString(
    Crypto.enc.Utf8
  )
}

export function compare(encrypted: string, decrypted: string): boolean {
  return decrypt(encrypted) === decrypted
}
