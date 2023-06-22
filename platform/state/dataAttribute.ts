import { DataAttributeValue, IDataAttribute } from '../types';

export default class DataAttribute<T extends DataAttributeValue> extends EventTarget implements IDataAttribute {
	private _value: T;

	constructor(initValue?: T) {
		super();
		this._value = initValue as T;
	}
  
	get value() {
		return this._value;
	}

	set value(value: T) {
		this._value = value;

		this.dispatchEvent(new CustomEvent('change', { detail: {
			value: value
		} }));
	}
}
