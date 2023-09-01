import { readFileSync } from 'fs';
import { resolve } from 'path';

import transform from '../index';


const code = readFileSync(resolve(__dirname, '../../debug/view.tsx'), 'utf-8');

transform(code, 'view.tsx').then(result => {
  console.log(result?.code);
});
