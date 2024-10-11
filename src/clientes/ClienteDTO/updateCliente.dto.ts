import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class UpdateClienteDto {
  @IsString({
    message: 'String obrigatória',
  })
  @MaxLength(50, {
    message: 'O nome do animal deve ter até 50 caracteres',
  })
  @IsNotEmpty({
    message: 'O nome do animal é obrigatório!',
  })
  name?: string;

  @IsOptional()
  @IsArray()
  animalsId?: number[];
}
