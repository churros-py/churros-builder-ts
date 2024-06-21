import * as fs from 'fs';
import * as path from 'path';
import { capitalize } from '../baseRequest';

export const generateRepository = (entityName: string): void => {
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
