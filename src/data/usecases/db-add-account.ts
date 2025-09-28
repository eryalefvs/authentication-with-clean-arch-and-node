import { AddAccount } from "@/domain/usecases/add-acount";
import { Hasher } from "../protocols/cryptography/hasher";
import { AddAccountRepository } from "../protocols/repositories/account/add-account-repository";
import { CheckAccountByEmailRepository } from "../protocols/repositories/account/check-account-by-email-repository";

export class DbAddAccount implements AddAccount {
    constructor(
        private readonly hasher: Hasher,
        private readonly addAccountRepository: AddAccountRepository,
        private readonly checkAccountByEmailRepository: CheckAccountByEmailRepository
    ) {}

    async add (account: AddAccount.Params): Promise<AddAccount.Result> {
        const emailExists = await this.checkAccountByEmailRepository.checkByEmail(account.email)
        let isValid = false
        if (!emailExists) {
            const hashedPassword = await this.hasher.hash(account.password)
            isValid = await this.addAccountRepository.add({ ...account, password: hashedPassword })
        }

        return isValid
    }
}