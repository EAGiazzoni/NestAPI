import { Cliente } from 'src/clientes/ClienteEnt/cliete.entity';
import { Tipo } from 'src/tipos/entities/tipo.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Animais {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Tipo, (tipo) => tipo.animal)
  @JoinTable()
  tipo: Tipo;

  @ManyToMany(() => Cliente)
  @JoinTable({
    name: 'animais_donos',
  })
  dono: Cliente[];
}
