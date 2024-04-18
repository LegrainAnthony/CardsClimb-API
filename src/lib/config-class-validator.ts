import { plainToInstance, ClassConstructor } from 'class-transformer';
import { validateSync } from 'class-validator';

export const configClassValidator =
  (cls: ClassConstructor<object>) => (config: Record<string, unknown>) => {
    const validatedConfig = plainToInstance(cls, config, {
      enableImplicitConversion: true,
    });
    const errors = validateSync(validatedConfig, {
      skipMissingProperties: false,
    });

    if (errors.length > 0) {
      throw new Error(errors.toString());
    }
    return validatedConfig;
  };
