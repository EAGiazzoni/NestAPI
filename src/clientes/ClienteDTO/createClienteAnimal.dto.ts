import { IsArray } from 'class-validator';

export class CreateClienteAnimalDto {
  @IsArray()
  animalsId: number[];
}
