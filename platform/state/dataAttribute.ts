import { DataAttributeValue, IDataAttribute } from '../types';

export default class DataAttribute<T extends DataAttributeValue> extends EventTarget implements IDataAttribute {
	#value: T;

	constructor(initValue?: T) {
		super();
		this.#value = initValue as T;
	}
  
	get value() {
		return this.#value;
	}

	set value(value: T) {
		this.#value = value;

		this.dispatchEvent(new CustomEvent('change', { detail: {
			value: value
		} }));
	}
}
