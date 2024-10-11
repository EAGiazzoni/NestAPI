import {
  ConflictException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ClienteDTO } from './ClienteDTO/cliente.dto';
import { CreateClienteAnimalDto } from './ClienteDTO/createClienteAnimal.dto';
import { UpdateClienteDto } from './ClienteDTO/updateCliente.dto';
import { Cliente } from './ClienteEnt/cliete.entity';
import { Animais } from 'src/animais/entities/animais.entity';

@Injectable()
export class ClienteService {
  constructor(
    @InjectRepository(Animais)
    private readonly objetoAnimal: Repository<Animais>,
    @InjectRepository(Cliente)
    private readonly objetoCliente: Repository<Cliente>,
  ) {}

  async findAll() {
    return await this.objetoCliente.find({
      relations: { animal: true },
    });
  }

  async findOne(id: number, animal = true): Promise<Cliente> {
    try {
      return await this.objetoCliente.findOneOrFail({
        where: { id },
        relations: { animal: animal },
      });
    } catch {
      throw new NotFoundException();
    }
  }

  async create(createClienteDto: ClienteDTO): Promise<Cliente> {
    let animalsId = 0;
    try {
      if (createClienteDto.animalsId) {
        await Promise.all(
          createClienteDto.animalsId.map(async (animal) => {
            animalsId = animal;
            await this.objetoAnimal.findOneByOrFail({ id: animal });
          }),
        );
      }
    } catch {
      throw new NotAcceptableException({
        message: ` Animal não encontrado ${animalsId}`,
      });
    }

    try {
      let cliente = await this.objetoCliente.create(createClienteDto);
      await this.objetoCliente.save(cliente);

      if (createClienteDto.animalsId) {
        await this.createClienteAnimal(cliente.id, {
          animalsId: createClienteDto.animalsId,
        });
        cliente = await this.findOne(cliente.id, true);
      }
      return cliente;
    } catch (e) {
      if (e.code == 23505) {
        throw new ConflictException({ message: `${e}` });
      } else if (e.code == 23503) {
        throw new NotAcceptableException({
          message: 'VERIFICAR ERRO E COLOCAR AQUI',
        });
      }
      throw new NotAcceptableException({ message: e });
    }
  }

  async createClienteAnimal(
    id: number,
    createClienteAnimalDto: CreateClienteAnimalDto,
  ): Promise<Cliente | null> {
    const cliente = await this.findOne(id, true);

    await Promise.all(
      createClienteAnimalDto.animalsId.map(async (newAnimalId) => {
        const actualAnimal = cliente.animal.find(
          (animal) => animal.id === newAnimalId,
        );
        if (!actualAnimal) {
          try {
            const newAnimal = await this.objetoAnimal.findOneByOrFail({
              id: newAnimalId,
            });
            cliente.animal = [...cliente.animal, newAnimal];
          } catch {
            throw new NotAcceptableException({
              message: `Id do Cliente não encontrado`,
            });
          }
        }
      }),
    );
    await this.objetoCliente.save(cliente);
    return cliente;
  }

  async deleteClienteAnimal(
    id: number,
    createClienteAnimalDto: CreateClienteAnimalDto,
  ): Promise<Cliente | null> {
    const cliente = await this.findOne(id, true);
    createClienteAnimalDto.animalsId.map((animalId) => {
      cliente.animal = cliente.animal.filter(
        (animal) => animal.id !== animalId,
      );
    });
    await this.objetoCliente.save(cliente);
    return cliente;
  }

  async update(id: number, updateClienteDto: UpdateClienteDto) {
    try {
      const cliente = await this.findOne(id);
      if (!cliente) {
        throw new NotFoundException({
          message: ` Cliente com o ${id} não encontrado`,
        });
      }
      if (updateClienteDto.name) {
        cliente.name = updateClienteDto.name;
      }
      if (updateClienteDto.animalsId) {
        const animais = await this.objetoAnimal.find({
          where: { id: In(updateClienteDto.animalsId) },
        });
        cliente.animal = animais;
      }
      await this.objetoCliente.save(cliente);
      return cliente;
    } catch {
      throw new ConflictException({ message: ` Cliente já existe: ${id}` });
    }
  }

  async delete(id: number) {
    await this.findOne(id);
    try {
      const procura = await this.objetoCliente.delete(id);
      if (procura.affected === 1) {
        return true;
      } else {
        throw new NotAcceptableException();
      }
    } catch {
      throw new NotAcceptableException();
    }
  }
}
