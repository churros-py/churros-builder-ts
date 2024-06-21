import * as fs from 'fs';
import * as path from 'path';
import { EntityItem, capitalize, mapType } from '../baseRequest';

export const generateEntity = (entityName: string, entityItems: EntityItem[]): void => {
  const entityDir = `src/${entityName}/domain/entities`;
  const entityFile = path.join(entityDir, `${entityName}.ts`);

  fs.mkdirSync(entityDir, { recursive: true });

  const imports = `
import { Entity } from '../../../__seedwork/domain/entities';
`;

  let entityContent = `
export class ${capitalize(entityName)} extends Entity {
  constructor(
`;

  entityItems.forEach((item) => {
    const type = mapType(item.type);
    entityContent += `    public readonly ${item.name}: ${type},\n`;
  });

  entityContent += `  ) {
    super();
  }
}
`;

  fs.writeFileSync(entityFile, imports + entityContent);
};
