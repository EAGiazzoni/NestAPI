import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Column } from 'typeorm';

export class SenhaVeterinario {
  @ApiProperty({
    example: 'Doidera@456',
    description:
      'A senha sera usada para login do funcionario, sera de no minimo 4 caracteres até 20 caracteres. Não pode ser nula e precisa ter no minimo 1 caractere especial, 1 letra maiuscula e numeros.',
  })
  @IsString({
    message: 'Apenas letras',
  })
  @IsNotEmpty({
    message: 'Nome obrigatorio',
  })
  @MinLength(4, {
    message: 'A senha deve ter no minimo 4 caracteres!',
  })
  @MaxLength(20, {
    message: 'A senha deve ter no maximo 20 caracteres!',
  })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'A senha deve conter pelo menos uma letra maiúscula, uma letra minúscula, um número ou um símbulo!',
  })
  @Column({ select: false })
  password: string;
}
