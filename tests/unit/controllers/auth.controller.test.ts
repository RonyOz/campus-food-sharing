import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import type { Request, Response } from 'express';
import { authController } from '../../../src/controllers/auth.controller';
import { userService } from '../../../src/services/user.service';

// Hacemos mock del service para aislar el controlador
jest.mock('../../../src/services/user.service');

// Tipamos explícitamente los mocks de los servicios
const mockedUserService = userService as jest.Mocked<typeof userService>;

const makeRes = (): Response => {
  const res: Partial<Response> = {};
  res.status = jest.fn((code?: number) => res as Response);
  res.json = jest.fn((body?: any) => res as Response);
  return res as Response;
};

const makeReq = (overrides: Partial<Request> = {}): Request => {
  const req = { body: {}, headers: {}, params: {}, ...overrides };
  return req as Request;
};

describe('AuthController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('signup', () => {
    it('debería retornar 400 si faltan datos', async () => {
      const req = makeReq({ body: { email: 'test@test.com' } });
      const res = makeRes();
      await authController.signup(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Email, password, and username are required" });
    });

    it('debería registrar un usuario y retornar 201', async () => {
      const req = makeReq({ body: { email: 'test@test.com', password: '123', username: 'test' } });
      const res = makeRes();
      mockedUserService.signupUser.mockResolvedValue({ user: {} as any, token: 'fake-token', error: null, status: 201 });
      await authController.signup(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ message: "Signup succesful", token: 'fake-token' });
    });
  });

  describe('login', () => {
    it('debería retornar 401 para credenciales inválidas', async () => {
        const req = makeReq({ body: { email: 'test@test.com', password: 'wrong' } });
        const res = makeRes();
        mockedUserService.loginUser.mockResolvedValue({ user: null, token: null });
        await authController.login(req, res);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
    });

    it('debería retornar 200 en un login exitoso', async () => {
      const req = makeReq({ body: { email: 'test@test.com', password: '123' } });
      const res = makeRes();
      mockedUserService.loginUser.mockResolvedValue({ user: { id: 1 } as any, token: 'fake-token' });
      await authController.login(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "Login succesful", token: 'fake-token' });
    });
  });

  describe('getProfile', () => {
    it('debería retornar el perfil del usuario con un token válido', async () => {
      const user = { toObject: () => ({ id: 1, name: 'Test' }) };
      const req = makeReq({ headers: { authorization: 'Bearer fake-token' } });
      const res = makeRes();
      mockedUserService.getUserByToken.mockResolvedValue(user as any);
      await authController.getProfile(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ user: { id: 1, name: 'Test' } });
    });
  });
});