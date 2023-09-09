import DataAttributeBase from './dataAttribute';
import { DataAttributeChangeEvent } from '../events';

export interface Reference  {
	id: string;
	model: string;
	presentation: string;
}

export type ReferenceAttributeOptions = {
  readonly initValue?: Reference | null;
};

export default class ReferenceAttribute extends DataAttributeBase {
	#value: Reference | null;
	#prevValue: Reference | null;

	constructor({ initValue = null }: ReferenceAttributeOptions) {
		super();
		this.#value = this.#prevValue = initValue;
	}
  
	get value(): Reference | null {
		return this.#value;
	}

	set value(value: Reference) {
		this.#prevValue = this.#value;
		this.#value = value;

		this.dispatchEvent(new DataAttributeChangeEvent(this, this.#value, this.#prevValue));
	}
}
