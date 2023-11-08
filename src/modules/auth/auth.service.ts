import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthenticateDto } from './dto/authenticate.dto';
import { UsersRepository } from 'src/shared/repositories/users.repositories';
import { compare } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

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
}
