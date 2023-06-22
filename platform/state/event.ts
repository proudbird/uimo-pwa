import { DataAttributeValue, IDataAttribute } from '../types';

export default class DataAttributeChangeEvent extends Event {
	public initiator: IDataAttribute;
	public initiatorId: string;
	public prevValue: DataAttributeValue;
	public newValue: DataAttributeValue;

	constructor(initiator: IDataAttribute, initiatorId: string) {
		super('change');
		this.initiator = initiator;
		this.initiatorId = initiatorId;
		this.newValue = initiator.value;
	}
}