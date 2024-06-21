import * as path from 'path';
import * as fs from 'fs';

import { EntityItem, Relationship, capitalize } from "../baseRequest";

const builtins_types = ['string', 'boolean', 'number', 'number', 'datetime'];

const convertToPgPromiseType = (type: string): string => {
  switch (type) {
    case 'string':
      return 'TEXT';
    case 'boolean':
      return 'BOOLEAN';
    case 'number':
      return 'INTEGER';
    case 'number':
      return 'REAL';
    case 'datetime':
      return 'TIMESTAMP';
    default:
      return 'TEXT';
  }
};

const modelsFilename = "src/infra/models.ts";

export const generateModel = (entityName: string, items: EntityItem[]): void => {
  if (!fs.existsSync(modelsFilename)) {
    fs.mkdirSync(path.dirname(modelsFilename), { recursive: true });
    fs.writeFileSync("src/infra/__init__.ts", "");
    fs.writeFileSync(modelsFilename, "");
  }

  const filename = `src/infra/schemas/${entityName}.ts`;

  if (!fs.existsSync(filename)) {
    fs.mkdirSync(path.dirname(filename), { recursive: true });
    fs.writeFileSync("src/infra/schemas/__init__.ts", "");
    fs.writeFileSync(filename, "");
  }

  let imports = '';
  let classDef = `class ${capitalize(entityName)}Model {\n`;
  let constructorDef = '  constructor() {\n';

  for (const attribute of items) {
    const typeOfField = attribute.type;
    if (typeOfField in builtins_types || typeOfField === 'datetime') {
      continue;
    }

    if (attribute.type === 'datetime') {
      imports += `import { DateTime } from 'luxon';\n`;
    } else {
      imports += `import { ${capitalize(attribute.type)} } from 'src/${attribute.type.toLowerCase()}/domain/entities';\n`;
    }
  }

  classDef += `  id: string = '';\n`;

  for (const attribute of items) {
    const field = attribute.name;
    const typeOfField = attribute.type;

    if (field === 'id') continue;

    if (!convertToPgPromiseType(typeOfField)) {
      if (attribute.relationship === Relationship.MANY_TO_ONE) {
        classDef += `  ${field}_id: number = 0;\n`;
        classDef += `  ${field}: ${capitalize(field)}Model = new ${capitalize(field)}Model();\n`;
      } else if (attribute.relationship === Relationship.ONE_TO_MANY) {
        classDef += `  ${field}: ${capitalize(typeOfField)}Model[] = [];\n`;
      } else if (attribute.relationship === Relationship.ONE_TO_ONE) {
        classDef += `  ${field}_id: number = 0;\n`;
        classDef += `  ${field}: ${capitalize(field)}Model = new ${capitalize(field)}Model();\n`;
      }
    } else {
      classDef += `  ${field}: ${mapType(typeOfField)} = ${defaultValue(attribute)};\n`;
    }
  }

  constructorDef += '  }\n';
  classDef += constructorDef + '}\n';

  const fileContent = imports + '\n' + classDef;

  fs.writeFileSync(filename, fileContent);
};

const mapType = (type: string): string => {
  switch (type) {
    case 'string':
      return 'string';
    case 'boolean':
      return 'boolean';
    case 'number':
      return 'number';
    case 'datetime':
      return 'Date';
    default:
      return 'any';
  }
};

const defaultValue = (attribute: EntityItem): any => {
  if (attribute.has_default_value) {
    return JSON.stringify(attribute.default_value);
  }

  switch (attribute.type) {
    case 'string':
      return "''";
    case 'boolean':
      return 'false';
    case 'number':
      return '0';
    default:
      return 'null';
  }
};
