import { AddAccountRepository } from "../../../src/data/protocols/repositories/account/add-account-repository";
import { CheckAccountByEmailRepository } from "../../../src/data/protocols/repositories/account/check-account-by-email-repository";

export class AddAccountRepositorySpy implements AddAccountRepository {
    params: AddAccountRepository.Params
    result = true

    async add(params: AddAccountRepository.Params): Promise<AddAccountRepository.Result> {
        this.params = params
        return this.result
    }
}

export class CheckAccountByEmailRepositorySpy implements CheckAccountByEmailRepository {
    email: string
    result = false

    async checkByEmail (email: string): Promise<CheckAccountByEmailRepository.Result> {
        this.email = email
        return this.result
    }
}