import { Module } from '@nestjs/common';
import { ClienteService } from './cliente.service';
import { ClienteController } from './cliente.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cliente } from './ClienteEnt/cliete.entity';
import { Animais } from 'src/animais/entities/animais.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Animais]),
    TypeOrmModule.forFeature([Cliente]),
  ],
  providers: [ClienteService],
  controllers: [ClienteController],
})
export class ClienteModule {}
