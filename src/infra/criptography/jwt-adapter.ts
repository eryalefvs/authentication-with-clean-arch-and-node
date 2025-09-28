import { Decrypter } from "../../data/protocols/cryptography/decrypter";
import { Encrypter } from "../../data/protocols/cryptography/encrypter";
import jwt from "jsonwebtoken"

export class JwtAdapter implements Encrypter, Decrypter {
    constructor (private readonly secret: string) {}

    async encrypt (plainText: string): Promise<string> {
        return jwt.sign({ id: plainText }, this.secret)
    }

    async decrypt (ciphertext: string): Promise<string> {
        return jwt.verify(ciphertext, this.secret) as any
    }
}