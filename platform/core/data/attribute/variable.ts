
import { IView } from '@/core/types';

import { DataAttribute } from '../state';
import DataAttributeBase from './dataAttribute';

export default class VariableAttribute extends DataAttributeBase {
	#value: any;

	constructor(value: any, owner: IView, parent?: DataAttribute) {
		super(owner, parent);

		this.#value = value;
	}
  
	get value(): null {
		return this.#value;
	}

	set value(value: any) {
		this.#value = value;
	}
}
