import { AddAccount } from "../../../src/domain/usecases/add-acount";
import { faker } from "@faker-js/faker";
import { Authentication } from "../usecases/authentication";

export const mockAddAccountParams = (): AddAccount.Params => ({
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password()
})

export const mockAuthenticationParams = (): Authentication.Params => ({
    email: faker.internet.email(),
    password: faker.internet.password()
})