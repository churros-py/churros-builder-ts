import { EntityItem } from "../..";
import { generateFile } from "../fileGenerator";

export const generateErrors = (entityName: string, items: EntityItem[]): void => {
  const filename = `src/${entityName}/application/errors.ts`;
  const entityNameCapitalized = entityName.charAt(0).toUpperCase() + entityName.slice(1);

  generateFile(`src/${entityName}/application/__init__.ts`, '');

  generateFile(filename,
    `// -*- coding: utf-8 -*-
import { HttpException } from '@nestjs/common';

export class ${entityNameCapitalized}NotFound extends HttpException {
  constructor() {
    super({
      statusCode: 404,
      message: [
        {
          loc: ["param", "${entityName}_id"],
          msg: "${entityNameCapitalized} not found",
          type: "not_found_error",
        },
      ],
    }, 404);
  }
}
`);
};