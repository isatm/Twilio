import {
    ChangePasswordDto,
    CreateUserDto,
    LoginDto,
    UpdateUserDto,
    VerifyUserDto,
  } from '../dto/user.dto';
  
  export interface User {
    _id?: string;          // MongoDB 
    id?: string;           
    name: string;
    email: string;
    phone: string;    // + Codigo cambiado +
    isVerified: boolean;
    role: string;
    refreshToken?: string;
    verificationCode?: string;
    verificationCodeExpires?: Date;
    createdAt?: Date;
    updatedAt?: Date;
  }
  
  export interface UserServiceInterface {
    create(createUserDto: CreateUserDto): Promise<User>;
    findAll(): Promise<User[]>;
    findOne(id: string): Promise<User>;
    findByEmail(email: string): Promise<User>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<User>;
    remove(id: string): Promise<void>;
    // + Codigo cambiado 
    verifyUser(id: string, verifyUserDto: VerifyUserDto): Promise<{ accessToken: string; refreshToken: string; user: User }>;
    login(
      loginDto: LoginDto,
    ): Promise<User>;
    // ------------------+
    refreshToken(
      refreshToken: string,
    ): Promise<{ accessToken: string; refreshToken: string }>;
    changePassword(
      id: string,
      changePasswordDto: ChangePasswordDto,
    ): Promise<void>;
  }
  