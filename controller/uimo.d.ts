import loadView from './loadView';
import loadModule from './loadModule';
interface UimoProps {
    pathToCubes: string;
}
declare class Uimo {
    #private;
    constructor({ pathToCubes }: UimoProps);
    paths: {
        public: string;
        plarform: string;
    };
    index(): string;
    static(): string;
    /**
 * Load a view module based on the provided path and viewId.
 *
 * @param pathToCubes The base path to the view modules.
 * @param viewId The ID of the view module to load.
 * @returns A promise that resolves to the view module code or map.
 */
    loadView: typeof loadView;
    loadModule: typeof loadModule;

    initApp(params: any): Promise<any>;
}
export default Uimo;
