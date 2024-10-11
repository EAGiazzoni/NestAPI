import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Users } from 'src/users/entities/user.entity';
import { LoginDTO } from 'src/veterinarios/logind.dto';
import { VeterinariosService } from 'src/veterinarios/veterinarios.service';
import { UserPayload } from './models/UserPayload';
import { UserToken } from './models/UserToken';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly veterinarioService: VeterinariosService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  login(user: Users): UserToken {
    const payload: UserPayload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      isVeterinario: true,
    };

    const jwtValidator = this.jwtService.sign(payload);
    return {
      access_token: jwtValidator,
    };
  }
  async validarUsuario({ email, password }: LoginDTO): Promise<Users> {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new ForbiddenException(
        'Login não autorizado. Usuário não encontrado',
      );
    }

    const senhaValida = await bcrypt.compare(password, user.password);

    if (!senhaValida) {
      throw new ForbiddenException('Login não autorizado. Senha inválida');
    }

    // Retorna o veterinário autenticado
    return user;
  }
}
