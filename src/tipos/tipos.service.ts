import {
  ConflictException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tipo } from './entities/tipo.entity';
import { CreateTipoDto } from './dto/create-tipo.dto';
import { UpdateTipoDto } from './dto/update-tipo.dto';

@Injectable()
export class TiposService {
  constructor(
    @InjectRepository(Tipo) private tipoRepository: Repository<Tipo>,
  ) {}

  async create(createTipoDto: CreateTipoDto): Promise<Tipo> {
    try {
      return await this.tipoRepository.save(createTipoDto);
    } catch {
      throw new ConflictException({ message: 'Esse Tipo de animal já existe' });
    }
  }

  async findAll(): Promise<Tipo[]> {
    return await this.tipoRepository.find();
  }

  async findOne(id: number) {
    try {
      return await this.tipoRepository.findOneOrFail({ where: { id } });
    } catch {
      throw new NotFoundException();
    }
  }

  async update(id: number, updateTipoDto: UpdateTipoDto) {
    try {
      await this.tipoRepository.update({ id }, updateTipoDto);
      return await this.tipoRepository.findOne({ where: { id: id } });
    } catch {
      throw new ConflictException({
        message: 'Esse tipo de animal já existe!',
      });
    }
  }

  async remove(id: number) {
    const tiporemover = await this.findOne(id);
    try {
      await this.tipoRepository.delete(tiporemover);
      return true;
    } catch {
      throw new NotAcceptableException();
    }
  }
}
