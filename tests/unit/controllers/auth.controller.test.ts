import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import type { Request, Response } from 'express';
import { authController } from '../../../src/controllers/auth.controller';
import { userService } from '../../../src/services/user.service';

jest.mock('../../../src/services/user.service');

const mockedUserService = userService as jest.Mocked<typeof userService>;

const makeRes = (): Response => {
  const res = {} as Response;
  res.status = jest.fn((code?: number) => res) as unknown as (code: number) => Response;
  res.json = jest.fn((_?: any) => res);
  return res;
};

const makeReq = (overrides: Partial<Request> = {}): Request => {
  return { body: {}, headers: {}, params: {}, ...overrides } as Request;
};

describe('AuthController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('signup', () => {
    it('debería manejar el error cuando el usuario ya existe', async () => {
      const req = makeReq({ body: { email: 'test@test.com', password: '123', username: 'test' } });
      const res = makeRes();
      mockedUserService.signupUser.mockResolvedValue({
        user: null,
        token: null,
        error: 'User already exists',
        status: 409
      });

      await authController.signup(req, res);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({ message: 'User already exists' });
    });

    it('debería manejar errores inesperados del servidor', async () => {
        const req = makeReq({ body: { email: 'test@test.com', password: '123', username: 'test' } });
        const res = makeRes();
        const error = new Error('Internal Server Error');
        mockedUserService.signupUser.mockRejectedValue(error);

        await authController.signup(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith(error);
    });
  });

  describe('login', () => {
    it('debería manejar errores inesperados del servidor', async () => {
        const req = makeReq({ body: { email: 'test@test.com', password: '123' } });
        const res = makeRes();
        const error = new Error('DB connection failed');
        mockedUserService.loginUser.mockRejectedValue(error);

        await authController.login(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith(error);
    });
  });

  describe('getProfile', () => {
    it('debería retornar 401 si el token es inválido', async () => {
      const req = makeReq({ headers: { authorization: 'Bearer invalid-token' } });
      const res = makeRes();
      mockedUserService.getUserByToken.mockResolvedValue(null);

      await authController.getProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid token' });
    });

     it('debería manejar errores inesperados del servidor', async () => {
        const req = makeReq({ headers: { authorization: 'Bearer valid-token' } });
        const res = makeRes();
        const error = new Error('Something went wrong');
        mockedUserService.getUserByToken.mockRejectedValue(error);

        await authController.getProfile(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith(error);
    });
  });
});

describe('AuthController Adicional', () => {
    it('signup debería retornar 400 si el body está vacío', async () => {
      const req = makeReq({ body: {} });
      const res = makeRes();
      await authController.signup(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Email, password, and username are required" });
    });

    it('login debería retornar 400 si el body está vacío', async () => {
        const req = makeReq({ body: {} });
        const res = makeRes();
        await authController.login(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: "Email and password are required" });
    });

    it('getProfile debería manejar un error del servidor', async () => {
        const req = makeReq({ headers: { authorization: 'Bearer good-token' } });
        const res = makeRes();
        const error = new Error("DB Error");
        mockedUserService.getUserByToken.mockRejectedValue(error);
        await authController.getProfile(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith(error);
    });
});
