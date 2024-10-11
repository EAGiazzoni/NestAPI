import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AnimaisService } from './animais.service';
import { CreateAnimalDonoDTO } from './dto/create-animais-donos.dto';
import { CreateAnimalDto } from './dto/create-animais.dto';
import { UpdateAnimaisDto } from './dto/update-animais.dto';
import { Animais } from './entities/animais.entity';

@ApiTags('animais')
@Controller('animais')
export class AnimaisController {
  constructor(private readonly animaisService: AnimaisService) {}

  @Post('criar')
  @ApiBody({ type: CreateAnimalDto })
  @ApiResponse({
    status: 201,
    description: 'Animal criado com sucesso.',
    type: Animais,
  })
  @ApiResponse({ status: 400, description: 'Requisição inválida.' })
  async create(@Body() createAnimalDto: CreateAnimalDto): Promise<Animais> {
    return await this.animaisService.create(createAnimalDto);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Lista de animais.',
    type: [Animais],
  })
  async findAll() {
    return await this.animaisService.findAll();
  }

  @Get('buscar/:id')
  @ApiResponse({
    status: 200,
    description: 'Animal encontrado.',
    type: Animais,
  })
  @ApiResponse({ status: 404, description: 'Animal não encontrado.' })
  async findOne(@Param('id') id: number) {
    const animal = await this.animaisService.findOne(id);
    if (!animal) {
      throw new NotFoundException({
        message: `Get - Animal com a ID #${id} não encontrado`,
      });
    }
    return animal;
  }

  @Put(':id')
  @ApiBody({ type: UpdateAnimaisDto })
  @ApiResponse({ status: 200, description: 'Animal atualizado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Animal não encontrado.' })
  async update(
    @Param('id') id: number,
    @Body() updateAnimaisDto: UpdateAnimaisDto,
  ) {
    const info = await this.animaisService.update(id, updateAnimaisDto);
    if (!info) {
      throw new NotFoundException({
        message: `Update - Animal com a ID #${id} não encontrado`,
      });
    }
  }

  @Delete(':id')
  @ApiResponse({ status: 204, description: 'Animal removido com sucesso.' })
  @ApiResponse({ status: 404, description: 'Animal não encontrado.' })
  async remove(@Param('id') id: number) {
    const info = await this.animaisService.remove(id);
    if (!info) {
      throw new NotFoundException({
        message: `Delete - Animal com a ID #${id} não encontrado`,
      });
    }
  }

  @Post(':id/dono')
  @ApiBody({ type: CreateAnimalDonoDTO })
  @ApiResponse({
    status: 201,
    description: 'Dono criado para o animal.',
    type: Animais,
  })
  @ApiResponse({ status: 404, description: 'Animal não encontrado.' })
  async createDono(
    @Param('id') id: number,
    @Body() createAnimalDonoDTO: CreateAnimalDonoDTO,
  ): Promise<Animais | null> {
    return await this.animaisService.criarDonoParaAnimal(
      id,
      createAnimalDonoDTO,
    );
  }

  @Put('dono/:id')
  @ApiBody({ type: CreateAnimalDonoDTO })
  @ApiResponse({
    status: 200,
    description: 'Dono atualizado para o animal.',
    type: Animais,
  })
  @ApiResponse({ status: 404, description: 'Animal não encontrado.' })
  async atualizarDono(
    @Param('id') id: number,
    @Body() createAnimalDonoDTO: CreateAnimalDonoDTO,
  ): Promise<Animais | null> {
    return await this.animaisService.atualizarDonoParaAnimal(
      id,
      createAnimalDonoDTO,
    );
  }

  @Delete('dono/:id')
  @ApiResponse({
    status: 204,
    description: 'Dono removido do animal com sucesso.',
  })
  @ApiResponse({ status: 404, description: 'Animal não encontrado.' })
  async deletarDono(
    @Param('id') id: number,
    @Body() createAnimalDonoDTO: CreateAnimalDonoDTO,
  ): Promise<Animais | null> {
    return await this.animaisService.deletarDonoParaAnimal(
      id,
      createAnimalDonoDTO,
    );
  }
}
