import * as fs from 'fs';

export const generateMain = (entityNames: string[]): void => {
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
