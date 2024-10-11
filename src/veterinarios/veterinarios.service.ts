import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { VeterinarioDto } from './dto/create-veterinario.dto';
import { Veterinario } from './entities/veterinario.entity';
import { UpdateVeterinarioDto } from './dto/update-veterinario.dto';

@Injectable()
export class VeterinariosService {
  constructor(
    @InjectRepository(Veterinario)
    private veterinarioRepository: Repository<Veterinario>,
    private usersService: UsersService,
  ) {}

  async getAll() {
    return await this.veterinarioRepository.find({
      relations: ['especializacao'],
    });
  }

  async findOne(id: number) {
    try {
      return await this.veterinarioRepository.findOneOrFail({
        where: { id },
        relations: ['especializacao'],
      });
    } catch {
      throw new NotFoundException(`Veterinário com ID ${id} não encontrado`);
    }
  }

  async createVet(createVeterinarioDto: VeterinarioDto): Promise<Veterinario> {
    try {
      const userDto: CreateUserDto = {
        name: createVeterinarioDto.name,
        email: createVeterinarioDto.email,
        password: createVeterinarioDto.password,
      };

      const user = await this.usersService.create(userDto);

      const newVet = this.veterinarioRepository.create({
        ...createVeterinarioDto,
        user,
      });

      return await this.veterinarioRepository.save(newVet);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Email já cadastrado');
      }
      throw error;
    }
  }

  async update(id: number, veterinario: UpdateVeterinarioDto) {
    const existingVet = await this.findOne(id);
    Object.assign(existingVet, veterinario);
    try {
      return await this.veterinarioRepository.save(existingVet);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Email já cadastrado no sistema');
      }
      throw error;
    }
  }

  async destroy(id: number) {
    const veterinario = await this.findOne(id);
    if (veterinario.isEmpregado) {
    }
    await this.veterinarioRepository.delete(id);
    return true;
  }

  async findByEmail(email: string): Promise<Veterinario> {
    try {
      return await this.veterinarioRepository.findOneOrFail({
        where: { email },
        select: ['id', 'email', 'password'],
      });
    } catch {
      throw new NotFoundException(
        `Veterinário com email ${email} não encontrado`,
      );
    }
  }
}
