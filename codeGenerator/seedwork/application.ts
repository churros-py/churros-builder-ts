import { generateFile } from "../fileGenerator";

export const generateUseCases = (): void => {
  const filename = 'src/__seedwork/application/use_cases.ts';
  generateFile(filename, `
// -*- coding: utf-8 -*-
export interface UseCase<Input, Output> {
  execute(inputUseCase: Input, db: any): Output;
}
`);
};

