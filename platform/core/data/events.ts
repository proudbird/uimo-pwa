export class DataAttributeChangeEvent<T> extends Event {
	constructor(public initiator: IDataAttribute, public newValue: T, public prevValue: T) {
		super('change');
	}
}
