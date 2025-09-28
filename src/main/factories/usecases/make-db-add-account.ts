import { AddAccount } from "../../../domain/usecases/add-acount"
import { DbAddAccount } from "../../../data/usecases/db-add-account"
import { BcryptAdapter } from "../../../infra/criptography/bcrypt-adapter"
import { AccountMongoRepository } from "../../../infra/db/mongodb/account-mongo-repository"

export const makeDbAddAccount = (): AddAccount => {
    const salt = 12
    const bcryptyAdapter = new BcryptAdapter(salt)
    const accountMongoRepository = new AccountMongoRepository()
    return new DbAddAccount(bcryptyAdapter, accountMongoRepository, accountMongoRepository)
}