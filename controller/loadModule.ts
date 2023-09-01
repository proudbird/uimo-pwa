import { readFileSync } from 'node:fs';
import { Output, transform, transformSync } from '@swc/core';
import defineGlobals from './defineGlobals';
import transformCode from './transform';


// Type definition for the ViewCache
interface ViewCache {
  [viewId: string]: { code: string; globals: any, map: string };
}

// Cache object to store the loaded views
const cache: ViewCache = {};

/**
 * Load a view module based on the provided path and viewId.
 *
 * @param pathToCubes The base path to the view modules.
 * @param viewId The ID of the view module to load.
 * @returns A promise that resolves to the view module code or map.
 */
export default async function loadModule(
	cubeName: string,
	fileName: string,
	alias: string
): Promise<string> {
	return new Promise(async (resolve) => {

		// If the viewId ends with '.js.map', return the corresponding map from the cache.
		if (alias.includes('.js.map')) {
			resolve(cache[alias.replace('.js.map', '')].map);
		}

		try {
			// Load the view definition, data, and module.
			const module = await loadModuleTsFile(
				fileName,
				alias.replace(/\./g, '/').replace('/client', '.client')
			);

			const globals = defineGlobals(module.code, cubeName, ['Catalogs', 'Modules']);
			const globalsNames = [...Object.keys(globals.cubes), ...Object.keys(globals.objects)].join(', ');

			// Generate the result string with the view module code, layout, and data.
			const result = `(() => { const module = {}; window.modules["${alias}"] = { getModule: () => { ((exports, ${globalsNames}) => { ${
				module.code
			} })(module, ...defineGlobals(${JSON.stringify(globals)})); return module }};})();//# sourceMappingURL=${alias}.js.map`;

			// Cache the result and resolve the promise with the result.
			cache[alias] = { code: result, globals, map: module.map };
			resolve(result);
		} catch (error) {
			// If an error occurs during loading, resolve the promise with an error mark.
			resolve(errorMark(alias, (error as Error).message));
		}
	});
}

/**
 * Load and transform a TypeScript module file from the provided filePath and fileAlias.
 *
 * @param filePath The path to the TypeScript module file.
 * @param fileAlias The alias for the module file.
 * @returns The loaded and transformed module.
 */
export async function loadModuleTsFile(filePath: string, fileAlias: string): Promise<any> {
	const source = readFileSync(filePath, 'utf8');

	let result: Output = { code: '', map: '' };
	try {
		//@ts-ignore
		result = (await transformCode(source, `${fileAlias}.ts`)) as Output;
	} catch (error) {
		console.log(error);
	}

	//@ts-ignore
	return { code: result.code, map: result.map };
}

/**
 * Create an error mark for the specified viewId and error message.
 *
 * @param viewId The ID of the view module.
 * @param errorMessage The error message.
 * @returns The error mark string.
 */
function errorMark(viewId: string, errorMessage: string): string {
	return `(() => { window.views["${viewId}"] = { error: "${errorMessage}" }; })();`;
}