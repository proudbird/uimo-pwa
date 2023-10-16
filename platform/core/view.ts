import { 
	IComponent, 
	IView, 
	InitViewModuleCallback, 
	Template, 
	ViewModule
} from '@/core/types';

import { StateDefinition } from '@/core/data';
import { IState, IStateManager, StateManager } from '@/core/data/state';

import ViewElement from '@/components/basic/view';

type ViewParams = {
  data: Record<string, any>;
}

export default class View implements IView {
	#id: string;
	#state: IStateManager;
	#module: ViewModule;
	#node: IComponent;

	constructor(id: string, config: Template, contextDefinition: StateDefinition, getModule: InitViewModuleCallback, params?: ViewParams) {
		this.#id = id;
		this.#module = getModule(this);
		this.#state = new StateManager(contextDefinition);
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

	get id(): string {
		return this.#id;
	}
	
	get elements() {
		return (this.#node).elements;
	}

	get node(): IComponent {
		return this.#node;
	}

	get module(): ViewModule {
		return this.#module;
	}

	get state(): IState {
		return this.#state.getData();
	}

	showView(view: View) {
		this.#node.replaceChildren(view.node);
	}
}
