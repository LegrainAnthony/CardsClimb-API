import { IsNumber, IsString } from 'class-validator';

export class Environment {
  @IsString()
  public readonly POSTGRES_DB!: string;

  @IsString()
  public readonly POSTGRES_DB_TEST!: string;

  @IsString()
  public readonly POSTGRES_USER!: string;

  @IsString()
  public readonly POSTGRES_USER_TEST!: string;

  @IsString()
  public readonly POSTGRES_PASSWORD!: string;

  @IsString()
  public readonly DATABASE_URL!: string;

  @IsNumber()
  public readonly PORT!: number;

  @IsString()
  public readonly JWT_SECRET!: string;

  @IsString()
  public readonly JWT_TOKEN_AUDIENCE!: string;

  @IsString()
  public readonly JWT_TOKEN_ISSUER!: string;

  @IsNumber()
  public readonly JWT_EXPIRATION!: number;

  @IsNumber()
  public readonly JWT_REFRESH_TOKEN_EXPIRATION!: number;

  @IsString()
  public readonly PGADMIN_DEFAULT_EMAIL!: string;

  @IsString()
  public readonly PGADMIN_DEFAULT_PASSWORD!: string;

  @IsString()
  public readonly REDIS_HOST!: string;

  @IsNumber()
  public readonly REDIS_PORT!: number;

  @IsNumber()
  public readonly REDIS_DB!: number;
}
