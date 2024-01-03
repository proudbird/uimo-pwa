import { IView } from '@/core/types';

import DataAttributeBase from './dataAttribute';
import { DataAttributeChangeEvent } from '../events';
import { DateAttributeFormat, DateAttributeInitValue, DateAttributeOptions } from './types';
import { DataAttribute } from '../state';

/**
 * Manages a Date value and notifies consumers about any changes to that value
 */
export default class DateAttribute extends DataAttributeBase {
	#value: Date;
	#prevValue: Date;
	#initValue?: DateAttributeInitValue;

	public readonly format?: DateAttributeFormat;

	/**
   * Constructs a new DateAttribute instance.
   * @param {DateAttributeOptions} options - The options to configure the DateAttribute.
   * @param {DateAttributeInitValue} options.initValue - The initial value of the DateAttribute. Defaults to DateAttributeInitValue.TODAY.
   * @param {DateAttributeFormat} options.format - The format of the DateAttribute value. Defaults to DateAttributeFormat.DATETIME.
   */
	constructor({ initValue = DateAttributeInitValue.TODAY, format = DateAttributeFormat.DATETIME }: DateAttributeOptions, owner?: IView, parent?: DataAttribute) {
		super(owner, parent);
		this.#initValue = initValue;
		this.#value = this.#prevValue = this.#getInitValue();
		this.format = format;
	}
  
	get value(): Date {
		return this.#value;
	}

	set value(value: Date) {
		this.#prevValue = this.#value;
		this.#value = this.#format(value);

		this.dispatchEvent(new DataAttributeChangeEvent(this, this.#value, this.#prevValue));
	}

	#format(value: Date): Date {
		if (this.format === DateAttributeFormat.DATE) {
			const dateValue = new Date(value);
			dateValue.setHours(0, 0, 0, 0);
			return dateValue;
		} else {
			return value;
		}
	}

  #getInitValue(): Date {
    switch (this.#initValue) {
			case DateAttributeInitValue.TODAY:
				return new Date();
			case DateAttributeInitValue.START_OF_WEEK: {
				const now = new Date();
				const startOfWeek = now.getDate() - now.getDay() + 1;
				return new Date(now.setDate(startOfWeek));
			}
			case DateAttributeInitValue.START_OF_MONTH: {
				const now = new Date();
				return new Date(now.getFullYear(), now.getMonth(), 1);
			}
			case DateAttributeInitValue.START_OF_YEAR: {
				const now = new Date();
				return new Date(now.getFullYear(), 0, 1);
			}
			case DateAttributeInitValue.END_OF_WEEK: {
				const now = new Date();
				const endOfWeek = now.getDate() + (6 - now.getDay());
				return new Date(now.setDate(endOfWeek));
			}
			case DateAttributeInitValue.END_OF_MONTH: {
				const now = new Date();
				const nextMonth = now.getMonth() + 1;
				return new Date(now.getFullYear(), nextMonth, 0);
			}
			case DateAttributeInitValue.END_OF_YEAR: {
				const now = new Date();
				return new Date(now.getFullYear(), 11, 31);
			}
			default:
				return new Date();
		}
  }
}
