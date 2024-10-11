import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags, ApiParam } from '@nestjs/swagger';
import { CreateTipoDto } from './dto/create-tipo.dto';
import { UpdateTipoDto } from './dto/update-tipo.dto';
import { Tipo } from './entities/tipo.entity';
import { TiposService } from './tipos.service';

@ApiTags('tipos')
@Controller('tipos')
export class TiposController {
  constructor(private readonly tiposService: TiposService) {}

  @Post('criar')
  @HttpCode(201)
  @ApiBody({ type: CreateTipoDto })
  @ApiResponse({
    status: 201,
    description: 'Tipo de animal criado com sucesso.',
    type: Tipo,
  })
  @ApiResponse({ status: 400, description: 'Erro de validação.' })
  async create(@Body() createTipoDto: CreateTipoDto): Promise<Tipo> {
    return this.tiposService.create(createTipoDto);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Lista de tipos de animais.',
    type: [Tipo],
  })
  async findAll(): Promise<Tipo[]> {
    return await this.tiposService.findAll();
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: Number, description: 'ID do tipo de animal.' })
  @ApiResponse({
    status: 200,
    description: 'Tipo de animal encontrado.',
    type: Tipo,
  })
  @ApiResponse({ status: 404, description: 'Tipo de animal não encontrado.' })
  async findOne(@Param('id') id: number): Promise<Tipo> {
    const buscarTipo = await this.tiposService.findOne(id);
    if (!buscarTipo) {
      throw new NotFoundException({
        message: `Tipo do animal com ID #${id} não foi encontrado`,
      });
    }
    return buscarTipo;
  }

  @Put(':id')
  @HttpCode(200)
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID do tipo de animal a ser atualizado.',
  })
  @ApiBody({ type: UpdateTipoDto })
  @ApiResponse({
    status: 200,
    description: 'Tipo de animal atualizado com sucesso.',
    type: Tipo,
  })
  @ApiResponse({ status: 404, description: 'Tipo de animal não encontrado.' })
  async update(
    @Param('id') id: number,
    @Body() updateTipoDto: UpdateTipoDto,
  ): Promise<Tipo> {
    const alteracao = await this.tiposService.update(id, updateTipoDto);
    if (!alteracao) {
      throw new NotFoundException({
        message: `Tipo do animal com ID #${id} não foi encontrado para realizar as alterações`,
      });
    }
    return alteracao;
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID do tipo de animal a ser removido.',
  })
  @ApiResponse({
    status: 204,
    description: 'Tipo de animal removido com sucesso.',
  })
  @ApiResponse({ status: 404, description: 'Tipo de animal não encontrado.' })
  async remove(@Param('id') id: number): Promise<void> {
    const explode = await this.tiposService.remove(id);
    if (!explode) {
      throw new NotFoundException({
        message: `Tipo de animal com ID #${id} não existe para ser deletado`,
      });
    }
  }
}
