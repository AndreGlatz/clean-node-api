import { CompareFieldsValidation } from '@/validation/validators';
import { InvalidParamError } from '@/presentation/errors';

const mockSut = (): CompareFieldsValidation => {
  return new CompareFieldsValidation('field', 'fieldToCompare');
};

describe('CompareFieldsValidation Validation', () => {
  test('Should return a InvalidParamError if a validation fails', () => {
    const sut = mockSut();
    const error = sut.validate({ field: 'any_value', fieldToCompare: 'wrong_value' });
    expect(error).toEqual(new InvalidParamError('fieldToCompare'));
  });

  test('Should not return if validation succeeds', () => {
    const sut = mockSut();
    const error = sut.validate({ field: 'any_value', fieldToCompare: 'any_value' });
    expect(error).toBeFalsy();
  });
});
