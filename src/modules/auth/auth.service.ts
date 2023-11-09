import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthenticateDto } from './dto/authenticate.dto';
import { UsersRepository } from 'src/shared/repositories/users.repositories';
import { compare, hash } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { SignupDto } from './dto/signup.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepo: UsersRepository,
    private readonly jwtService: JwtService,
  ) {}
  async authenticate(authenticateDto: AuthenticateDto) {
    const user = await this.usersRepo.existUser(authenticateDto.email);

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isPasswordValid = await compare(
      authenticateDto.password,
      user.password,
    );

    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid credentials');

    //Generate JWT

    const accessToken = await this.jwtService.signAsync({ sub: user.id });
    return { accessToken };
  }

  async signup(signupDto: SignupDto) {
    const emailTaken = await this.usersRepo.existUser(signupDto.email);

    if (emailTaken)
      throw new ConflictException('This email is already in use.');

    const hashedPassword = await hash(signupDto.password, 10);
    const user = await this.usersRepo.create({
      data: {
        name: signupDto.name,
        email: signupDto.email,
        password: hashedPassword,
        categories: {
          createMany: {
            data: [
              // Income
              { name: 'Salário', icon: 'salary', type: 'INCOME' },
              { name: 'Freelance', icon: 'freelance', type: 'INCOME' },
              { name: 'Outro', icon: 'other', type: 'INCOME' },
              // Expense
              { name: 'Casa', icon: 'home', type: 'EXPENSE' },
              { name: 'Alimentação', icon: 'food', type: 'EXPENSE' },
              { name: 'Educação', icon: 'education', type: 'EXPENSE' },
              { name: 'Lazer', icon: 'fun', type: 'EXPENSE' },
              { name: 'Mercado', icon: 'grocery', type: 'EXPENSE' },
              { name: 'Roupas', icon: 'clothes', type: 'EXPENSE' },
              { name: 'Transporte', icon: 'transport', type: 'EXPENSE' },
              { name: 'Viagem', icon: 'travel', type: 'EXPENSE' },
              { name: 'Outro', icon: 'other', type: 'EXPENSE' },
            ],
          },
        },
      },
    });
    return { ...user, password: undefined };
  }
}
