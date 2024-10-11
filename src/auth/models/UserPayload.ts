export interface UserPayload {
  sub: number;
  email: string;
  name: string;
  isVeterinario: boolean;
  iat?: number;
  exp?: number;
}
