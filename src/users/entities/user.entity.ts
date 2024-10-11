import { IsEmail } from 'class-validator';
import { SenhaVeterinario } from 'src/veterinarios/dto/senhavet';
import { Veterinario } from 'src/veterinarios/entities/veterinario.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('users')
export class Users extends SenhaVeterinario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  @IsEmail()
  email: string;

  @OneToOne(() => Veterinario, (veterinario) => veterinario.user)
  @JoinColumn()
  veterinario?: Veterinario;
}
