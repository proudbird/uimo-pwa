import { IView, PropDataSourceDefinition, PropHandlerDefinition } from '../../../core/types';

import { 
	DataAttribute, 
	IMonoDataAttribute, 
	IState, 
	IStateManager,
	StateDefinition
} from '../index';

import dataAttributeConstructors from'../attribute/constructors';

class StateManagerBase {
	#data: IState;
	#owner: IView;

	constructor(owner: IView) {
		this.#data = new State();
		this.#owner = owner;
	}

	get owner() {
		return this.#owner;
	}

	registerAttribute(attributeName: string, attribute: DataAttribute) {
		this.#data.addAttribute(attributeName, attribute);
	}

	getData() {
		return this.#data as IState;
	}

	merge(source: IStateManager | IStateManager[]) {
		source = Array.isArray(source) ? source : [source];
		for(const manager of source) {
			for(const [attrName, attr] of Object.entries(manager || {})) {
				if(!attr.inScope) {
					continue;
				}
				Object.defineProperty(this, attrName, {
					value: attr,
					writable: false,
					enumerable: true,
				});
	
				this.registerAttribute(attrName, attr);
			}
		}

		return this;
	}
}

export class StateManager extends StateManagerBase {

	constructor(owner: IView, definition: StateDefinition = {}, context?: IStateManager) {
		super(owner);
		for(let [attrName, attrOptions] of Object.entries(definition)) {
			let attr: DataAttribute;
			const value = attrOptions.initValue;
			if(value?.DataAttribute) {
				attr = value;	
			} else if(typeof value === 'object' && (value as PropHandlerDefinition)?.handler) {
				// TODO: how to handle such cases???
				throw new StateError(`State attribute can't be defined from handler'`);
			} else if(typeof value === 'object' && (value as PropDataSourceDefinition)?.path) {
				attr = (context || {} as IStateManager)[value.path];
				if(!attr) {
					throw new StateError(`Context doesn't have attribute '${value.path}'`);
				}
			} else {
				//@ts-ignore
				const Constructor = dataAttributeConstructors[attrOptions.type as any];
				if(Constructor) {
					attr = new Constructor(attrOptions, this.owner);
				} else {
					throw new StateError(`Data attribute constructor for type ${attrOptions.type} not found`);
				}
			} 

			Object.defineProperty(this, attrName, {
				value: attr!,
				writable: false,
				enumerable: true,
			});

			this.registerAttribute(attrName, attr!);
		}
	}
}

class StateBase {

	addAttribute(attributeName: string, attribute: DataAttribute) {
		Object.defineProperty(this, attributeName, {
			enumerable: true,
			get: () => {
				if(attribute.isIterable) {
					return attribute;
				} else {
					return (attribute as IMonoDataAttribute).value;
				}
			},
			set: (value) => {
				if(attribute.isIterable) {
					throw new StateError(`Attribute ${String(attributeName)} is iterable and cannot be set`);
				} else {
					(attribute as IMonoDataAttribute).value = value;
					return true;
				}
			}
		});
	}
}

class State extends StateBase {}

export class StateError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'StateError';
	}
}
