import { Authentication } from "../../domain/usecases/authentication";
import { LoadAccountByEmailRepository, UpdateAccessTokenRepository } from "../protocols/repositories/account";
import { HashComparer } from "../protocols/cryptography/hash-comparer";
import { Encrypter } from "../protocols/cryptography/encrypter";

export class DbAuthentication implements Authentication {
    constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository
  ) {}

    async auth (authenticationParams: Authentication.Params): Promise<Authentication.Result> {
        const account = await this.loadAccountByEmailRepository.loadByEmail(authenticationParams.email)
        if (account) {
            const isValid = await this.hashComparer.compare(authenticationParams.password, account.password)
            if (isValid) {
                const accessToken = await this.encrypter.encrypt(account.id)
                await this.updateAccessTokenRepository.updateAccessToken(account.id, accessToken)
                return {
                    accessToken,
                    name: account.name
                }
            }
        }
        return null
    }
}