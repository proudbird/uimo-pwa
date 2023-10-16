import DataAttributeBase from './dataAttribute';
import { DataAttributeChangeEvent } from '../events';
import { IComponent } from '@/core/types';

export default class ElementAttribute extends DataAttributeBase {
	#value: IComponent | null;
	#prevValue: IComponent | null;

	constructor({ initValue = null }) {
		super();
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
