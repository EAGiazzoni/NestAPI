/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ConflictException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cliente } from 'src/clientes/ClienteEnt/cliete.entity';
import { Tipo } from 'src/tipos/entities/tipo.entity';
import { Repository } from 'typeorm';
import { CreateAnimalDonoDTO } from './dto/create-animais-donos.dto';
import { CreateAnimalTipoDTO } from './dto/create-animais-tipo.dto';
import { CreateAnimalDto } from './dto/create-animais.dto';
import { UpdateAnimaisDto } from './dto/update-animais.dto';
import { Animais } from './entities/animais.entity';

@Injectable()
export class AnimaisService {
  constructor(
    @InjectRepository(Animais)
    private readonly animaisRepository: Repository<Animais>,
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
    @InjectRepository(Tipo)
    private readonly tipoRepository: Repository<Tipo>,
  ) {}

  async create(createAnimalDto: CreateAnimalDto): Promise<Animais> {
    let donoID = 0;
    let tipoID = 0;
    try {
      if (createAnimalDto.donoID) {
        await Promise.all(
          createAnimalDto.donoID.map(async (dono) => {
            donoID = dono;
            await this.clienteRepository.findOneByOrFail({ id: dono });
          }),
        );
      }
      if (createAnimalDto.tipoID) {
        tipoID = createAnimalDto.tipoID;
        await this.tipoRepository.findOneByOrFail({ id: tipoID });
      }
    } catch {
      throw new NotAcceptableException({
        message: `Dono ou Tipo não encontrado com o DonoID ${donoID} ou TipoID ${tipoID}`,
      });
    }

    try {
      let animal = this.animaisRepository.create(createAnimalDto);
      await this.animaisRepository.save(animal);

      if (createAnimalDto.donoID) {
        await this.criarDonoParaAnimal(animal.id, {
          donosID: createAnimalDto.donoID,
        });
        animal = await this.findOneDono(animal.id, true);
      }
      if (createAnimalDto.tipoID) {
        await this.criarTipoParaAnimal(animal.id, {
          tiposID: createAnimalDto.tipoID,
        });
        animal = await this.findOneTipo(animal.id, true);
      }
      return animal;
    } catch (err) {
      if (err.code == 23505) {
        throw new ConflictException({ message: `${err}` });
      } else if (err.code == 23503) {
        throw new NotAcceptableException({ message: 'Tipo não encontrado' });
      }
      throw new NotAcceptableException({ message: err });
    }
  }

  async findAll() {
    return await this.animaisRepository.find({
      relations: { tipo: true, dono: true },
    });
  }

  async findOne(id: number, dono = true): Promise<Animais> {
    try {
      return await this.animaisRepository.findOneOrFail({
        where: { id },
        relations: { dono: dono },
      });
    } catch {
      throw new NotFoundException({ message: 'CHgeou aqui?' });
    }
  }

  async findOneDono(id: number, dono = true): Promise<Animais> {
    try {
      return await this.animaisRepository.findOneOrFail({
        where: { id },
        relations: { dono: dono },
      });
    } catch {
      throw new NotFoundException({ message: 'CHgeou aqui?' });
    }
  }

  async findOneTipo(id: number, tipo = true): Promise<Animais> {
    try {
      return await this.animaisRepository.findOneOrFail({
        where: { id },
        relations: { tipo: tipo },
      });
    } catch {
      throw new NotFoundException({ message: 'CHgeou aqui?' });
    }
  }

