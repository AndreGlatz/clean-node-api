import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper';
import { AccountMongoRepository } from '@/infra/db/mongodb/repositories';
import { Collection } from 'mongodb';
import { mockAddAccountParams } from '@/domain/test/index';

let accountCollection: Collection;

describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts');
    accountCollection.deleteMany({});
  });

  const mockSut = (): AccountMongoRepository => {
    return new AccountMongoRepository();
  };

  describe('add()', () => {
    test('Should return an account on add success', async () => {
      const sut = mockSut();

      const account = await sut.add(mockAddAccountParams());

      expect(account).toBe(true);
    });
  });

  describe('loadByEmail()', () => {
    test('Should return an account on loadByEmail success', async () => {
      const sut = mockSut();
      await accountCollection.insertOne(mockAddAccountParams());

      const account = await sut.loadByEmail('any_email@mail.com');

      expect(account).toBeTruthy();
      expect(account?.id).toBeTruthy();
      expect(account?.name).toBe('any_name');
      expect(account?.password).toBe('any_password');
    });

    test('Should return null if loadByEmail fails', async () => {
      const sut = mockSut();
      const account = await sut.loadByEmail('any_email@mail.com');
      expect(account).toBeFalsy();
    });
  });

  describe('checkByEmail()', () => {
    test('Should return true if email is valid', async () => {
      const sut = mockSut();
      await accountCollection.insertOne(mockAddAccountParams());

      const account = await sut.checkByEmail('any_email@mail.com');

      expect(account).toBe(true);
    });

    test('Should return false if email is invalid', async () => {
      const sut = mockSut();
      const account = await sut.checkByEmail('any_email@mail.com');
      expect(account).toBeFalsy();
    });
  });

  describe('updateAccessToken()', () => {
    test('Should update the account accessToken on updateAccessToken success', async () => {
      const sut = mockSut();

      const result = await accountCollection.insertOne(mockAddAccountParams());

      let account = result.ops[0];

      expect(account.accessToken).toBeFalsy();

      await sut.updateAccessToken(account._id, 'any_token');
      account = await accountCollection.findOne({ _id: account._id });

      expect(account).toBeTruthy();
      expect(account.accessToken).toBe('any_token');
    });
  });

  describe('loadByToken()', () => {
    test('Should return an account on loadByToken without role', async () => {
      const sut = mockSut();
      await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        accessToken: 'any_token',
      });

      const account = await sut.loadByToken('any_token');

      expect(account).toBeTruthy();
      expect(account?.id).toBeTruthy();
    });

    test('Should return an account on loadByToken with admin role', async () => {
      const sut = mockSut();
      await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        accessToken: 'any_token',
        role: 'admin',
      });

      const account = await sut.loadByToken('any_token', 'admin');

      expect(account).toBeTruthy();
      expect(account?.id).toBeTruthy();
    });

    test('Should return null on loadByToken with invalid role', async () => {
      const sut = mockSut();
      await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        accessToken: 'any_token',
      });

      const account = await sut.loadByToken('any_token', 'admin');

      expect(account).toBeFalsy();
    });

    test('Should return an account on loadByToken with if user is admin', async () => {
      const sut = mockSut();
      await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        accessToken: 'any_token',
        role: 'admin',
      });

      const account = await sut.loadByToken('any_token');

      expect(account).toBeTruthy();
      expect(account?.id).toBeTruthy();
    });

    test('Should return null if loadByToken fails', async () => {
      const sut = mockSut();
      const account = await sut.loadByToken('any_token');
      expect(account).toBeFalsy();
    });
  });
});
