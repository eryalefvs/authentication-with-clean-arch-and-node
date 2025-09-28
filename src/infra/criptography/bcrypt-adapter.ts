import { Hasher } from "@/data/protocols/cryptography/hasher";
import { HashComparer } from "@/data/protocols/cryptography/hash-comparer";

import bcrypt from "bcrypt"

export class BcryptAdapter implements Hasher, HashComparer {
    constructor(private readonly salt: number) {}

    async hash (plainText: string): Promise<string> {
        return bcrypt.hash(plainText, this.salt)
    }
    async compare (plainText: string, digest: string): Promise<boolean> {
        return bcrypt.compare(plainText, digest)
    }
}