import * as fs from 'fs';
import * as path from 'path';
import { EntityItem, capitalize } from '../baseRequest';


export const generateRepository = (entityName: string, entityItems: EntityItem[]): void => {
  const filename = `src/infra/repositories/${entityName}.ts`;
  const dirname = path.dirname(filename);

  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname, { recursive: true });
  }

  if (!fs.existsSync('src/infra/repositories/__init__.ts')) {
    fs.writeFileSync('src/infra/repositories/__init__.ts', '');
  }

  const modelName = capitalize(entityName);

  let imports = `
import { db } from '../db'; // Adjust the import according to your database setup
import { ${modelName} } from 'src/${entityName}/domain/entities';
import { Create${modelName}Input, Update${modelName}Input } from 'src/${entityName}/application/dtos';
`;

  let functions = `
const toEntity = (model: any): ${modelName} | null => {
  if (!model) return null;

  return new ${modelName}(
`;

  entityItems.forEach((attribute, index) => {
    const comma = index < entityItems.length - 1 ? ',' : '';
    functions += `    model.${attribute.name}${comma}\n`;
  });

  functions += `
  );
};

const findAll = async (skip: number = 0, limit: number = 100): Promise<${modelName}[]> => {
  const ${entityName}s = await db.any('SELECT * FROM ${entityName}s OFFSET $1 LIMIT $2', [skip, limit]);
  return ${entityName}s.map(toEntity);
};

const findById = async (${entityName}_id: string): Promise<${modelName} | null> => {
  const ${entityName} = await db.oneOrNone('SELECT * FROM ${entityName}s WHERE id = $1', [${entityName}_id]);
  return toEntity(${entityName});
};

const deleteById = async (${entityName}_id: string): Promise<void> => {
  await db.none('DELETE FROM ${entityName}s WHERE id = $1', [${entityName}_id]);
};

const save = async (input: Create${modelName}Input): Promise<${modelName} | null> => {
  const data = input as any;
  const columns = Object.keys(data).join(', ');
  const values = Object.values(data);

  const query = \`INSERT INTO ${entityName}s (\${columns}) VALUES (\${values.map((_, index) => '$' + (index + 1)).join(', ')}) RETURNING *\`;
  const ${entityName} = await db.one(query, values);
  return toEntity(${entityName});
};

const update = async (input: Update${modelName}Input): Promise<${modelName} | null> => {
  const { id, ...data } = input as any;
  const set = Object.keys(data).map((key, index) => \`\${key} = $\${index + 2}\`).join(', ');
  const values = [id, ...Object.values(data)];

  const query = \`UPDATE ${entityName}s SET \${set} WHERE id = $1 RETURNING *\`;
  const updated${modelName} = await db.one(query, values);
  return toEntity(updated${modelName});
};

export {
  findAll,
  findById,
  deleteById as delete,
  save,
  update
};
`;

  const content = imports + functions;

  fs.writeFileSync(filename, content);
};
