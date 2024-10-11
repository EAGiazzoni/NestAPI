import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDTO {
  @ApiProperty({ example: 'exemplo@exemplo.com' })
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'Doidera@456' })
  @IsString()
  @IsNotEmpty({
    message: 'Senha obrigatoria',
  })
  password: string;
}
