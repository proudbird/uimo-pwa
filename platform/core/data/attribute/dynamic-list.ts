import { StateDefinition } from '@/types';
import { IStateManager, StateManager } from '../state';

import DataAttributeBase from './dataAttribute';
import { DataAttributeChangeEvent } from '../events';

export interface DynamicListAttributeOptions {
	cube: string;
	className: string;
	object: string;
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

export default class DynamicListAttribute extends DataAttributeBase {
	#cube: string;
	#className: string;
	#object: string;
	#provider: any = {};

	constructor({ cube, className, object }: DynamicListAttributeOptions) {
		super();

		this.#cube = cube;
		this.#className = className;
		this.#object = object;

		this.#fetchData();
	}

	async #fetchData() {
		const response = await fetch(`${location.origin}/app/${Application.id}/list/`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				cube: this.#cube,
				className: this.#className,
				object: this.#object,
			})
		});
	
		const result = await response.json();
		if(result.error) {
			throw new Error(result.error);
		} else {
			this.#onDataLoad(result.data);
		}
	}

	#onDataLoad(data: { attributes: any, entries: any[] }) {
		this.#provider.attributes = data.attributes;
		this.#provider.entries = data.entries;

		this.dispatchEvent(new DataAttributeChangeEvent(this));
	}

	[Symbol.iterator] = () => {

    let count = 0;
    let done = false;

    let next = () => {
			const definition: StateDefinition = {};
       if(count >= this.#provider.entries.length) {
          done = true;
       } else {
				 	const entry = this.#provider.entries[count++];
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
				}

       return { done, value: (new StateManager(definition)) as IStateManager};
    }

    return { next };
  }
}
