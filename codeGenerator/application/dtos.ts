import { EntityItem, capitalize } from '../baseRequest';
import * as path from 'path';
import * as fs from 'fs';

const builtinsTypes: string[] = ['string', 'number', 'boolean', 'Date'];

export const generateDtos = (entityName: string, items: EntityItem[]): void => {
  const filename = `src/${entityName}/application/dtos.ts`;
  const dirname = path.dirname(filename);

  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname, { recursive: true });
  }

  let imports = `import { z } from 'zod';\n`;

  for (const attribute of items) {
    const typeOfField = attribute.type;

    if (typeOfField in builtinsTypes) {
      continue;
    }

    if (typeOfField === 'datetime') {
      continue;
    }

  }

  const dtoClasses = (className: string, includeId: boolean): string => {
    let classDef = `export const ${className} = z.object({\n`;

    if (includeId) {
      classDef += `  id: z.number(),\n`;
    }

    for (const attribute of items) {
      const field = attribute.name;
      const typeOfField = attribute.type;
      const relationship = attribute.relationship;

      if (field === 'id' && includeId) {
        continue;
      }

      if (relationship) {
        classDef += `  ${field}: ${mapRelationship(relationship, typeOfField)},\n`;
      } else {
        classDef += `  ${field}: ${mapType(typeOfField)},\n`;
      }
    }

    classDef += `});\n`;

    return classDef;
  };

  const content = `${imports}\n${dtoClasses(capitalize(entityName), true)}\n${dtoClasses(`Create${capitalize(entityName)}Input`, false)}\n${dtoClasses(`Update${capitalize(entityName)}Input`, false)}`;

  fs.writeFileSync(filename, content);
};

const mapType = (type: string): string => {
  switch (type) {
    case 'string':
      return 'z.string()';
    case 'boolean':
      return 'z.boolean()';
    case 'number':
      return 'z.number()';
    case 'datetime':
      return 'z.date()';
    default:
      return 'z.any()';
  }
};

const mapRelationship = (relationship: string, type: string): string => {
  switch (relationship) {
    case 'ONE_TO_ONE':
      return mapType(type);
    case 'ONE_TO_MANY':
      return `z.array(${mapType(type)})`;
    case 'MANY_TO_ONE':
      return mapType(type);
    case 'MANY_TO_MANY':
      return `z.array(${mapType(type)})`;
    default:
      return 'z.any()';
  }
};
