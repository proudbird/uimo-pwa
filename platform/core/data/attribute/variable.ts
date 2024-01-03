
import { IView } from '@/core/types';

import { DataAttribute } from '../state';
import DataAttributeBase from './dataAttribute';
import { DataAttributeChangeEvent } from '../events';

export interface VariableAttributeOptions {
	initValue?: any;
	inScope?: boolean;
}

export default class VariableAttribute extends DataAttributeBase {
	#value: any;
	#prevValue: any = undefined;

	constructor({ initValue, inScope }: VariableAttributeOptions, owner?: IView, parent?: DataAttribute) {
		super(owner, parent, inScope);

		this.#value = initValue;
	}
  
	get value(): null {
		return this.#value;
	}

	set value(value: any) {
		this.#prevValue = this.#value;
		this.#value = value;

		this.dispatchEvent(new DataAttributeChangeEvent(this, this.#value, this.#prevValue));
	}
}
