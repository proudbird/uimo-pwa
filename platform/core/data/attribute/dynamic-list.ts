import { StateDefinition } from '@/types';
import { IStateManager, StateManager } from '../state';

import DataAttributeBase from './dataAttribute';
import { CollectionDataAttributeChangeEvent } from '../events';

export type DynamicList = {};

export interface DynamicListAttributeOptions {
	cube: string;
	className: string;
	object: string;
	limit?: number;
}

export type DataProviderAttribute = {
	index: number;
	name: string;
	title: string;
	type: {
		dataType: string;
		reference: string;
	}
};

export type DynamicListProvider = {
	attributes: any[];
	entries: any[];
}

export default class DynamicListAttribute extends DataAttributeBase {
	#cube: string;
	#className: string;
	#object: string;
	#limit: number;
	#offset: number = 0;
	#pageIndex: number = 0;
	#provider: DynamicListProvider = {} as DynamicListProvider;
	#data: any[] = [];

	constructor({ cube, className, object, limit = 50 }: DynamicListAttributeOptions) {
		super();

		this.#cube = cube;
		this.#className = className;
		this.#object = object;
		this.#limit = limit;

		this.#fetchData(this.#onDataLoad.bind(this));
	}

	async #fetchData(callback: (data: any) => void) {
		const response = await fetch(`${location.origin}/app/${Application.id}/list/`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				cube: this.#cube,
				className: this.#className,
				object: this.#object,
				options: {
					limit: this.#limit,
					offset: this.#offset,
				}
			})
		});
	
		const result = await response.json();
		if(result.error) {
			throw new Error(result.error);
		} else {
			callback(result.data);
		}
	}

	#onDataLoad(data: { attributes: any, entries: any[] }) {
		this.#provider.attributes = this.#provider.attributes || data.attributes;
		this.#provider.entries = (this.#provider.entries || []).concat(data.entries);

		this.#data[this.#pageIndex] = data.entries;
		this.#pageIndex++;

		this.dispatchEvent(new CollectionDataAttributeChangeEvent(this, data, this.#pageIndex));
	}

	get limit(): number {
		return this.#limit;
	}

	get page(): number {
		return this.#pageIndex;
	}

	getItemByIndex(index: number) {
		return this.#buildItem(this.#provider.entries[index]);
	}

	getItemByPage(page: number, index: number) {
		if(page > this.#data.length) {
			throw new Error(`Page ${page} is out of range`);
		}
		if(index >= this.#data[page-1].length) {
			throw `index_out_of_range`;
		}
		return this.#buildItem(this.#data[page-1][index]);
	}

	#buildItem(entry: any) {
		const definition: StateDefinition = {};
		for(let [attrName, attr] of Object.entries<DataProviderAttribute>(this.#provider.attributes)) {
			const record = entry[attr.index];
			let initValue = record;
			let attrType = attr.type.dataType;

			if(attrType === 'FK') {
				attrType = 'Reference';
			}

			if(attrType === 'Reference') {
				initValue = {
					id: record[0],
					model: record[1],
					presentation: record[2],
				};
			}

			definition[attrName] = { type: attrType, initValue };
		}

		return (new StateManager(definition)) as IStateManager;
	}

	nextPage() {
		this.#offset += this.#limit;
		this.#fetchData(this.#onDataLoad.bind(this));
	}

	[Symbol.iterator] = () => {

    let count = 0;
    let done = false;

    let next = () => {
			let value: IStateManager = {} as IStateManager;
       if(count >= this.#provider.entries.length) {
          done = true;
       } else {
				 	value = this.#buildItem(this.#provider.entries[count++]);
				}

       return { done, value };
    }

    return { next };
  }

	forEach(iteratee: (value: IStateManager, index: number) => boolean): void {
		let index = 0;
		for(let item of this) {
			if(iteratee(item, index++) === false) {
				break;
			};
		}
	}
}
