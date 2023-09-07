import { ElementDefinition, GetViewModuleHandler, ICustomElement, IState, IView, StateDefinition, ViewModule } from '@/types';
import ViewElement from '@/ui/components/basic/view';
import Context from '@/core/data/context';


export type ViewParams = {
  data: Record<string, any>;
}

export default class View implements IView {
	#state: IState;
	#module: ViewModule;
	#node: ICustomElement;

	constructor(config: ElementDefinition, contextDefinition: StateDefinition, getModule: GetViewModuleHandler, params?: ViewParams) {
		this.#module = getModule(this);
		this.#state = new Context(contextDefinition, params?.data);
		this.#node = new ViewElement({ owner: this, parent: this.node, config, context: this.#state, module: this.#module });

		for(const attrName of Object.getOwnPropertyNames(this.#state)) {
			Object.defineProperty(this, attrName, {
				get: () => this.#state[attrName].value,
				set: (value: any) => {
					this.#state[attrName].value = value},
			});
		}

		this.#module.onMounted && this.#module.onMounted.apply(this);
	}

	get elements() {
		return (this.#node).elements;
	}

	get node(): ICustomElement {
		return this.#node;
	}

	get state(): IState {
		return this.#state;
	}

	showView(view: View) {
		this.#node.replaceChildren(view.node);
	}
}
