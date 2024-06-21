import { EntityItem } from '../baseRequest';
import { generateFile } from '../fileGenerator';

const builtinsTypes: string[] = ['string', 'number', 'boolean', 'Date'];

export const generateDtos = (entityName: string, items: EntityItem[]): void => {
  const filename = `src/${entityName}/application/dtos.ts`;
  const entityNameCapitalized = entityName.charAt(0).toUpperCase() + entityName.slice(1);

  let content = `// -*- coding: utf-8 -*-
import { IsInt, IsString, IsBoolean, IsDate } from 'class-validator';

`;

  items.forEach(attribute => {
    const typeOfField = attribute.type;

    if (builtinsTypes.includes(typeOfField)) {
      return;
    }

    if (typeOfField === 'Date') {
      content += `import { Type } from 'class-transformer';\n`;
      return;
    }

    content += `import { ${typeOfField} } from 'src/${typeOfField.toLowerCase()}/application/dtos';\n`;
  });

  content += `\nexport class ${entityNameCapitalized}Dto {
  @IsInt()
  id: number;`;

  items.forEach(attribute => {
    const field = attribute.name;
    const typeOfField = attribute.type;

    if (field === 'id') {
      return;
    }

    let validator;
    switch (typeOfField) {
      case 'string':
        validator = '@IsString()';
        break;
      case 'number':
        validator = '@IsInt()';
        break;
      case 'boolean':
        validator = '@IsBoolean()';
        break;
      case 'Date':
        validator = '@IsDate()';
        content += `\n  @Type(() => Date)`;
        break;
      default:
        validator = `@ValidateNested()`;
        break;
    }

    content += `
  ${validator}
  ${field}: ${typeOfField};`;
  });

  content += `\n}\n\n`;

  // Create Model Input
  content += `export class Create${entityNameCapitalized}Input {
  @IsInt()
  id: number;`;

  items.forEach(attribute => {
    const field = attribute.name;
    const typeOfField = attribute.type;

    if (field === 'id') {
      return;
    }

    let validator;
    switch (typeOfField) {
      case 'string':
        validator = '@IsString()';
        break;
      case 'number':
        validator = '@IsInt()';
        break;
      case 'boolean':
        validator = '@IsBoolean()';
        break;
      case 'Date':
        validator = '@IsDate()';
        content += `\n  @Type(() => Date)`;
        break;
      default:
        validator = `@ValidateNested()`;
        break;
    }

    content += `
  ${validator}
  ${field}: ${typeOfField};`;
  });

  content += `\n}\n\n`;

  // Update Model Input
  content += `export class Update${entityNameCapitalized}Input {`;

  items.forEach(attribute => {
    const field = attribute.name;
    const typeOfField = attribute.type;

    if (field === 'id') {
      return;
    }

    let validator;
    switch (typeOfField) {
      case 'string':
        validator = '@IsString()';
        break;
      case 'number':
        validator = '@IsInt()';
        break;
      case 'boolean':
        validator = '@IsBoolean()';
        break;
      case 'Date':
        validator = '@IsDate()';
        content += `\n  @Type(() => Date)`;
        break;
      default:
        validator = `@ValidateNested()`;
        break;
    }

    content += `
  ${validator}
  ${field}: ${typeOfField};`;
  });

  content += `\n}\n`;

  generateFile(filename, content);
};
