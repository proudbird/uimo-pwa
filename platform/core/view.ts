import { 
	IComponent, 
	IView, 
	InitViewModuleCallback, 
	Template, 
	ViewModule,
	ViewParams
} from '@/core/types';

import { StateDefinition } from '@/core/data';
import { IState, IStateManager, StateManager } from '@/core/data/state';

import ViewElement from '@/components/basic/view';
import ModalView from '@/components/basic/modal';
import InstanceAttribute from './data/attribute/instance';
import Reference from './objects/reference';

export default class View extends EventTarget implements IView {
	#id: string;
	#state: IStateManager;
	#module: ViewModule;
	#node: IComponent;
	#instance: InstanceAttribute | null = null;
	#reference: Reference | null = null;
	#params: ViewParams;
	#parent: View | null = null;
	#listeners: Record<string, EventListenerOrEventListenerObject> = {};

	constructor(id: string, config: Template, contextDefinition: StateDefinition, getModule: InitViewModuleCallback, params?: ViewParams) {
		super();

		this.#id = id;
		this.#module = getModule(this);
		this.#params = params || {};

		this.#parent = params?.parent || null;

		if(params?.reference) {
			const instanceDefinition = contextDefinition.instance;
			instanceDefinition.id = params.reference.id;
			this.#reference = params.reference;
		}

		if(params?.selectedItems) {
			contextDefinition.list.selected = params.selectedItems[0].id;
		}

		this.#state = new StateManager(this, contextDefinition);

		if(config.modal) {
			this.#node = new ModalView({ owner: this, parent: this.node, config, context: this.#state, module: this.#module });
		} else 
		{
			this.#node = new ViewElement({ owner: this, parent: this.node, config, context: this.#state, module: this.#module });
		}

		this.#instance = this.#state['instance'];

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

	get reference(): Reference | null {
		return this.#reference;
	}

	get instance(): InstanceAttribute | null {
		return this.#instance;
	}

	get params(): ViewParams {
		return this.#params;
	}

	get parent(): View | null {
		return this.#parent;
	}

	on(event: string, callback: EventListenerOrEventListenerObject) {
		this.addEventListener(event, callback);
		this.#listeners[event] = callback;
	}

	show(view: View) {
		this.#node.replaceChildren(view.node);

		this.dispatchEvent(new CustomEvent('show', {
			detail: view
		}));
	}

	close(result: any) {
		this.dispatchEvent(new CustomEvent('close', {
			detail: result
		}));

		for(const event in this.#listeners) {
			this.removeEventListener(event, this.#listeners[event]);
		}
	}

	async save(): Promise<void> {
		if(this.#instance) {
			this.#instance.save();
		}
	}
}
