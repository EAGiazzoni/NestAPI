import { Tipo } from 'src/tipos/entities/tipo.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SenhaVeterinario } from '../dto/senhavet';
import { Users } from 'src/users/entities/user.entity';

@Entity('veterinario')
export class Veterinario extends SenhaVeterinario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ default: true })
  isEmpregado?: boolean;

  @ManyToOne(() => Tipo, (tipo) => tipo.veterinario)
  especializacao?: Tipo;

  @OneToOne(() => Users, (user) => user.veterinario)
  user?: Users;
}
