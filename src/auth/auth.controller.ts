import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginDTO } from 'src/veterinarios/logind.dto';
import { AuthService } from './auth.service';
import { IsPublic } from './decorators/ispublic.decorator';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @IsPublic()
  @ApiTags('auth')
  @ApiResponse({ status: 200, description: 'Login efetuado com sucesso.' })
  @ApiBody({ type: LoginDTO })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  login(@Request() req: any) {
    return this.authService.login(req.user);
  }
}
