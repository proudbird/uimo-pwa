//@ts-nocheck
import { CustomElement, ElementConfig, ViewModule } from '@/types';
import ViewElement from '@/ui/components/basic/view';
import Context from '@/core/data/context';


export type ViewParams = {
  data: Record<string, any>;
}

export default class View {
	#context: IDataContext;
	#module: ViewModule;
	#node: HTMLElement;

	constructor(config: ElementConfig, contextDefinition: DataDefinition, getModule: ViewModule, params?: ViewParams) {
		this.#module = getModule(this);
		this.#context = new Context(contextDefinition, params?.data);
		this.#node = new ViewElement(this, config, { context: this.#context, state: {} }, this.#module);

		for(const attrName of Object.getOwnPropertyNames(this.#context)) {
			Object.defineProperty(this, attrName, {
				get: () => this.#context[attrName].value,
				set: (value: any) => {
					this.#context[attrName].value = value},
			});
		}

		this.#module.onMounted && this.#module.onMounted.apply(this);
	}

	get elements() {
		return (this.#node as Partial<CustomElement>).elements;
	}

	get node(): HTMLElement {
		return this.#node;
	}

	showView(view: View) {
		this.#node.replaceChildren(view.node);
	}
}
