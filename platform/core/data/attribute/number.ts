import { IView } from '@/core/types';

import DataAttributeBase from './dataAttribute';
import { DataAttributeChangeEvent } from '../events';
import { ValueError } from '../errors';
import { NumberAttributeOptions } from './types';
import { DataAttribute } from '../state';

/**
 * Manages a number value and notifies consumers about any changes to that value
 */
export default class NumberAttribute extends DataAttributeBase {
	#value: number;
	#prevValue: number;

	public readonly maxLength: number;
	public readonly precision: number;
	public readonly truncate: boolean;
	public readonly round: false | 'up' | 'down';

	/**
   * Constructs a new NumberAttribute instance.
   * @param {NumberAttributeOptions} options - The options to configure the NumberAttribute.
   * @param {number} options.initValue - The initial value of the NumberAttribute. Defaults to 0.
   * @param {number} options.maxLength - The maximum total length of the number. Defaults to 0.
   * @param {number} options.precision - The maximum number of decimal places (precision). Defaults to 0.
   * @param {boolean} options.truncate - Specifies whether to truncate the value if it exceeds the maximum length. Defaults to true.
   * @param {false | 'up' | 'down'} options.round - The rounding behavior when the value exceeds the precision limit. Defaults to 'up'.
   */
	constructor({ 
		initValue = 0, 
		maxLength = 16, 
		precision = 0,
		truncate = true,
		round = 'up',
	}: NumberAttributeOptions, owner: IView, parent?: DataAttribute) {
		super(owner, parent);
		this.#value = this.#prevValue = initValue;
		this.maxLength = maxLength;
		this.precision = precision;
		this.truncate = truncate;
		this.round = round;
	}
  
	get value(): number {
		return this.#value;
	}

	set value(value: number) {
		const roundedValue = this.#roundToPrecision(value, this.precision);
		const valueStr = roundedValue.toString();
		const [integerPart, decimalPart = ''] = valueStr.split('.');

		if (
			integerPart.length + decimalPart.length <= this.maxLength &&
			decimalPart.length <= this.precision
		) {
			this.#value = roundedValue;
		} else if (this.maxLength >= 1 && this.precision >= 0) {
			if (decimalPart.length > this.precision && this.round === false) {
				throw new ValueError(`Value exceeds maximum precision of ${this.precision}`);
			}

			const maxLengthWithoutDecimal = this.maxLength - (this.precision > 0 ? this.precision + 1 : 0);
			const truncatedValueStr = valueStr.slice(0, maxLengthWithoutDecimal);
			const truncatedValue = parseFloat(truncatedValueStr);

			if (truncatedValue > 0) {
				const scaleFactor = Math.pow(10, this.precision);
				const maxValue = Math.floor(scaleFactor * (Math.pow(10, maxLengthWithoutDecimal) - 1)) / scaleFactor;
				const roundedMaxValue = this.#roundToPrecision(maxValue, this.precision);

				if (this.round === false) {
					this.#value = Math.min(truncatedValue, roundedMaxValue);
				} else if (this.round === 'down') {
					this.#value = Math.floor(truncatedValue);
				} else if (this.round === 'up') {
					this.#value = Math.ceil(truncatedValue);
				} else {
					throw new ValueError(`Invalid rounding value: ${this.round}`);
				}
			} else {
				this.#value = 0;
			}
		} else {
			throw new ValueError(`Invalid maximum length (${this.maxLength}) or maximum precision (${this.precision})`);
		}

		this.#prevValue = this.#value;

		this.dispatchEvent(new DataAttributeChangeEvent(this, this.#value, this.#prevValue));
	}

	#roundToPrecision(value: number | string, precision: number): number {
    const multiplier = Math.pow(10, precision);
    return Math.round(parseFloat(value as string) * multiplier) / multiplier;
  }
}
