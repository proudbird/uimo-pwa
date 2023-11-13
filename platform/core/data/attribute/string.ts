import DataAttributeBase from './dataAttribute';
import { DataAttributeChangeEvent } from '../events';
import { ValueError } from '../errors';
import { StringAttributeOptions } from './types';
import { DataAttribute } from '../state';

/**
 * Manages a string value and notifies consumers about any changes to that value
 */
export default class StringAttribute extends DataAttributeBase {
	#value: string;
	#prevValue: string;

	public readonly maxLength: number;
	public readonly truncate: boolean;

	/**
   * @param {StringAttributeOptions} options - The options for initializing the StringAttribute.
   * @param {string} options.initValue - The initial value for the StringAttribute. Default is an empty string.
   * @param {number} options.maxLength - The maximum length allowed for the string value. Default is 0 (unlimited).
   * @param {boolean} options.truncate - Specifies whether the value should be truncated if it exceeds the maximum length. Default is true.
   * @throws {ValueError} If the value exceeds the maximum length and truncate is set to false.
   */
	constructor({ initValue = '', maxLength = 0, truncate = true }: StringAttributeOptions, parent?: DataAttribute) {
		super(parent);
		this.#value = this.#prevValue = initValue;
		this.maxLength = maxLength;
		this.truncate = truncate;
	}
  
	get value(): string {
		return this.#value;
	}

	set value(value: string) {
		this.#prevValue = this.#value;

		if (this.maxLength === 0 || (this.maxLength > 0 && value.length <= this.maxLength)) {
      this.#value = value;
    } else if(this.truncate) {
			this.#value = value.slice(0, this.maxLength);
		} else {
      throw new ValueError(`Value exceeds maximum length of ${this.maxLength}`);
    }

		this.dispatchEvent(new DataAttributeChangeEvent(this, this.#value, this.#prevValue));
	}
}
