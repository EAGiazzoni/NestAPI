import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTipoDto {
  @ApiProperty()
  @IsNotEmpty({
    message: 'Deve conter um TIPO',
  })
  @IsString({
    message: 'O TIPO precisa ser uma String',
  })
  name: string;
}
