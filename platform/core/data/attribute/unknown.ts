
import { DataAttribute } from '../state';
import DataAttributeBase from './dataAttribute';

export default class UnknownAttribute extends DataAttributeBase {
	constructor(public name: string, parent?: DataAttribute) {
		super(parent);
	}
  
	get value(): null {
		return null;
	}
}
