import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { SenhaVeterinario } from './senhavet';

export class VeterinarioDto extends PartialType(SenhaVeterinario) {
  @ApiProperty({ example: 'José Maria de Mattos Netto' })
  @IsString({
    message: 'Apenas letras',
  })
  @IsNotEmpty({
    message: 'Nome obrigatorio',
  })
  @MaxLength(120)
  name?: string;

  @ApiProperty({ example: 'exemplo@exemplo.com' })
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email?: string;
}
