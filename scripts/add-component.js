const fs = require('fs');
const path = require('path');

const componentName = process.argv[2];

const root = path.join(__dirname, '../platform/components/basic');
const componentPath = path.join(root, componentName);

if(!fs.existsSync(componentPath)) {
  fs.mkdirSync(componentPath);
} else {
  console.log('\x1b[31m%s\x1b[0m', `Component '${componentName}' already exists`);
  console.log(' ');
  process.exit(1);
}

const fromKebabPascalCase = (str) => {
  return str.split('-').map((word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join('');
}

const indexFilePath = path.join(componentPath, 'index.ts');
if(!fs.existsSync(indexFilePath)) {
  fs.writeFileSync(indexFilePath,
`import './${componentName}.scss';
export { default } from './${componentName}';
`);
}

const componentNamePascalCase = fromKebabPascalCase(componentName);

const moduleFilePath = path.join(componentPath, `${componentName}.ts`);
if(!fs.existsSync(moduleFilePath)) {
  fs.writeFileSync(moduleFilePath,
`import { Component, DefineComponent } from '@/core';

import { specification, I${componentNamePascalCase}Component } from './${componentName}.types';

@DefineComponent('${componentName}')
export default class ${componentNamePascalCase} extends Component<I${componentNamePascalCase}Component>(specification) {}

`);
}

const scssFilePath = path.join(componentPath, `${componentName}.scss`);
if(!fs.existsSync(scssFilePath)) {
  fs.writeFileSync(scssFilePath, 
`@import '~@spectrum-css/${componentName}/dist/index-vars';

uimo-${componentName} {

}
`);
}

const typesFilePath = path.join(componentPath, `${componentName}.types.ts`);
if(!fs.existsSync(typesFilePath)) {
  fs.writeFileSync(typesFilePath,
`import { ComponentDefinition } from '@/core/types';

import specification from './${componentName}.desc';

export { specification };

export type ExtraProps = { 
  props: {}
};

export type I${componentNamePascalCase}Component = ComponentDefinition<typeof specification, ExtraProps>;
`);
}    

const descFilePath = path.join(componentPath, `${componentName}.desc.ts`);
if(!fs.existsSync(descFilePath)) {
  fs.writeFileSync(descFilePath,
`export default {
  props: {

  }
} as const;    
`);
}

const indexFile = path.join(root, '../index.ts');
const indexContent = fs.readFileSync(indexFile, 'utf-8');
const lines = indexContent.split('\n');
lines.push(`export { default as ${componentNamePascalCase} } from './basic/${componentName}';`);
lines.sort();
fs.writeFileSync(indexFile, lines.join('\n'));

const definitionsFile = path.join(root, '../definitions.ts');
const definitionsContent = fs.readFileSync(definitionsFile, 'utf-8');
const definitionsLines = definitionsContent.split('\n');
definitionsLines.push(
  `export type { specification as ${componentNamePascalCase}Specification, ExtraProps as ${componentNamePascalCase}ExtraProps } from './basic/${componentName}/${componentName}.types';`);
definitionsLines.sort();
fs.writeFileSync(definitionsFile, definitionsLines.join('\n'));

const componentsFile = path.join(root, '../../types/components.ts');
const componentsContent = fs.readFileSync(componentsFile, 'utf-8');

// find second import block using regex
let importBlockStart = 0;
let importBlockEnd = 0;
// find second import block using regex match in while loop
let matches;
let pattern = new RegExp(/import \{/g);
while ((matches = pattern.exec(componentsContent))) {
  importBlockStart = matches.index;
}
const header = componentsContent.slice(0, importBlockStart - 1);

pattern = new RegExp(/\} from /g);
while ((matches = pattern.exec(componentsContent))) {
  importBlockEnd = matches.index;
}

const exportBlockStart = componentsContent.match(/export ([\s\S]*)/).index;
const componentsLines = componentsContent.slice(exportBlockStart).split('\n');
componentsLines.push(`export type ${componentNamePascalCase}Component = ComponentDefinition<typeof ${componentNamePascalCase}Specification, ${componentNamePascalCase}ExtraProps>;`);
componentsLines.sort();

let importLines = componentsContent.slice(importBlockStart + 9, importBlockEnd).split('\n');
importLines = importLines.filter((line) => line.trim() !== '');
importLines = importLines.map((line) => line.trim());
importLines.push(`${componentNamePascalCase}Specification,`);
importLines.push(`${componentNamePascalCase}ExtraProps,`);
importLines.sort();

fs.writeFileSync(componentsFile,
`${header}
import {
  ${importLines.join('\n\t')}
} from '../components/definitions';

${componentsLines.join('\n')}`);

//print log in green color
console.log('\x1b[32m%s\x1b[0m',`Component '${componentName}' created successfully`);

// run npm i @spectrum-css for the component name
const { exec } = require('child_process');
exec(`npm i @spectrum-css/${componentName}`, (err, stdout, stderr) => {
  if (err) {
    // print log in red color
    console.error(' ');
    console.error('\x1b[31m%s\x1b[0m',`WARN!!! Cannot install @spectrum-css/${componentName}`);
    console.error(' ');
    return;
  }
  console.error(' ');
  console.log('\x1b[32m%s\x1b[0m',`@spectrum-css/${componentName} installed successfully`);
  console.log(stdout);
});

// open component module file in vscode
exec(`code ${moduleFilePath}`);
