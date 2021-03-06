/* eslint-disable @typescript-eslint/no-unused-vars */
import { makeSignUpValidation } from '@/main/factories/controllers/login/signup/signup-validation-factory';
import { Validation } from '@/presentation/protocols/validation';
import {
  EmailValidation,
  ValidationComposite,
  RequiredFieldValidation,
  CompareFieldsValidation,
} from '@/validation/validators';
import { EmailValidator } from '@/validation/protocols/email-validator';

jest.mock('@/validation/validators/validation-composite');

const mockEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    public isValid(email: string): boolean {
      return true;
    }
  }

  return new EmailValidatorStub();
};

describe('SignUpValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeSignUpValidation();
    const validations: Validation[] = [];
    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
      validations.push(new RequiredFieldValidation(field));
    }
    validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'));
    validations.push(new EmailValidation('email', mockEmailValidator()));
    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
