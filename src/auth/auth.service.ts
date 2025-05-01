import {
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/entities/user.entity';
import { UserRole } from 'src/users/enum/user-role.enum';
import { UsersService } from 'src/users/users.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<User> {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(signUpDto.password, saltRounds);
    const user = await this.usersService.create({
      name: signUpDto.username,
      password: hashedPassword,
      role: UserRole.USER,
      email: signUpDto.email,
    });
    this.logger.log({
      event: 'Successfully signed up',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
    return user;
  }

  async signIn(signInDto: SignInDto): Promise<{ access_token: string }> {
    const user = await this.usersService.findOneByEmail(signInDto.email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const isPasswordMatch = await bcrypt.compare(
      signInDto.password,
      user.password,
    );
    if (!isPasswordMatch) {
      throw new UnauthorizedException('Invalid password');
    }
    const payload = { id: user.id, email: user.email, roles: [user.role] };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
