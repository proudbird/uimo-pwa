import path, { join } from 'path';
//@ts-ignore
import catalogist from 'catalogist';
import loadModule from './loadModule';


export declare type ApplicationStructure = {
  id: string,
  dirname: string,
  cubes: {
    [name: string]: {
      filename: string,
      classes: { 
        [name: string]: {
          filename: string,
          objects: {
            [name: string]: {
              filename: string,
              alias: string,
            }
          }
        }
      }
    }
  };
  modules: Record<string, string>
}

type ApplicationSettings = {
  appId: string;
  cubesDir: string;
  appCubes: string[];
};

export default async function defineAppStructure({
  appId,
  cubesDir,
  appCubes,
}: ApplicationSettings) {
  
  const applicationStructure: ApplicationStructure = { id: appId, dirname: cubesDir, cubes: {}, modules: {} };        
  const application = { cubes: {}, modules: {} };

  for(let cubeName of appCubes) {
    await defineCubeStructure(
      cubeName, 
      cubesDir,
      application, 
      applicationStructure, 
    );
  }

  return applicationStructure;
}

async function defineCubeStructure(
  cubeName: string, 
  cubesDir: string,
  application,
  applicationStructure,
) {

  const cubeFullPath = join(cubesDir, cubeName);
  const cubeModuleFile = `${cubeName}.client.ts`;
  
  const _cube = {};
                        
  const cubeFullModuleFile = path.join(cubeFullPath, cubeModuleFile);
  application[cubeName] = { cube: _cube, dirname: cubeFullModuleFile };
  application.cubes[cubeName]= { cube: _cube, dirname: cubeFullModuleFile };
  applicationStructure.cubes[cubeName] = { filename: cubeFullModuleFile, classes: {} };

  const cubeTree = catalogist.treeSync(
    cubeFullPath, {
      withSysRoot: true,
      childrenAlias: "next"
    }
  );

  for(let cubeLevel of cubeTree) {

    if(/\.dist/.test(cubeLevel.fullName)) {
      // skip file
      continue;
    }

    if(cubeLevel.ext.includes('.map')) {
      // skip file
      continue;
    }

    if(cubeLevel.fullName.includes('.d.')) {
      // skip file
      continue;
    }

    if(cubeLevel.name === 'Types') {
      continue;
    }

    if(cubeLevel.name === '_test') {
      continue;
    }
    
    const className = cubeLevel.fullName;
    if(!cubeLevel.isDirectory) {
      if((/\.client\./.test(cubeLevel.fullName))) {
        applicationStructure.cubes[`${cubeName}.${cubeLevel.name}`] = cubeLevel.fullPath;
      }
      continue;
    }

    let classModuleFile = cubeLevel.fullName + cubeLevel.ext;
    
    const fileName = path.join(cubeLevel.fullPath, classModuleFile)

    _cube[cubeLevel.name] = fileName;

    applicationStructure.cubes[cubeName].classes[cubeLevel.name] = { filename: path.join(cubeLevel.fullPath, classModuleFile), objects: {} };

    

    for(let classLevel of cubeLevel.next) {
      if(classLevel.dirName === 'Modules') {
        if(!(/\.client\./.test(classLevel.fullName))) {
          // skip file
          continue;
        }
        const module = await loadModule(cubeName, classLevel.fullPath, `${cubeName}.${classLevel.dirName}.${classLevel.name}`);
        applicationStructure.cubes[cubeName].classes[cubeLevel.name].objects[classLevel.name] = { 
          filename: classLevel.fullPath,
          alias: `${cubeName}.${classLevel.dirName}.${classLevel.name}`,
        };
        applicationStructure.modules[`${cubeName}.${classLevel.dirName}.${classLevel.name}`] = classLevel.fullPath;
      }
        continue;
    }
  }
}
