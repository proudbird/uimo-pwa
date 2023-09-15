import { IMonoDataAttribute } from '..';
import { DataAttributeValue, DataAttribute } from '../state';

export default class DataAttributeChangeEvent extends Event {
	public initiator: DataAttribute;
	public initiatorId: string;
	public prevValue: DataAttributeValue;
	public newValue: DataAttributeValue;

	constructor(initiator: DataAttribute, initiatorId: string) {
		super('change');
		this.initiator = initiator;
		this.initiatorId = initiatorId;
		this.newValue = (initiator as IMonoDataAttribute).value;
		this.prevValue = (initiator as IMonoDataAttribute).value;
	}
}
