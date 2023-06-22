import { DataAttributeValue, IDataAttribute } from '../types';
import DataAttributeChangeEvent from './event';
import { BaseClass } from '../ui/core/base';

export interface IStateDefintion {
  [key: string]: IDataAttribute;
}

export default class State extends EventTarget {
	constructor(owner: BaseClass, definition: IStateDefintion) {
		super();

		for(const [attrName, attr] of Object.entries(definition)) {
			Object.defineProperty(owner, attrName, {
				get: () => attr.value,
				set: (value: DataAttributeValue) => attr.value = value
			});
			owner.observe(attr, () => {
				this.dispatchEvent(new DataAttributeChangeEvent(attr, attrName));
			});
		}
	}
}