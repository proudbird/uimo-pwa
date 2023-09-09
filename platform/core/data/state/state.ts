import { 
	ElementPropertyDataSource, 
	ElementPropertyHandler, 
	StateDefinition, 
	StateValueType
} from '@/types';

import { 
	DataAttribute, 
	IDataAttributeCollection,
	IState, 
	IStateManager
} from './types';

import dataAttributeConstructors from'../attribute/constructors';

class StateManagerBase {
	#data: IState;

	constructor() {
		this.#data = new State();
	}

	registerAttribute(attributeName: string, attribute: DataAttribute | IDataAttributeCollection) {
		this.#data.addAttribute(attributeName, attribute);
	}

	getData() {
		return this.#data as IState;
	}

	merge(source: IStateManager | IStateManager[]) {
		source = Array.isArray(source) ? source : [source];
		for(const manager of source) {
			for(const [attrName, attr] of Object.entries(manager || {})) {
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

	constructor(definition: StateDefinition = {}, context?: IStateManager) {
		super();
		for(let [attrName, attrOptions] of Object.entries(definition)) {
			let attr: DataAttribute | IDataAttributeCollection;
			const value = attrOptions.initValue;
			if(value?.DataAttribute) {
				attr = value;	
			} else if(typeof value === 'object' && (value as ElementPropertyHandler).handler) {
				// TODO: how to handle such cases???
				throw new StateError(`State attribute can't be defined from handler'`);
			} else if(typeof value === 'object' && (value as ElementPropertyDataSource).path) {
				attr = (context || {} as IStateManager)[value.path];
				if(!attr) {
					throw new StateError(`Context doesn't have attribute '${value.path}'`);
				}
			} else {
				const Constructor = dataAttributeConstructors[attrOptions.type as StateValueType];
				if(Constructor) {
					attr = new Constructor(attrOptions);
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

	addAttribute(attributeName: string, attribute: DataAttribute | IDataAttributeCollection) {
		Object.defineProperty(this, attributeName, {
			enumerable: true,
			get: () => {
				if(attribute.isIterable) {
					return attribute;
				} else {
					return (attribute as DataAttribute).value;
				}
			},
			set: (value) => {
				if(attribute.isIterable) {
					throw new StateError(`Attribute ${String(attributeName)} is iterable and cannot be set`);
				} else {
					(attribute as DataAttribute).value = value;
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
