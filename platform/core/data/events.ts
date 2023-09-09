import { DataAttribute } from './state';

export class DataAttributeChangeEvent<T> extends Event {
	constructor(public initiator: DataAttribute, public newValue?: T, public prevValue?: T) {
		super('change');
	}
}
