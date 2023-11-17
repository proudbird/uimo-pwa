import { IView } from '@/core/types';
import { IComponent } from '@/core/types';

import DataAttributeBase from './dataAttribute';
import { DataAttributeChangeEvent } from '../events';
import { DataAttribute } from '../state';

export default class ElementAttribute extends DataAttributeBase {
	#value: IComponent | null;
	#prevValue: IComponent | null;

	constructor({ initValue = null }, owner: IView, parent?: DataAttribute) {
		super(owner, parent);
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
