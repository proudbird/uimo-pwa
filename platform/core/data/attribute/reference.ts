import DataAttributeBase from './dataAttribute';
import { DataAttributeChangeEvent } from '../events';
import Reference from '../../objects/reference';
import { DataAttribute } from '../state';

export type ReferenceAttributeProps = {
  readonly initValue?: Reference | null;
};

export default class ReferenceAttribute extends DataAttributeBase {
	#value: Reference | null;
	#prevValue: Reference | null;

	constructor({ initValue = null }: ReferenceAttributeProps, parent?: DataAttribute) {
		super(parent);
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
