import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../enum/user-role.enum';

export class UserDto {
  @ApiProperty({ example: 1, description: 'User id' })
  public id: number;

  @ApiProperty({ example: 'John Doe', description: 'User name' })
  public name: string;

  @ApiProperty({ example: 'john.doe@example.com', description: 'User email' })
  public email: string;

  @ApiProperty({ example: '2024-01-01', description: 'Date of last update' })
  public updatedAt: Date;

  @ApiProperty({ example: '2024-01-01', description: 'Date of creation' })
  public createdAt: Date;

  @ApiProperty({ example: 'ADMIN', description: 'User role' })
  public role: UserRole;
}
