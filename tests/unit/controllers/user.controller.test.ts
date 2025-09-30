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
  return { body: {}, params: {}, ...overrides } as Request;
};

describe('UserController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getUserById', () => {
    it('debería retornar 400 si no se proporciona el ID', async () => {
        const req = makeReq();
        const res = makeRes();
        await userController.getUserById(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'User ID is missing' });
    });
  });

  describe('updateUser', () => {
    it('debería actualizar un usuario y devolverlo', async () => {
        const updatedUser = { username: 'updated-user' };
        mockedUserService.updateUser.mockResolvedValue(updatedUser as any);
        const req = makeReq({ params: { id: 'some-id' }, body: { username: 'updated-user' } });
        const res = makeRes();
        await userController.updateUser(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(updatedUser);
    });

    it('debería retornar 404 si el usuario a actualizar no se encuentra', async () => {
        mockedUserService.updateUser.mockResolvedValue(null);
        const req = makeReq({ params: { id: 'not-found-id' }, body: { username: 'updated-user' } });
        const res = makeRes();
        await userController.updateUser(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
    });
  });

  describe('deleteUser', () => {
    it('debería retornar 404 si el usuario a eliminar no se encuentra', async () => {
        mockedUserService.deleteUser.mockResolvedValue(null);
        const req = makeReq({ params: { id: 'not-found-id' } });
        const res = makeRes();
        await userController.deleteUser(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
    });
  });
});

describe('UserController Adicional', () => {
    it('getAllUsers debería manejar errores del servidor', async () => {
        const req = makeReq();
        const res = makeRes();
        const error = new Error("DB Error");
        mockedUserService.getAllUsers.mockRejectedValue(error);
        await userController.getAllUsers(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith(error);
    });

    it('createUser debería crear un usuario exitosamente', async () => {
        const userData = { username: 'test', email: 'test@test.com', password: '123', role: 'buyer' };
        const req = makeReq({ body: userData });
        const res = makeRes();
        mockedUserService.createUser.mockResolvedValue(userData as any);
        await userController.createUser(req, res);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(userData);
    });

    it('createUserByAdmin debería retornar error si los datos son inválidos', async () => {
        const req = makeReq({ body: {} });
        const res = makeRes();
        await userController.createUserByAdmin(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: "User data is required" });
    });

    it('updateUser debería retornar 400 si no hay ID', async () => {
        const req = makeReq({ body: { username: 'new' } });
        const res = makeRes();
        await userController.updateUser(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: "User ID is missing" });
    });
    
    it('deleteUser debería manejar errores del servidor', async () => {
        const req = makeReq({ params: { id: 'some-id' } });
        const res = makeRes();
        const error = new Error("Deletion failed");
        mockedUserService.deleteUser.mockRejectedValue(error);
        await userController.deleteUser(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith(error);
    });
});