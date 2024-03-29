import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignUp, signIn } from './interfaces/auth.interface';
import { hash, compare } from 'bcrypt';
import { UserRepository } from 'src/users/users.repository';

const SALT = 10;

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
  ) {}

  async signUp(user: SignUp) {
    const isUserExist = await this.userRepository.findOne({
      email: user.email,
    });

    if (isUserExist) {
      throw new UnauthorizedException('User already exists');
    }

    const hashedPassword = await hash(user.password, SALT);

    const userCreated = await this.userRepository.create({
      username: user.username,
      email: user.email,
      hashed_password: hashedPassword,
    });

    const payload = { username: userCreated.username, sub: userCreated.id };

    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }

  async signIn(user: signIn) {
    const userFound = await this.userRepository.findOne({ email: user.email });

    if (!userFound) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await compare(
      user.password,
      userFound.hashed_password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid Password');
    }

    const payload = { sub: userFound.id };

    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }
}
