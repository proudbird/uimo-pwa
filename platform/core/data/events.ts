import { IPolyDataAttributeEvent, PolyDataAttributeChangeEventType, PolyDataAttributeChangeOptions } from '.';
import InstanceAttribute from './attribute/instance';
import { DataAttribute } from './state';

export class DataAttributeChangeEvent<T = any> extends Event {
	constructor(public initiator: DataAttribute, public newValue?: T, public prevValue?: T) {
		super('change');
	}
}

export class CollectionDataAttributeChangeEvent<T> extends Event {
	constructor(public initiator: DataAttribute, public data: T, public page?: number) {
		super('change');
	}
}

export class CollectionDataAttributeClearEvent<T> extends Event {
	constructor(public initiator: DataAttribute) {
		super('clear');
	}
}

export class CollectionDataAttributeUpdateEvent extends Event {
	constructor(public initiator: DataAttribute, public instance: InstanceAttribute) {
		super('update');
	}
}
export class PolyDataAttributeChangeEvent<T> extends Event implements IPolyDataAttributeEvent {
	initiator: DataAttribute;
	collection: any;
	item: any;
	event: PolyDataAttributeChangeEventType;

	constructor({ initiator, collection, item, event }: PolyDataAttributeChangeOptions<T>) {
		super('change');

		this.initiator = initiator;
		this.collection = collection;
		this.item = item;
		this.event = event;
	}
}
