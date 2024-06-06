import * as path from 'path';
import * as fs from 'fs';

export const generateFile = (filename: string, content: string): void => {
  const dir = path.dirname(filename);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filename, content, 'utf8');
};
