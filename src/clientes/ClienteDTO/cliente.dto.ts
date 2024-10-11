import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ClienteDTO {
  @IsString({ message: 'O nome deve conter apenas letras' })
  @IsNotEmpty({ message: 'Informe o nome do Cliente' })
  name: string;
  @IsNotEmpty({ message: 'Informe o contato do Cliente' })
  contato: string;
  @IsArray()
  @IsOptional()
  animalsId?: number[];
}
