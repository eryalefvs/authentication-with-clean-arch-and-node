import { Authentication } from "../../domain/usecases/authentication";
import { Controller } from "../protocols/controller";
import { HttpResponse } from "../protocols/http";
import { Validation } from "../protocols/validation";
import { badRequest, ok, serverError, unauthorized } from "../helpers/http-helper";

export class LoginController implements Controller {
    constructor (
        private readonly authentication: Authentication,
        private readonly validation: Validation
    ) {}

    async handle (request: LoginController.Request): Promise<HttpResponse> {
        try {
            const error = this.validation.validate(request)
            if (error) {
                return badRequest(error)
            }
            const authenticationModel = await this.authentication.auth(request)
            if (!authenticationModel) {
                return unauthorized()
            }
            return ok(authenticationModel)
        } catch (error) {
            return serverError(error)
        }
    }
}

export namespace LoginController {
    export type Request = {
        email: string,
        password: string
    }
}