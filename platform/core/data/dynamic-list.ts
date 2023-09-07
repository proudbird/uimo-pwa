import DataAttribute from "./dataAttribute";
import { DataAttributeChangeEvent } from "./events";
import { IDataAttribute } from "../../types";
import DataAttributeConstructors from './constructors';
import ReferenceAttribute from "./reference";

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

export default class DynamicListAttribute extends DataAttribute implements IDataAttribute {
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
			const value: any = {};
       if(count >= this.#provider.entries.length) {
          done = true;
       } else {
				 	const entry = this.#provider.entries[count++];
					for(let [attrName, attr] of Object.entries<DataProviderAttribute>(this.#provider.attributes)) {
						const record = entry[attr.index];
						let attrTypy = attr.type.dataType;
						if(attrTypy === 'FK') {
							attrTypy = 'Reference';
						}
						const dataAttributeConstructor = DataAttributeConstructors[attrTypy as keyof typeof DataAttributeConstructors];
						if(dataAttributeConstructor) {
							let dataAttribute: DataAttribute;
							if(attrTypy === 'Reference') {
								const ref = {
									id: record[0],
									model: record[1],
									presentation: record[2],
								};
								dataAttribute = new (dataAttributeConstructor as typeof ReferenceAttribute)({ initValue: ref });
							} else {
								dataAttribute = new dataAttributeConstructor(record);
							}
							value[attrName] = dataAttribute;
						} else {
							throw new Error(`Data attribute constructor for type ${attrTypy} not found`);
						}
					}
			 }

       return { done, value };
    }

    return { next };
  }

	get value() {
		return this.#provider;
	}
}
