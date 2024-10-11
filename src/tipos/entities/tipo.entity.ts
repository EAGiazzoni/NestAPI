import { Animais } from 'src/animais/entities/animais.entity';
import { Veterinario } from 'src/veterinarios/entities/veterinario.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Tipo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => Animais, (animais) => animais.tipo)
  animal?: Animais[];

  @OneToMany(() => Veterinario, (veterinario) => veterinario.especializacao)
  veterinario?: Veterinario[];
}
