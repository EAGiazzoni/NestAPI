import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { Tipo } from 'src/tipos/entities/tipo.entity';
import { SenhaVeterinario } from './senhavet';
import { ManyToOne } from 'typeorm';

export class UpdateVeterinarioDto extends PartialType(SenhaVeterinario) {
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
  email?: string;

  @ManyToOne(() => Tipo, (tipo) => tipo.veterinario)
  especializacao?: Tipo;
}
