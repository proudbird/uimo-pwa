import DataAttributeBase from './dataAttribute';
import { DataAttributeChangeEvent } from '../events';
import { IComponent } from '@/core/types';
import { DataAttribute } from '../state';

export default class ElementAttribute extends DataAttributeBase {
	#value: IComponent | null;
	#prevValue: IComponent | null;

	constructor({ initValue = null }, parent?: DataAttribute) {
		super(parent);
		this.#value = this.#prevValue = initValue;
	}
  
	get value(): IComponent | null {
		return this.#value;
	}

	set value(value: IComponent | null) {
		this.#prevValue = this.#value;
		this.#value = value;

		this.dispatchEvent(new DataAttributeChangeEvent(this, this.#value, this.#prevValue));
	}
}
