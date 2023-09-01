import * as babel from '@babel/core';
import { resolve } from 'path';

export default async function transform(source: string, filename: string) {

  try {
    const result = await babel.transform(source, {
      presets: [resolve(__dirname, '../../node_modules/@babel/preset-typescript')],
      plugins: [
        resolve(__dirname, '../../node_modules/@babel/plugin-transform-modules-commonjs'),
        resolve(__dirname, '../../transform/babel-plugin-jsx-uimo')
      ],
      filename,
      sourceMaps: true,
      sourceFileName: filename,
      
    });
  
    return { code: result?.code, map: result?.map };
  } catch (error) {
    throw new Error(`Babel transform error: ${error}`);
  }
}
