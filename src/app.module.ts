import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnimaisModule } from './animais/animais.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ClienteModule } from './clientes/cliente.module';
import { typeOrmConfig } from './config/typeorm.config';
import { TiposModule } from './tipos/tipos.module';
import { VeterinariosModule } from './veterinarios/veterinarios.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    ClienteModule,
    AnimaisModule,
    VeterinariosModule,
    AuthModule,
    AnimaisModule,
    TiposModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
