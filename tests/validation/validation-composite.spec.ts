/* eslint-disable @typescript-eslint/no-unused-vars */
import { ValidationComposite } from '@/validation/validators';
import { MissingParamError } from '@/presentation/errors';
import { Validation } from '@/presentation/protocols';
import { mockValidation } from '@/validation/test';

type SutTypes = {
  sut: ValidationComposite;
  validationStubs: Validation[];
};
const mockSut = (): SutTypes => {
  const validationStubs = [mockValidation(), mockValidation()];
  const sut = new ValidationComposite(validationStubs);

  return {
    sut,
    validationStubs,
  };
};

describe('Validation Composite', () => {
  test('Should return an error if any validation fails', () => {
    const { sut, validationStubs } = mockSut();
    jest
      .spyOn(validationStubs[1], 'validate')
      .mockReturnValueOnce(new MissingParamError('field'));
    const error = sut.validate({ field: 'any_value' });
    expect(error).toEqual(new MissingParamError('field'));
  });

  test('Should return the first error if more validation fails', () => {
    const { sut, validationStubs } = mockSut();
    jest
      .spyOn(validationStubs[1], 'validate')
      .mockReturnValueOnce(new MissingParamError('field'));
    const error = sut.validate({ field: 'any_value' });
    expect(error).toEqual(new MissingParamError('field'));
  });

  test('Should return the first error if more then one validation fails', () => {
    const { sut, validationStubs } = mockSut();
    jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(new Error());
    jest
      .spyOn(validationStubs[1], 'validate')
      .mockReturnValueOnce(new MissingParamError('field'));
    const error = sut.validate({ field: 'any_value' });
    expect(error).toEqual(new Error());
  });

  test('Should not return if validation succeeds', () => {
    const { sut } = mockSut();
    const error = sut.validate({ field: 'any_value' });
    expect(error).toBeFalsy();
  });
});
