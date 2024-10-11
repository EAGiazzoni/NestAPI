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
import { ApiResponse, ApiTags, ApiParam } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Users } from './entities/user.entity';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Usuário criado com sucesso.',
    type: Users,
  })
  @ApiResponse({ status: 400, description: 'Erro de validação.' })
  async create(@Body() createUserDto: CreateUserDto): Promise<Users> {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Retorna todos os usuários.',
    type: [Users],
  })
  async findAll(): Promise<Users[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: Number, description: 'ID do usuário.' })
  @ApiResponse({
    status: 200,
    description: 'Retorna um usuário pelo ID.',
    type: Users,
  })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  async findOne(@Param('id') id: number): Promise<Users> {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException(`Usuário com ID #${id} não encontrado.`);
    }
    return user;
  }

  @Put(':id')
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID do usuário a ser atualizado.',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuário atualizado com sucesso.',
    type: Users,
  })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  async update(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<Users> {
    const updatedUser = await this.usersService.update(id, updateUserDto);
    if (!updatedUser) {
      throw new NotFoundException(`Usuário com ID #${id} não encontrado.`);
    }
    return updatedUser;
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID do usuário a ser deletado.',
  })
  @ApiResponse({ status: 204, description: 'Usuário deletado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  async remove(@Param('id') id: number): Promise<void> {
    return this.usersService.remove(id);
  }
}
