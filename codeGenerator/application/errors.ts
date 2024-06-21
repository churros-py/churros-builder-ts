import * as path from 'path';
import * as fs from 'fs';
import { capitalize } from '../baseRequest';

export const generateErrors = (entityName: string): void => {
  const filename = `src/${entityName}/application/errors.ts`;
  const dirname = path.dirname(filename);

  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname, { recursive: true });
  }

  if (!fs.existsSync(`src/${entityName}/application/__init__.ts`)) {
    fs.writeFileSync(`src/${entityName}/application/__init__.ts`, '');
  }

  const content = `
import { Request, Response, NextFunction } from 'express';

export class ${capitalize(entityName)}NotFound extends Error {
  constructor() {
    super('${capitalize(entityName)} not found');
    this.name = '${capitalize(entityName)}NotFound';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export const handle${capitalize(entityName)}NotFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new ${capitalize(entityName)}NotFound();
  res.status(404).json({
    errors: [
      {
        loc: ["param", "${entityName}_id"],
        msg: error.message,
        type: "not_found_error",
      },
    ],
  });
};
`;

  fs.writeFileSync(filename, content);
};
