
import { IView } from '@/core/types';

import DataAttributeBase from './dataAttribute';
import dataAttributeConstructors from'./constructors';
import { StateError } from '../state/state';
import { DataAttribute } from '..';

export interface StructureAttributeOptions {
	initValue?: {
		[key: string]: DataProviderAttribute | any;
	},
	definition?: {
		[key: string]: any;
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

	constructor(options: StructureAttributeOptions | StructureAttribute, owner?: IView, parent?: DataAttribute) {
		if(options instanceof StructureAttribute) {
			return options;
		}
		
		super(owner, parent);

		const initAttribute = (attrType: string, attrName: string, initValue: any) => {
			const Constructor = dataAttributeConstructors[attrType as 
				keyof Omit<typeof dataAttributeConstructors, 'DataListAttribute'|'Structure'|'Instance'|'DynamicList'>];
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

		if(options.definition) {
			for(let [attrName, attr] of Object.entries<DataProviderAttribute>(options.definition)) {
				const initValue = options.initValue?.[attrName];
				const attrType = attr.type?.toLocaleLowerCase()!;
	
				initAttribute(attrType, attrName, initValue);
			}
		} else if(options.initValue) {
			for(let [attrName, value] of Object.entries<DataAttribute>(options.initValue)) {
				const initValue = value;
				const attrType = getDataAttributeTypeByValue(value);

				initAttribute(attrType, attrName, initValue);
			}
		}
	}

	get value(): StructureValue {
		return this.#value;
	}
}

function getDataAttributeTypeByValue(value: any) {
	const valueType = typeof value;

	switch (true) {
		case value instanceof Date:
			return 'date';
		
		default:
			return valueType;
	}
}
