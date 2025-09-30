import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import type { Request, Response } from 'express';
import { userController } from '../../../src/controllers/user.controller';
import { userService } from '../../../src/services/user.service';

jest.mock('../../../src/services/user.service');

const mockedUserService = userService as jest.Mocked<typeof userService>;

const makeRes = (): Response => {
  const res: Partial<Response> = {};
  res.status = jest.fn((_code?: number) => res as Response) as Response['status'];
  res.json = jest.fn().mockImplementation((_body?: any) => res as Response) as unknown as Response['json'];
  res.send = jest.fn().mockImplementation((_body?: any) => res as Response) as unknown as Response['send'];
  return res as Response;
};

const makeReq = (overrides: Partial<Request> = {}): Request => {
  const req = { body: {}, params: {}, ...overrides };
  return req as Request;
};

describe('UserController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllUsers', () => {
    it('debería retornar una lista de usuarios con estado 200', async () => {
      const users = [{ username: 'user1' }, { username: 'user2' }];
      mockedUserService.getAllUsers.mockResolvedValue(users as any);
      const req = makeReq();
      const res = makeRes();
      await userController.getAllUsers(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(users);
    });
  });

  describe('getUserById', () => {
    it('debería retornar un usuario con estado 200 si existe', async () => {
      const user = { username: 'found-user' };
      mockedUserService.getUserById.mockResolvedValue(user as any);
      const req = makeReq({ params: { id: 'existent-id' } });
      const res = makeRes();
      await userController.getUserById(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(user);
    });
  });

  describe('createUserByAdmin', () => {
    it('debería crear un usuario y retornar 201', async () => {
      const user = {
        _id: 'some-id',
        username: 'new-user',
        email: 'a@a.com',
        role: 'buyer',
        set: jest.fn(),
        get: jest.fn(),
      } as any;
      mockedUserService.createUserByAdmin.mockResolvedValue({ user, error: null, status: 201 });
      const req = makeReq({ body: { username: 'new-user', email: 'a@a.com', password: '123', role: 'buyer' } });
      const res = makeRes();
      await userController.createUserByAdmin(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(user);
    });
  });

  describe('deleteUser', () => {
    it('debería eliminar un usuario y retornar 204', async () => {
      mockedUserService.deleteUser.mockResolvedValue({ id: 'deleted-id' } as any);
      const req = makeReq({ params: { id: 'deleted-id' } });
      const res = makeRes();
      await userController.deleteUser(req, res);
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });
  });
});