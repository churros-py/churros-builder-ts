import * as fs from 'fs';
import * as path from 'path';
import { generateDomainSeedwork } from './codeGenerator/seedwork/domain';

interface EntityItem {
  name: string;
  type: string;
  default_value?: any;
}

interface Table {
  name: string;
  items: EntityItem[];
}

const generateEntity = (entityName: string, entityItems: EntityItem[]): void => {
  const entityDir = `src/${entityName}/domain/entities`;
  const entityFile = path.join(entityDir, `${entityName}.ts`);

  fs.mkdirSync(entityDir, { recursive: true });

  let imports = `
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

const generateRepository = (entityName: string): void => {
  const repositoryDir = `src/${entityName}/domain/repositories`;
  const repositoryFile = path.join(repositoryDir, `${entityName}Repository.ts`);

  fs.mkdirSync(repositoryDir, { recursive: true });

  const entityCapitalized = capitalize(entityName);

  const repositoryContent = `
import { ${entityCapitalized} } from '../entities/${entityName}';

export interface ${entityCapitalized}Repository {
  findAll(): Promise<${entityCapitalized}[]>;
  findById(id: number): Promise<${entityCapitalized} | null>;
  save(entity: ${entityCapitalized}): Promise<void>;
  update(entity: ${entityCapitalized}): Promise<void>;
  delete(id: number): Promise<void>;
}
`;

  fs.writeFileSync(repositoryFile, repositoryContent);
};

const generateMain = (entityNames: string[]): void => {
  const mainFile = `src/main.ts`;

  const imports = entityNames.map((name) => `import { router as ${name}Router } from './${name}/infra/api/routers/${name}Router';`).join('\n');

  const routes = entityNames.map((name) => `app.use('/${name}', ${name}Router);`).join('\n');

  const mainContent = `
import express from 'express';
${imports}

const app = express();
app.use(express.json());

${routes}

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
`;

  fs.writeFileSync(mainFile, mainContent);
};

const mapType = (type: string): string => {
  switch (type) {
    case 'str':
      return 'string';
    case 'int':
      return 'number';
    case 'bool':
      return 'boolean';
    default:
      return 'any';
  }
};

const capitalize = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1);

// Example usage:
const tables: Table[] = [
  {
    name: 'product',
    items: [
      {
        name: 'name',
        type: 'str',
        default_value: 'General Product',
      },
    ],
  },
];

generateDomainSeedwork()
tables.forEach(table => {
  generateEntity(table.name, table.items);
  generateRepository(table.name);
});
generateMain(tables.map(table => table.name));
