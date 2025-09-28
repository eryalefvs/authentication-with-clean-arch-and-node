import { Controller } from "@/presentation/protocols/controller";
import { SignUpController } from "../../presentation/controllers/signup-controller";
import { makeLogControllerDecorator } from "./decorators/log-controller-decorator-factory";
import { makeSignUpValidation } from "./make-signup-validation";
import { makeDbAddAccount } from "./usecases/make-db-add-account";
import { makeDbAuthentication } from "./usecases/make-db-authentication";

export const makeSignupController = (): Controller => {
    const controller = new SignUpController(makeDbAddAccount(), makeSignUpValidation(), makeDbAuthentication())
    return makeLogControllerDecorator(controller)
}