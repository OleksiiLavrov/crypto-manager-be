import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  private logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const user = this.userRepository.create(createUserDto);
      const savedUser = await this.userRepository.save(user);

      this.logger.log({
        event: 'Successfully created user',
        createUserDto,
      });

      return savedUser;
    } catch (error) {
      this.logger.error({
        event: 'Error while creating user',
        stack: error.stack,
      });
      throw new BadRequestException(error);
    }
  }

  async findAll(includeRelations = false): Promise<User[]> {
    const users = await this.userRepository.find({
      relations: includeRelations ? ['coins'] : undefined,
    });
    return users;
  }

  async findOneByName(name: string, includeRelations = false): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { name },
      relations: includeRelations ? ['coins'] : undefined,
    });
    return user;
  }

  async findOneByEmail(email: string, includeRelations = false): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: includeRelations ? ['coins'] : undefined,
    });
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      await this.userRepository.update(id, updateUserDto);
      return this.userRepository.findOne({ where: { id } });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}
