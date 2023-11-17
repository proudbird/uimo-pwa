
import { IView } from '@/core/types';

import DataAttributeBase from './dataAttribute';
import dataAttributeConstructors from'./constructors';
import { StateError } from '../state/state';
import { DataAttribute } from '..';

export interface StructureAttributeOptions {
	attributes: {
		[key: string]: DataProviderAttribute;
	}
}

export type StructureValue = {
	[key: string]: any;
}

export type DataProviderAttribute = {
	index?: number;
	name?: string;
	title?: string;
	type?: string,
	initValue?: any
};

export type StructureAttributeType = StructureAttribute & {
	[key: string]: DataAttribute;
}

export default class StructureAttribute extends DataAttributeBase {
	#value: StructureValue = {} as StructureValue;
	#attributes: Record<string, DataAttribute> = {};

	constructor(options: StructureAttributeOptions | StructureAttribute, owner: IView, parent?: DataAttribute) {
		if(options instanceof StructureAttribute) {
			return options;
		}
		
		super(owner, parent);

		for(let [attrName, attr] of Object.entries<DataProviderAttribute>(options.attributes || {})) {
			let initValue = attr.initValue;
			let attrType = attr.type?.toLocaleLowerCase();

			const Constructor = dataAttributeConstructors[attrType as keyof typeof dataAttributeConstructors];
			if(Constructor) {
				const value = new Constructor({initValue}, this.owner, this);
				this.#attributes[attrName] = value;

				Object.defineProperty(this, attrName, {
					get: () => value,
					set: (value) => this.#attributes[attrName] = value
				});

				Object.defineProperty(this.#value, attrName, {
					enumerable: true,
					get: () => value,
					set: (value) => this.#attributes[attrName] = value
				});

			} else {
				throw new StateError(`Data attribute constructor for type ${attrType} not found`);
			}
		}
	}

	get value(): StructureValue {
		return this.#value;
	}
}
