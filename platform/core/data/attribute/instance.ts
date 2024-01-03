import Reference from '@/core/objects/reference';
import { IView } from '@/core/types';

import DataAttributeBase from './dataAttribute';
import { DataAttributeChangeEvent } from '../events';

import Instance from '../../objects/instance';
import dataAttributeConstructors from'../attribute/constructors';
import UnknownAttribute from './unknown';
import { StateError } from '../state/state';
import { DataAttribute } from '..';

export interface InstanceAttributeOptions {
	cube: string;
	className: string;
	model: string;
	id: string;
	fields?: string;
}

export type DataProviderAttribute = {
	index: number;
	name: string;
	title: string;
	type: {
		dataType: string;
		reference: string;
		cube: string;
		className: string;
		model: string;
	}
};

export type InstanceProvider = {
	attributes: any[];
	entries: any[];
}

export default class InstanceAttribute extends DataAttributeBase {
	#cube: string;
	#className: string;
	#model: string;
	#id: string;
	#fields: string;
	#provider: InstanceProvider = {} as InstanceProvider;
	#value: Instance | null = null;
	#attributes: Record<string, DataAttribute> = {};
	#changedFields: Set<string> = new Set();

	constructor({ cube, className, model, id, fields }: InstanceAttributeOptions, owner?: IView, parent?: DataAttribute) {
		super(owner, parent);

		this.#cube = cube;
		this.#className = className;
		this.#model = model;
		this.#id = id;
		this.#fields = fields || 'id';

		for(let attrName of this.#fields.split(',')) {
			attrName = attrName.trim();
			const value = new UnknownAttribute(attrName, owner, this);
			this.#attributes[attrName] = value;
			Object.defineProperty(this, attrName, {
				get: () => {
					return this.#attributes[attrName];
				},
			});
		}

		this.#fetchData(this.#onDataLoad.bind(this));
	}

	async #fetchData(callback: (data: any) => void) {
		//@ts-ignore
		const response = await fetch(`${location.origin}/app/${Application.id}/instance/`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				cube: this.#cube,
				className: this.#className,
				model: this.#model,
				options: {
					where: {
						id: this.#id,
					},
					fields: this.#fields,
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

	get value(): Instance | null {
		return this.#value;
	}

	set value(value: Instance) {
		this.#value = value;

		this.dispatchEvent(new DataAttributeChangeEvent(this, this.#value));
	}

	get cube(): string {
		return this.#cube;
	}

	get className(): string {
		return this.#className;
	}

	get model(): string {
		return this.#model;
	}

	get id(): string {
		return this.#id;
	}

	#onDataLoad(data: { attributes: any, entries: any[] }) {
		this.#provider.attributes = this.#provider.attributes || data.attributes;
		this.#provider.entries = this.#provider.entries || {} as any;

		if(data.entries?.length) {
			this.#value= this.#buildInstance(data.entries[0])!;
		} else {
			this.#value= this.#buildInstance([])!;
		}
	}

	#buildInstance(entry: any) {
		const instance = new Instance({
			cube: this.#cube,
			className: this.#className,
			model: this.#model,
			id: this.#id,
		});

		for(let [attrName, attr] of Object.entries<DataProviderAttribute>(this.#provider.attributes)) {
			let record = entry[attr.index];
			let initValue = record;
			let attrType = attr.type.dataType.toLocaleLowerCase();

			if(attrType === 'fk') {
				attrType = 'reference';
			}

			if(attrType === 'reference') {
				if(!record) {
					record = [null, null];
				}
				initValue = {
					initValue:new Reference({
						cube: attr.type.cube,
						className: attr.type.className,
						model: attr.type.model,
						id: record[0],
						presentation: record[1],
					})
				};
			} else {
				initValue = {
					initValue
				};
			}

			const Constructor = dataAttributeConstructors[attrType as keyof typeof dataAttributeConstructors];
			if(Constructor) {
				const value = new Constructor(initValue, this.owner, this);

				
				Object.defineProperty(instance, attrName, {
					get: () => {
						return this.#attributes[attrName];
					},
				});
				
				const dataAttribute = this[attrName as keyof InstanceAttribute] as unknown as UnknownAttribute;
				dataAttribute?.addEventListener('destroy', (e: Event) => {
					((e as CustomEvent).detail as DataAttribute).addEventListener('change', (e: Event) => {
						this.#changedFields.add(attrName);
					});
				});
				if(dataAttribute) {
					dataAttribute.dispatchEvent(new CustomEvent('initialized', { detail: { value }}));
				}

				this.#attributes[attrName] = value;

			} else {
				throw new StateError(`Data attribute constructor for type ${attrType} not found`);
			}
		}

		return instance;
	}

	getChanges() {
		const changes: { [key: string]: any } = {};
		for(let [fieldName] of this.#changedFields.entries()) {
			const attribute = (this[fieldName as keyof InstanceAttribute] as any);
			let value = attribute.value;
			if(!value) {
				continue;
			}
			
			if(value instanceof Reference) {
				value = {
					type: `${value.cube}.${value.className}.${value.model}`,
					id: value.id,
				};
			}
			changes[fieldName] = value;
		}

		return changes;
	}

	getAttribute(name: string) {
		return this.#attributes[name];
	}

	async save() {
		return new Promise((resolve, reject) => {
			//@ts-ignore
			fetch(`${location.origin}/app/${Application.id}/save/`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					cube: this.#cube,
					className: this.#className,
					model: this.#model,
					options: {
						id: this.#id,
						changes: this.getChanges(),
					}
				})
			}).then((response) => {
				response.json().then((result) => {
					if(result.error) {
						reject(result.error);
					} else {
						this.#id = result.data?.id || this.#id;
						this.#value = new Instance({
							cube: this.#cube,
							className: this.#className,
							model: this.#model,
							id: this.#id,
						});

						this.owner?.dispatchEvent(new CustomEvent(result.data.operation, {
							detail: this
						}));

						if(this.owner?.parent) {
							this.owner.parent.dispatchEvent(new CustomEvent(result.data.operation, {
								detail: this
							}));
						}

						resolve(void 0);
					}
				});
			});
		});
	}
}
