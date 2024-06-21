import { generateFile } from "../fileGenerator";

const generateEntities = (): void => {
  const filename = 'src/__seedwork/domain/entities.ts';
  generateFile(filename, `
// -*- coding: utf-8 -*-
import { Field, asdict } from 'some-library';

export abstract class Entity {
  protected _set(name: string, value: any): this {
    (this as any)[name] = value;
    return this;
  }

  public toDict(): Record<string, any> {
    const entityDict = asdict(this);
    entityDict.id = (this as any).id;
    return entityDict;
  }

  public static getField(entityField: string): Field {
    return (this as any).__dataclass_fields__[entityField];
  }
}
`);
};

const generateExceptions = (): void => {
  const filename = 'src/__seedwork/domain/exceptions.ts';
  generateFile(filename, `
// -*- coding: utf-8 -*-
export class ValidationException extends Error {}

export class EntityValidationException extends Error {
  public error: any;

  constructor(error: any) {
    super('Entity Validation Error');
    this.error = error;
  }
}

export class NotFoundException extends Error {}
`);
};

// Generate Repositories
const generateRepositories = (): void => {
  const filename = 'src/__seedwork/domain/repositories.ts';
  generateFile(filename, `
// -*- coding: utf-8 -*-
export interface RepositoryInterface<ET> {
  insert(entity: ET): void;
  findById(entityId: string): ET | null;
  findAll(): ET[];
  update(entity: ET): void;
  delete(entityId: string): void;
}
`);
};

// Generate Validators
const generateValidators = (): void => {
  const filename = 'src/__seedwork/domain/validators.ts';
  generateFile(filename, `
// -*- coding: utf-8 -*-
export class ValidationException extends Error {}

export class ValidatorRules {
  private value: any;
  private prop: string;

  constructor(value: any, prop: string) {
    this.value = value;
    this.prop = prop;
  }

  public static values(value: any, prop: string): ValidatorRules {
    return new ValidatorRules(value, prop);
  }

  public required(): ValidatorRules {
    if (this.value === null || this.value === undefined || this.value === '') {
      throw new ValidationException(\`The \${this.prop} is required\`);
    }
    return this;
  }

  public string(): ValidatorRules {
    if (this.value !== null && typeof this.value !== 'string') {
      throw new ValidationException(\`The \${this.prop} must be a string\`);
    }
    return this;
  }

  public maxLength(maxLength: number): ValidatorRules {
    if (this.value !== null && this.value.length > maxLength) {
      throw new ValidationException(\`The \${this.prop} must be less than \${maxLength} characters\`);
    }
    return this;
  }

  public boolean(): ValidatorRules {
    if (this.value !== null && typeof this.value !== 'boolean') {
      throw new ValidationException(\`The \${this.prop} must be a boolean\`);
    }
    return this;
  }
}

export type ErrorFields = Record<string, string[]>;

export interface ValidatorFieldsInterface<PropsValidated> {
  errors: ErrorFields;
  validatedData: PropsValidated;

  validate(data: any): boolean;
}
`);
};

// Generate Value Objects
const generateValueObjects = (): void => {
  const filename = 'src/__seedwork/domain/valueObjects.ts';
  generateFile(filename, `
// -*- coding: utf-8 -*-
import { Field, fields } from 'some-library';

export abstract class ValueObject {
  public toString(): string {
    const fieldsName = fields(this).map((field: Field) => field.name);
    if (fieldsName.length === 1) {
      return String((this as any)[fieldsName[0]]);
    }
    return JSON.stringify(fieldsName.reduce((result: Record<string, any>, fieldName: string) => {
      result[fieldName] = (this as any)[fieldName];
      return result;
    }, {}));
  }
}
`);
};

export const generateDomainSeedwork = (): void => {
  generateEntities();
  generateExceptions();
  generateRepositories();
  generateValidators();
  generateValueObjects();
};
