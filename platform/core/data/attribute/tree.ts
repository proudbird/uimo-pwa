import { IComponent, IView } from '@/core/types';

import DataAttributeBase from './dataAttribute';
import { CollectionDataAttributeChangeEvent, CollectionDataAttributeLoadEvent } from '../events';
import StructureAttribute from './structure';
import { DataAttribute } from '../state';

export type DynamicList = {};

export interface Command {
	name: string;
	title: string;
	icon?: string;
}

export interface TreeItem {
	value: StructureAttribute;
	children?: TreeItem[];
}

export class TreeItemAttribute extends DataAttributeBase {
	#owner: IView | undefined;
	#parent: TreeAttribute;
	#parentNode: TreeItemAttribute | undefined;
	#item: StructureAttribute;
	#children: TreeItemAttribute[];
	#level: number = 0;
	#isBranchNode: boolean = false;

	constructor(item: TreeItem, owner: IView | undefined, parent: TreeAttribute, parentNode: TreeItemAttribute | undefined) {
		super(owner, parent);
		
		this.#owner = owner;
		this.#parent = parent;
		this.#parentNode = parentNode;
		this.#level = this.#parentNode ? this.#parentNode.level + 1 : 0;
		this.#isBranchNode = !!item.children;
		this.#children = item.children?.map(child => new TreeItemAttribute(child, owner, parent, this)) || [];

		this.#item = new StructureAttribute({ initValue: item.value });

	}

	get value() {
		return this.#item;
	}

	get children() {
		return this.#children;
	}

	get level() {
		return this.#level;
	}

	get isIterable(): boolean {
		return false;
	}

	get isBranchNode(): boolean {
		return this.#isBranchNode;
	}

	getItem(index: number) {
		return this.#children[index];
	}

	addItem(item: TreeItem): TreeItemAttribute {
		const itemAttribute = new TreeItemAttribute(item, this.#owner, this.#parent, this);
		this.#children.push(itemAttribute);

		this.#owner && this.#owner.dispatchEvent(new CollectionDataAttributeChangeEvent(this.#parent, itemAttribute));
		
		return this;
	}

	removeByIndex(index: number): TreeItemAttribute {
		const itemAttribute = this.#children[index];

		this.#children.splice(index, 1);

		this.#owner && this.#owner.dispatchEvent(new CollectionDataAttributeChangeEvent(this.#parent, itemAttribute));

		return this;
	}

	remove(item: TreeItemAttribute): TreeItemAttribute {
		const index = this.#children.indexOf(item);
		if(index > -1) {
			this.#children.splice(index, 1);
		}

		this.#owner && this.#owner.dispatchEvent(new CollectionDataAttributeChangeEvent(this.#parent, item));

		return this;
	}

	insert(item: TreeItem, index: number): TreeItemAttribute {
		const itemAttribute = new TreeItemAttribute(item, this.#owner, this.#parent, this);
		
		this.#children.splice(index, 0, itemAttribute);

		this.#owner && this.#owner.dispatchEvent(new CollectionDataAttributeChangeEvent(this.#parent, itemAttribute));

		return this;
	}

	set(index: number, item: TreeItem): TreeItemAttribute {
		const itemAttribute = new TreeItemAttribute(item, this.#owner, this.#parent, this);

		this.#children[index] = itemAttribute;

		this.#owner && this.#owner.dispatchEvent(new CollectionDataAttributeChangeEvent(this.#parent, itemAttribute));

		return this;
	}

	find(predicate: (item: TreeItemAttribute, index: number, obj: any[]) => boolean): TreeItemAttribute | undefined {
		return this.#children.find(predicate);
	}

	[Symbol.iterator] = () => {

    let count = 0;
    let done = false;

    let next = () => {
			let value: TreeItemAttribute = {} as TreeItemAttribute;
       if(count >= this.#children.length) {
          done = true;
       } else {
				 	value = this.#children[count++];
				}

       return { done, value };
    }

    return { next };
  }

	forEach(iteratee: (value: TreeItemAttribute, index: number) => boolean | void): void {
		let index = 0;
		for(let item of this) {
			if(iteratee(item, index++) === false) {
				break;
			};
		}
	}
}

export interface TreeAttributeOptions {
	initValue: TreeItem[];
}

export default class TreeAttribute extends DataAttributeBase {
	#children: TreeItemAttribute[] = [];

	constructor({ initValue }: TreeAttributeOptions, owner?: IView, parent?: DataAttribute) {
		super(owner, parent);

		if(initValue) {
			this.#children = initValue.map(item => new TreeItemAttribute(item, owner, this, undefined));
		}
	}

	get value(): TreeAttribute {
		return this;
	}

	getItem(index: number) {
		return this.#children[index];
	}

	addItem(item: TreeItem): TreeAttribute {
		const itemAttribute = new TreeItemAttribute(item, this.owner, this, undefined);
		this.#children.push(itemAttribute);

		this.dispatchEvent(new CollectionDataAttributeChangeEvent(this, itemAttribute));
		
		return this;
	}

	load(items: TreeItem[]): TreeAttribute {
		this.#children = items.map(item => new TreeItemAttribute(item, this.owner, this, undefined));

		this.dispatchEvent(new CollectionDataAttributeLoadEvent(this, this));

		return this;
	}

	removeByIndex(index: number): TreeAttribute {
		const itemAttribute = this.#children[index];

		this.#children.splice(index, 1);

		this.dispatchEvent(new CollectionDataAttributeChangeEvent(this, itemAttribute));

		return this;
	}

	remove(item: TreeItemAttribute): TreeAttribute {
		const index = this.#children.indexOf(item);
		if(index > -1) {
			this.#children.splice(index, 1);
		}

		this.dispatchEvent(new CollectionDataAttributeChangeEvent(this, item));

		return this;
	}

	insert(item: TreeItem, index: number): TreeAttribute {
		const itemAttribute = new TreeItemAttribute(item, this.owner, this, undefined);
		
		this.#children.splice(index, 0, itemAttribute);

		this.dispatchEvent(new CollectionDataAttributeChangeEvent(this, itemAttribute));

		return this;
	}

	set(index: number, item: TreeItem): TreeAttribute {
		const itemAttribute = new TreeItemAttribute(item, this.owner, this, undefined);

		this.#children[index] = itemAttribute;

		this.dispatchEvent(new CollectionDataAttributeChangeEvent(this, itemAttribute));

		return this;
	}

	find(predicate: (item: TreeItemAttribute, index: number, obj: any[]) => boolean): TreeItemAttribute | undefined {
		return this.#children.find(predicate);
	}

	[Symbol.iterator] = () => {

    let count = 0;
    let done = false;

    let next = () => {
			let value: TreeItemAttribute = {} as TreeItemAttribute;
       if(count >= this.#children.length) {
          done = true;
       } else {
				 	value = this.#children[count++];
				}

       return { done, value };
    }

    return { next };
  }

	forEach(iteratee: (value: TreeItemAttribute, index: number) => boolean | void): void {
		let index = 0;
		for(let item of this) {
			if(iteratee(item, index++) === false) {
				break;
			};
		}
	}
}

export class TreeDataAttributeChangeEvent<T> extends Event {
	constructor(public initiator: DataAttribute, public data: T, public element: IComponent) {
		super('expand');
	}
}