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
import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from 'src/auth/decorators/currentuser.decorator';
import { IsPublic } from 'src/auth/decorators/ispublic.decorator';
import { VeterinarioDto } from './dto/create-veterinario.dto';
import { Veterinario } from './entities/veterinario.entity';
import { VeterinariosService } from './veterinarios.service';
import { UpdateVeterinarioDto } from './dto/update-veterinario.dto';

@ApiTags('Veterinários')
@Controller('veterinarios')
export class VeterinariosController {
  constructor(private readonly veterinarioService: VeterinariosService) {}

  @Get('user')
  @ApiResponse({ status: 200, description: 'Retorna o veterinário atual.' })
  getUser(@CurrentUser() user: Veterinario): Veterinario {
    return user;
  }

  @Get()
  @IsPublic()
  @ApiResponse({ status: 200, description: 'Busca todos os veterinários.' })
  async getVeterinario(): Promise<Veterinario[]> {
    return this.veterinarioService.getAll();
  }

  @Get(':id')
  @IsPublic()
  @ApiParam({ name: 'id', type: Number, description: 'ID do veterinário.' })
  @ApiNotFoundResponse({
    status: 404,
    description: 'Veterinário não encontrado.',
  })
  @ApiResponse({
    status: 200,
    description: 'Busca um veterinário por ID.',
    type: Veterinario,
  })
  async getOneVeterinario(@Param('id') id: number): Promise<Veterinario> {
    const data = await this.veterinarioService.findOne(id);
    if (!data) {
      throw new NotFoundException(`Veterinário com ID #${id} não encontrado.`);
    }
    return data;
  }

  @Post()
  @IsPublic()
  @ApiCreatedResponse({
    status: 201,
    description: 'Cria um veterinário.',
    type: Veterinario,
  })
  async create(@Body() veterinario: VeterinarioDto): Promise<Veterinario> {
    return this.veterinarioService.createVet(veterinario);
  }

  @Put(':id')
  @IsPublic()
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID do veterinário a ser atualizado.',
  })
  @ApiResponse({
    status: 200,
    description: 'Atualiza o nome ou email do veterinário.',
    type: Veterinario,
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'Veterinário não encontrado para atualização.',
  })
  async update(
    @Param('id') id: number,
    @Body() veterinario: UpdateVeterinarioDto,
  ): Promise<Veterinario> {
    const data = await this.veterinarioService.update(id, veterinario);
    if (!data) {
      throw new NotFoundException(
        `Veterinário com ID #${id} não encontrado para atualização.`,
      );
    }
    return data;
  }

  @Delete(':id')
  @IsPublic()
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID do veterinário a ser deletado.',
  })
  @ApiResponse({ status: 204, description: 'Deleta um veterinário.' })
  @ApiNotFoundResponse({
    status: 404,
    description: 'Veterinário não encontrado para deleção.',
  })
  async deleteVeterinario(@Param('id') id: number): Promise<void> {
    const result = await this.veterinarioService.destroy(id);
    if (!result) {
      throw new NotFoundException(
        `Veterinário com ID #${id} não encontrado para deleção.`,
      );
    }
  }
}
