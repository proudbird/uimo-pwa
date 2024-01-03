import { IView } from '@/core/types';
import { BooleanAttributeOptions } from './types';

import { DataAttribute } from '../state';
import DataAttributeBase from './dataAttribute';
import { DataAttributeChangeEvent } from '../events';

/**
 * Manages a boolean value and notifies consumers about any changes to that value
 */
export default class BooleanAttribute extends DataAttributeBase {
	#value: boolean;
	#prevValue: boolean;

	/**
   * @param {BooleanAttributeOptions} options - The options for initializing the BooleanAttribute.
   * @param {boolean} options.initValue - The initial value for the BooleanAttribute. Default to false.
   */
	constructor({ initValue = false }: BooleanAttributeOptions, owner?: IView, parent?: DataAttribute) {
		super(owner, parent);
		this.#value = this.#prevValue = initValue;
	}
  
	get value(): boolean {
		return this.#value;
	}

	set value(value: boolean) {
		this.#prevValue = this.#value;
		this.#value = value;

		this.dispatchEvent(new DataAttributeChangeEvent(this, this.#value, this.#prevValue));
	}
}
