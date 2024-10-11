import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Veterinario } from './entities/veterinario.entity';
import { VeterinariosController } from './veterinarios.controller';
import { VeterinariosService } from './veterinarios.service';
import { UsersService } from 'src/users/users.service';
import { Users } from 'src/users/entities/user.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Veterinario, Users])],
  controllers: [VeterinariosController],
  providers: [VeterinariosService, UsersService],
  exports: [VeterinariosService],
})
export class VeterinariosModule {}
