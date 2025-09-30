import { userService } from '../../../src/services/user.service';
import { UserModel } from '../../../src/models/user.model';
import { securityService } from '../../../src/services/security.service';
import mongoose from 'mongoose';

jest.mock('../../../src/models/user.model');
jest.mock('../../../src/services/security.service');

describe('UserService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockUser = {
    _id: new mongoose.Types.ObjectId(),
    username: 'testuser',
    email: 'test@test.com',
    password: 'hashedPassword',
    role: 'buyer',
    toObject: () => ({
        _id: mockUser._id,
        username: mockUser.username,
        email: mockUser.email,
        role: mockUser.role
    })
  };

  describe('signupUser', () => {
    it('debería registrar un nuevo usuario', async () => {
      (UserModel.findOne as jest.Mock).mockResolvedValue(null);
      (securityService.generateToken as jest.Mock).mockResolvedValue('token');
      (securityService.encryptPassword as jest.Mock).mockResolvedValue('hashedPassword');
      (UserModel.create as jest.Mock).mockResolvedValue(mockUser);
      
      const userData = {
          username: 'testuser',
          email: 'test@test.com',
          password: 'password123',
          role: 'buyer',
          _id: mockUser._id,
      } as any;

      const result = await userService.signupUser(userData);
      
      expect(result.user).toEqual(mockUser);
      expect(result.token).toBe('token');
      expect(result.error).toBeNull();
      expect(result.status).toBe(201);
    });

    it('debería devolver un error si el usuario ya existe', async () => {
        (UserModel.findOne as jest.Mock).mockResolvedValue(mockUser);
        const userData = { email: 'test@test.com' } as any;
        const result = await userService.signupUser(userData);
        expect(result.error).toBe('User already exists');
        expect(result.status).toBe(409);
    });
  });

  describe('loginUser', () => {
    it('debería iniciar sesión correctamente', async () => {
        (UserModel.findOne as jest.Mock).mockResolvedValue(mockUser);
        (securityService.comparePassword as jest.Mock).mockResolvedValue(true);
        (securityService.generateToken as jest.Mock).mockResolvedValue('token');
        
        const result = await userService.loginUser('test@test.com', 'password123');

        expect(result.user).toEqual(mockUser);
        expect(result.token).toBe('token');
    });

    it('debería devolver nulo si el usuario no existe', async () => {
        (UserModel.findOne as jest.Mock).mockResolvedValue(null);
        const result = await userService.loginUser('nonexistent@test.com', 'password123');
        expect(result.user).toBeNull();
    });

    it('debería devolver nulo si la contraseña es incorrecta', async () => {
        (UserModel.findOne as jest.Mock).mockResolvedValue(mockUser);
        (securityService.comparePassword as jest.Mock).mockResolvedValue(false);
        const result = await userService.loginUser('test@test.com', 'wrongpassword');
        expect(result.user).toBeNull();
    });
  });

  describe('createUserByAdmin', () => {
    it('debería crear un usuario como administrador', async () => {
        (UserModel.findOne as jest.Mock).mockResolvedValue(null);
        (securityService.encryptPassword as jest.Mock).mockResolvedValue('hashedPassword');
        (UserModel.create as jest.Mock).mockResolvedValue(mockUser);
        
        const userData = { username: 'newuser', email: 'new@test.com', password: 'password', role: 'seller' as any };
        const result = await userService.createUserByAdmin(userData);
        
        expect(result.status).toBe(201);
        expect(result.error).toBeNull();
        expect(result.user).toHaveProperty('username', 'testuser');
    });
  });
});