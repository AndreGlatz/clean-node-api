/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable no-useless-constructor */
import { Validation } from '../../presentation/protocols/validation'
import { EmailValidator } from '../protocols/email-validator'
import { InvalidParamError } from '../../presentation/errors'

export class EmailValidation implements Validation {
  constructor (
    private readonly fieldName: string,
     private readonly emailValidator: EmailValidator
  ) {}

  validate (input: any): Error | null {
    const isValid = this.emailValidator.isValid(input[this.fieldName])
    if (!isValid) {
      return new InvalidParamError('email')
    }
    return null
  }
}