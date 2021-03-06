/* eslint-disable @typescript-eslint/no-unused-vars */
import { DbLoadAccountByToken } from '@/data/usecases/account/load-account-by-token/db-load-account-by-token';
import {
  Decrypter,
  LoadAccountByTokenRepository,
} from '../usecases/account/load-account-by-token/db-load-account-by-token-protocols';
import { mockAccountModel, throwError } from '@/domain/test';
import { LoadAccountByTokenRepositorySpy, mockDecrypter } from '../mocks';

type SutTypes = {
  sut: DbLoadAccountByToken;
  decypterStub: Decrypter;
  loadAccountByTokenRepositoryStub: LoadAccountByTokenRepository;
};

const mockSut = (role?: string): SutTypes => {
  const decypterStub = mockDecrypter();
  const loadAccountByTokenRepositoryStub = new LoadAccountByTokenRepositorySpy();
  const sut = new DbLoadAccountByToken(decypterStub, loadAccountByTokenRepositoryStub);

  return {
    sut,
    decypterStub,
    loadAccountByTokenRepositoryStub,
  };
};

describe('DbLoadAccountByToken Usecase', () => {
  test('Should call Decrypter with correct values', async () => {
    const { sut, decypterStub } = mockSut();
    const decryptSpy = jest.spyOn(decypterStub, 'decrypt');
    await sut.load('any_token', 'any_role');
    expect(decryptSpy).toHaveBeenCalledWith('any_token');
  });

  test('Should return null if Decrypter returns null', async () => {
    const { sut, decypterStub } = mockSut();
    jest.spyOn(decypterStub, 'decrypt').mockReturnValueOnce(Promise.resolve(null));
    const account = await sut.load('any_token');
    expect(account).toBeNull();
  });

  test('Should call LoadAccountByTokenRepository with correct values', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = mockSut();
    const loadByTokenSpy = jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken');
    await sut.load('any_token', 'any_role');
    expect(loadByTokenSpy).toHaveBeenCalledWith('any_token', 'any_role');
  });

  test('Should return null if LoadAccountByTokenRepository returns null', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = mockSut();
    jest
      .spyOn(loadAccountByTokenRepositoryStub, 'loadByToken')
      .mockReturnValueOnce(Promise.resolve(null));
    const account = await sut.load('any_token', 'any_role');
    expect(account).toBeNull();
  });

  test('Should return an account on success', async () => {
    const { sut } = mockSut();
    const account = await sut.load('any_token', 'any_role');
    expect(account).toEqual(mockAccountModel());
  });

  test('Should return null if Decrypter throws', async () => {
    const { sut, decypterStub } = mockSut();
    jest.spyOn(decypterStub, 'decrypt').mockImplementation(throwError);
    const account = await sut.load('any_token', 'any_role');
    expect(account).toBeNull();
  });

  test('Should throw if LoadAccountByTokenRepository throws', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = mockSut();

    jest
      .spyOn(loadAccountByTokenRepositoryStub, 'loadByToken')
      .mockReturnValueOnce(Promise.reject(new Error()));
    const promise = sut.load('any_token', 'any_role');
    await expect(promise).rejects.toThrow();
  });
});
