import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class AppService implements OnModuleInit {
  onModuleInit() {
    // eslint-disable-next-line no-console
    console.log('Servidor Rodando');
  }
}
