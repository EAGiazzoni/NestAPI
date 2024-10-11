import { Animais } from 'src/animais/entities/animais.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Cliente {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  contato?: string;

  @ManyToMany(() => Animais)
  @JoinTable({
    name: 'cliente_animal',
  })
  animal?: Animais[];
}
