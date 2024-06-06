import { EntityItem } from "../..";
import { generateDtos } from "../application/dtos";
import { generateErrors } from "../application/errors";
import { generateFile } from "../fileGenerator";

export const generateRouters = (entityName: string, items: EntityItem[]): void => {
  generateErrors(entityName, items);
  generateDtos(entityName, items);

  const modelNameMin = entityName;
  const modelName = `${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}`;

  const filename = `src/infra/api/routers/${modelNameMin}.ts`;
  generateFile('src/infra/api/routers/__init__.ts',
    `export { router as router_${modelNameMin}s } from './${modelNameMin}';\n`
  );

  generateFile(filename,
    `// -*- coding: utf-8 -*-
import { Request, Response } from 'express';
import { Router } from 'express';
import { getDb } from '../../models';
import { ${modelName} } from '../../../${modelNameMin}/domain/entities';
import { Create${modelName}Input, Update${modelName}Input } from '../../../${modelNameMin}/application/dtos';
import { ${modelName}NotFound } from '../../../${modelNameMin}/application/errors';
import { ${modelNameMin}Repository } from '../../repositories/${modelNameMin}';

const router = Router();

router.get('/${modelNameMin}s', async (req: Request, res: Response) => {
  const { skip = 0, limit = 10 } = req.query;
  const db = getDb();
  const ${modelNameMin}s = ${modelNameMin}Repository.findAll(db, Number(skip), Number(limit));
  res.json({ ${modelNameMin}s });
});

router.get('/${modelNameMin}s/:${modelNameMin}_id', async (req: Request, res: Response) => {
  const { ${modelNameMin}_id } = req.params;
  const db = getDb();
  const ${modelNameMin} = await ${modelNameMin}Repository.findById(db, ${modelNameMin}_id);
  if (!${modelNameMin}) {
    return res.status(404).json(${modelName}NotFound());
  }
  res.json({ ${modelNameMin} });
});

router.post('/${modelNameMin}s', async (req: Request, res: Response) => {
  const ${modelNameMin} = req.body as Create${modelName}Input;
  const db = getDb();
  const ${modelNameMin}_created = await ${modelNameMin}Repository.save(db, ${modelNameMin});
  res.status(201).json({ ${modelNameMin}: ${modelNameMin}_created });
});

router.patch('/${modelNameMin}s', async (req: Request, res: Response) => {
  const input = req.body as Update${modelName}Input;
  const db = getDb();
  const ${modelNameMin} = await ${modelNameMin}Repository.findById(db, input.id);
  if (!${modelNameMin}) {
    return res.status(404).json(${modelName}NotFound());
  }
  const updated_${modelNameMin} = await ${modelNameMin}Repository.update(db, input);
  res.json({ message: 'updated', ${modelNameMin}: updated_${modelNameMin} });
});

router.delete('/${modelNameMin}s/:${modelNameMin}_id', async (req: Request, res: Response) => {
  const { ${modelNameMin}_id } = req.params;
  const db = getDb();
  const ${modelNameMin} = await ${modelNameMin}Repository.findById(db, ${modelNameMin}_id);
  if (!${modelNameMin}) {
    return res.status(404).json(${modelName}NotFound());
  }
  await ${modelNameMin}Repository.delete(db, ${modelNameMin}_id);
  res.json({ message: 'deleted' });
});

export { router };
`);
};
