import { Hasher } from "../../../src/data/protocols/cryptography/hasher";

import { faker } from "@faker-js/faker";

export class HasherSpy implements Hasher {
    result = faker.string.uuid()
    plainText: string

    async hash(plainText: string): Promise<string> {
        this.plainText = plainText
        return this.result
    }
}