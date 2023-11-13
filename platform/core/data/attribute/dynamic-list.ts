import { DataAttribute, IStateManager, StateManager } from '../state';

import DataAttributeBase from './dataAttribute';
import { CollectionDataAttributeChangeEvent } from '../events';
import { StateDefinition } from '..';
import Reference from '../../objects/reference';

export type DynamicList = {};

export interface DynamicListAttributeOptions {
	cube: string;
	className: string;
	model: string;
	limit?: number;
	fields?: string;
	selected?: string;
}

export type DataProviderAttribute = {
	index: number;
	name: string;
	title: string;
	type: {
		dataType: string;
		cube: string;
		className: string;
		model: string;
	}
};

export type DynamicListProvider = {
	attributes: any[];
	entries: any[];
}

type FetchPortion = 'first' | 'next' | 'prev';

export default class DynamicListAttribute extends DataAttributeBase {
	#cube: string;
	#className: string;
	#model: string;
	#limit: number;
	#offset: number = 0;
	#fields: string;
	#selected: string | undefined;
	#cursor: string | undefined;
	#portion: FetchPortion = 'first';
	#length: number = 0;
	#pageIndex: number = 1;
	#provider: DynamicListProvider = {} as DynamicListProvider;
	#data: any[] = [];
	#fetchPromise: Promise<any> | undefined;
	// during initialization we suppose that all entries from the start are loaded
	#isFullFromStart: boolean = true;
  #isFullFromEnd: boolean = false;

	constructor({ cube, className, model, fields = '', limit = 30, selected }: DynamicListAttributeOptions, parent?: DataAttribute) {
		super(parent);

		this.#cube = cube;
		this.#className = className;
		this.#model = model;
		this.#limit = Math.max(6, limit);
		this.#fields = fields;
		this.#selected = selected;
		this.#cursor = selected;

		this.#fetchPromise = this.#fetchData(this.#onDataLoad.bind(this));
	}

	async #fetchData(callback: (data: any) => void) {
		//@ts-ignore
		const response = await fetch(`${location.origin}/app/${Application.id}/list/`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				cube: this.#cube,
				className: this.#className,
				model: this.#model,
				options: {
					limit: this.#limit,
					offset: this.#offset,
					fields: this.#fields,
					cursor: this.#cursor,
					portion: this.#portion,
				}
			})
		});
	
		const result = await response.json();
		if(result.error) {
			throw new Error(result.error);
		} else {
			return callback(result.data);
		}
	}

	async #onDataLoad(data: { attributes: any, entries: any[] }) {
		this.#provider.attributes = this.#provider.attributes || data.attributes;
		this.#provider.entries = (this.#provider.entries || []).concat(data.entries);

		// insert new portion to the current page position
		if(this.#cursor && this.#portion === 'first') {
			this.#data.push(data.entries);

			this.#isFullFromStart = false;

			this.#pageIndex = 1;
		} else if (this.#portion === 'prev') {


				this.#data.splice(0, 0, data.entries);
				this.#pageIndex = 1;


			if(data.entries.length < this.#limit) {
				this.#isFullFromStart = true;
			}

		} else {
			this.#data.push(data.entries);

			if(data.entries.length < this.#limit) {
				this.#isFullFromEnd = true;
			}

			this.#pageIndex = this.#data.length;
		}

		this.dispatchEvent(new CollectionDataAttributeChangeEvent(this, data, this.#pageIndex));
	}

	get limit(): number {
		return this.#limit;
	}

	get entries(): any {
		return this.#data;
	}

	get page(): number {
		return this.#pageIndex;
	}

	get selected(): string | undefined {
		return this.#selected;
	}

	get length(): number {
		return this.#provider.entries?.length || 0;
	}

	get portion(): FetchPortion {
		return this.#portion;
	}
	get isFullFromStart(): boolean {
		return this.#isFullFromStart;
	}

	get isFullFromEnd(): boolean {
		return this.#isFullFromEnd;
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

		const item = this.#buildItem(this.#data[page-1][index]);

		// if(this.#selected && index === this.#data[page-1].length - 1) {
		// 	this.#cursor = item.id?.value;
		// 	this.#portion = 'next';
		// }

		return item;
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

			if(attrType.toLocaleLowerCase() === 'reference') {
				initValue = new Reference({
					cube: attr.type.cube,
					className: attr.type.className,
					model: attr.type.model,
					id: record[0],
					presentation: record[1],
				});
			}

			definition[attrName] = { type: attrType.toLocaleLowerCase(), initValue };
		}

		return (new StateManager(definition)) as IStateManager;
	}

	async nextPage() {
		
		await this.#fetchPromise;
		
		this.#portion = 'next';

		if(this.#cursor) {
			if(this.#data.length) {
				this.#cursor = this.getItemByPage(this.#data.length, this.#data.at(-1).length - 1).id?.value;
			}
		}

		this.#offset += this.#limit;
		this.#fetchData(this.#onDataLoad.bind(this));
	}

	async prevPage() {

		await this.#fetchPromise;

		this.#cursor = this.getItemByPage(1, 0).Reference?.value.id;
		this.#portion = 'prev';

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
