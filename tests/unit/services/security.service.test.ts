import { securityService } from '../../../src/services/security.service';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('SecurityService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('encryptPassword', () => {
    it('debería encriptar una contraseña', async () => {
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      const result = await securityService.encryptPassword('password123');
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(result).toBe('hashedPassword');
    });
  });

  describe('generateToken', () => {
    it('debería generar un token JWT', async () => {
      (jwt.sign as jest.Mock).mockReturnValue('jwt-token');
      const id = new mongoose.Types.ObjectId();
      const result = await securityService.generateToken(id, 'test@test.com', 'buyer');
      expect(jwt.sign).toHaveBeenCalledWith(
        { _id: id, email: 'test@test.com', role: 'buyer' },
        'secret',
        { expiresIn: '1h' }
      );
      expect(result).toBe('jwt-token');
    });
  });

  describe('comparePassword', () => {
    it('debería comparar contraseñas y devolver true si coinciden', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      const result = await securityService.comparePassword('password123', 'hashedPassword');
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPassword');
      expect(result).toBe(true);
    });

    it('debería comparar contraseñas y devolver false si no coinciden', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);
      const result = await securityService.comparePassword('wrongPassword', 'hashedPassword');
      expect(result).toBe(false);
    });
  });

  describe('verifyToken', () => {
    it('debería verificar un token y devolver los datos decodificados', () => {
      const decodedData = { id: 'user-id', email: 'test@test.com', role: 'buyer' };
      (jwt.verify as jest.Mock).mockReturnValue(decodedData);
      const result = securityService.verifyToken('jwt-token');
      expect(jwt.verify).toHaveBeenCalledWith('jwt-token', 'secret');
      expect(result).toEqual(decodedData);
    });

    it('debería devolver null si el token no es válido', () => {
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid token');
      });
      const result = securityService.verifyToken('invalid-token');
      expect(result).toBeNull();
    });
  });
});