  async update(
    id: number,
    updateAnimalDto: UpdateAnimaisDto,
  ): Promise<Animais> {
    try {
      console.log('ID = ', id);
      console.log('UPDATE = ', updateAnimalDto);

      const animal = await this.animaisRepository.findOne({
        where: { id },
        relations: ['tipo', 'dono'],
      });
      if (!animal) {
        throw new NotFoundException({
          message: `Animal com ID ${id} não encontrado`,
        });
      }

      if (updateAnimalDto.name) {
        animal.name = updateAnimalDto.name;
      }

      if (updateAnimalDto.tipoID) {
        const tipo = await this.tipoRepository.findOne({
          where: { id: updateAnimalDto.tipoID[0] },
        });
        if (!tipo) {
          throw new NotFoundException(
            `Tipo com ID ${updateAnimalDto.tipoID[0]} não encontrado`,
          );
        }
        animal.tipo = tipo;
      }

      if (updateAnimalDto.donoID) {
        const donos = await this.clienteRepository.findByIds(
          updateAnimalDto.donoID,
        );
        if (donos.length === 0) {
          throw new NotFoundException(
            `Nenhum dono encontrado com os IDs fornecidos`,
          );
        }
        animal.dono = donos;
      }
      await this.animaisRepository.save(animal);
      return await this.animaisRepository.findOne({
        where: { id },
        relations: ['tipo', 'dono'],
      });
    } catch (error) {
      console.error('Erro durante o update:', error);
      throw new ConflictException({ message: 'Animal Update com Erro' });
    }
  }

  async remove(id: number) {
    try {
      const busca = await this.animaisRepository.delete({ id });
      if (busca.affected === 1) {
        return true;
      } else {
        throw new NotAcceptableException();
      }
    } catch {
      throw new NotAcceptableException();
    }
  }

  async criarDonoParaAnimal(
    id: number,
    createAnimalDonoDTO: CreateAnimalDonoDTO,
  ): Promise<Animais | null> {
    try {
      const animal = await this.findOneDono(id, true);

      await Promise.all(
        createAnimalDonoDTO.donosID.map(async (newDonoID) => {
          const donoAtual = animal.dono.find((dono) => dono.id === newDonoID);
          if (!donoAtual) {
            const novoDono = await this.clienteRepository.findOneByOrFail({
              id: newDonoID,
            });
            animal.dono = [...animal.dono, novoDono];
          }
        }),
      );

      await this.animaisRepository.save(animal);
      return animal;
    } catch {
      throw new NotAcceptableException({
        message: ` #${id} - ID do Dono não encontrado `,
      });
    }
  }

  async criarTipoParaAnimal(
    id: number,
    createAnimalTipoDTO: CreateAnimalTipoDTO,
  ): Promise<Animais | null> {
    try {
      const animal = await this.findOneTipo(id, true);
      if (createAnimalTipoDTO.tiposID) {
        const tipoAtual = animal.tipo;
        if (!tipoAtual || tipoAtual.id !== createAnimalTipoDTO.tiposID) {
          const novoTipo = await this.tipoRepository.findOneByOrFail({
            id: createAnimalTipoDTO.tiposID,
          });
          animal.tipo = novoTipo;
        }
      }

      await this.animaisRepository.save(animal);
      return animal;
    } catch {
      throw new NotAcceptableException({
        message: ` #${id} - ID do Tipo não encontrado `,
      });
    }
  }

  async atualizarDonoParaAnimal(
    id: number,
    createAnimalDonoDTO: CreateAnimalDonoDTO,
  ): Promise<Animais | null> {
    try {
      const animal = await this.findOneDono(id, true);

      createAnimalDonoDTO.donosID.map((donoID) => {
        animal.dono = animal.dono.filter((dono) => false);
      });

      await Promise.all(
        createAnimalDonoDTO.donosID.map(async (newDonoID) => {
          const donoAtual = animal.dono.find((dono) => dono.id === newDonoID);
          if (!donoAtual) {
            const novoDono = await this.clienteRepository.findOneByOrFail({
              id: newDonoID,
            });
            animal.dono = [...animal.dono, novoDono];
          }
        }),
      );
      await this.animaisRepository.save(animal);
      return animal;
    } catch {
      throw new NotAcceptableException({
        message: `#${id} - ID não encontrado `,
      });
    }
  }

  async deletarDonoParaAnimal(
    id: number,
    createAnimalDonoDTO: CreateAnimalDonoDTO,
  ): Promise<Animais | null> {
    try {
      const animal = await this.findOneTipo(id, true);

      createAnimalDonoDTO.donosID.map((donoID) => {
        animal.dono = animal.dono.filter((dono) => dono.id !== donoID);
      });
      await this.animaisRepository.save(animal);
      return animal;
    } catch {
      throw new NotAcceptableException({
        message: `#${id} - ID não encontrado `,
      });
    }
  }
}
