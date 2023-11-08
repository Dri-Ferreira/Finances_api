import { plainToInstance } from 'class-transformer';
import { IsNotEmpty, IsString, NotEquals, validateSync } from 'class-validator';

class Env {
  @IsString()
  @IsNotEmpty()
  @NotEquals('secret')
  jwtSecret: string;

  @IsString()
  @IsNotEmpty()
  dbURL: string;
}
export const env: Env = plainToInstance(Env, {
  jwtSecret: process.env.SECRET_JWT,
  dbURL: process.env.DATABASE_URL,
});

const errors = validateSync(env);

if (errors.length > 0) {
  throw new Error(JSON.stringify(errors, null, 2));
}
