import { Module } from '@nestjs/common';
import { AnimaisService } from './animais.service';
import { AnimaisController } from './animais.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Animais } from './entities/animais.entity';
import { Cliente } from 'src/clientes/ClienteEnt/cliete.entity';
import { Tipo } from 'src/tipos/entities/tipo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Animais, Cliente, Tipo])],
  controllers: [AnimaisController],
  providers: [AnimaisService],
})
export class AnimaisModule {}
