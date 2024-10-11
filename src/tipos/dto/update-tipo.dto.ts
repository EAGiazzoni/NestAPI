import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateTipoDto } from './create-tipo.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateTipoDto extends PartialType(CreateTipoDto) {
  @ApiProperty()
  @IsNotEmpty({
    message: 'A atualização deve conter um TIPO',
  })
  @IsString({
    message: 'O tipo da atualização precisa ser uma String',
  })
  name: string;
}
