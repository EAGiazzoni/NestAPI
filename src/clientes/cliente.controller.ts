import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  InternalServerErrorException,
  NotAcceptableException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ClienteService } from './cliente.service';
import { ClienteDTO } from './ClienteDTO/cliente.dto';
import { Cliente } from './ClienteEnt/cliete.entity';
import { UpdateClienteDto } from './ClienteDTO/updateCliente.dto';

@ApiTags('clientes')
@Controller('clientes')
export class ClienteController {
  constructor(private servicoCliente: ClienteService) {}

  @Get('buscar')
  @ApiResponse({
    status: 200,
    description: 'Lista de clientes.',
    type: [Cliente],
  })
  async findAll(): Promise<Cliente[]> {
    return this.servicoCliente.findAll();
  }

  @Post('criar')
  @ApiBody({ type: ClienteDTO })
  @ApiResponse({ status: 201, description: 'Cliente criado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Erro de validação.' })
  @ApiResponse({ status: 500, description: 'Erro ao criar o cliente.' })
  async create(@Body() criarCliente: ClienteDTO): Promise<{ message: string }> {
    try {
      await this.servicoCliente.create(criarCliente);
      return { message: 'Cliente Criado' };
    } catch (e) {
      throw new BadRequestException('Erro de validação: ' + e.message);
    }
    throw new InternalServerErrorException('Erro ao criar o cliente');
  }

  @Put(':id')
  @ApiBody({ type: UpdateClienteDto })
  @ApiResponse({ status: 200, description: 'Cliente atualizado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado.' })
  async update(
    @Param('id') id: number,
    @Body() updateClienteDto: UpdateClienteDto,
  ): Promise<{ message: string }> {
    const updatedCliente = await this.servicoCliente.update(
      +id,
      updateClienteDto,
    );
    if (!updatedCliente) {
      throw new NotAcceptableException(`Cliente com ID #${id} não encontrado.`);
    }
    return { message: 'Cliente atualizado com sucesso.' };
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiResponse({ status: 204, description: 'Cliente removido com sucesso.' })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado.' })
  async remove(@Param('id') id: number): Promise<void> {
    const cliente = await this.servicoCliente.delete(id);
    if (!cliente) {
      throw new NotAcceptableException(`Cliente com ID #${id} não encontrado.`);
    }
  }
}
