import { IView } from '@/core/types';

import { DataAttribute, IStateManager } from '../state';

import DataAttributeBase from './dataAttribute';
import { CollectionDataAttributeChangeEvent } from '../events';

export type DynamicList = {};

export interface ListAttributeOptions {
	initValue: any;
}

export default class ListAttribute extends DataAttributeBase {
	#entries: any[] = [];

	constructor({ initValue}: ListAttributeOptions, owner?: IView, parent?: DataAttribute) {
		super(owner, parent);

		if(initValue) {
			if(Array.isArray(initValue)) {
				this.#entries = initValue;
			} else {
				this.#entries = [initValue];
			}
		}
	}

	get value(): ListAttribute {
		return this;
	}

	get length(): number {
		return this.#entries.length;
	}

	get(index: number) {
		return this.#entries[index];
	}

	add(value: any): ListAttribute {
		this.#entries.push(value);

		this.dispatchEvent(new CollectionDataAttributeChangeEvent(this, value));
		
		return this;
	}

	removeByIndex(index: number): ListAttribute {
		const value = this.#entries[index];

		this.#entries.splice(index, 1);

		this.dispatchEvent(new CollectionDataAttributeChangeEvent(this, value));

		return this;
	}

	remove(value: any): ListAttribute {
		const index = this.#entries.indexOf(value);
		if(index > -1) {
			this.#entries.splice(index, 1);
		}

		this.dispatchEvent(new CollectionDataAttributeChangeEvent(this, value));

		return this;
	}

	insert(value: any, index: number): ListAttribute {
		this.#entries.splice(index, 0, value);

		this.dispatchEvent(new CollectionDataAttributeChangeEvent(this, value));

		return this;
	}

	set(index: number, value: any): ListAttribute {
		this.#entries[index] = value;

		this.dispatchEvent(new CollectionDataAttributeChangeEvent(this, value));

		return this;
	}

	replace(value: any, newValue: any): ListAttribute {
		const index = this.#entries.indexOf(value);
		if(index > -1) {
			this.set(index, newValue);
		}

		this.dispatchEvent(new CollectionDataAttributeChangeEvent(this, newValue));

		return this;
	}

	sort(prop: string, direction: 'asc' | 'desc' = 'asc'): ListAttribute {
		this.#entries.sort((a, b) => {
			if(direction === 'asc') {
				return a[prop] > b[prop] ? 1 : -1;
			} else {
				return a[prop] < b[prop] ? 1 : -1;
			}
		});

		this.dispatchEvent(new CollectionDataAttributeChangeEvent(this, this.#entries));

		return this;
	}

	find(predicate: (value: any, index: number, obj: any[]) => boolean): any {
		return this.#entries.find(predicate);
	}

	[Symbol.iterator] = () => {

    let count = 0;
    let done = false;

    let next = () => {
			let value: IStateManager = {} as IStateManager;
       if(count >= this.#entries.length) {
          done = true;
       } else {
				 	value = this.#entries[count++];
				}

       return { done, value };
    }

    return { next };
  }

	forEach(iteratee: (value: IStateManager, index: number) => boolean | void): void {
		let index = 0;
		for(let item of this) {
			if(iteratee(item, index++) === false) {
				break;
			};
		}
	}
}
