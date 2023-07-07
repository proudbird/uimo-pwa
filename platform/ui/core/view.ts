import { ElementConfig, ViewModule } from '@/types';
import ViewElement from '@/ui/components/basic/view';
import Context from '@/core/data/context';

export default class View {
	#context: IDataContext;
	#module: ViewModule;
	#element: HTMLElement;

	constructor(config: ElementConfig, contextDefinition: DataDefinition, module: ViewModule) {
		this.#module = module;
		this.#context = new Context(contextDefinition);
		this.#element = new ViewElement(this, config, this.#context, this.#module);

		for(const attrName of Object.getOwnPropertyNames(this.#context)) {
			Object.defineProperty(this, attrName, {
				get: () => this.#context[attrName].value,
				set: (value: any) => {
					this.#context[attrName].value = value},
			});
		}
	}

	get element(): HTMLElement {
		return this.#element;
	}
}
