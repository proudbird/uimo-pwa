
import { IView } from '@/core/types';

import { DataAttribute } from '../state';
import DataAttributeBase from './dataAttribute';

export default class UnknownAttribute extends DataAttributeBase {
	constructor(public name: string, owner?: IView, parent?: DataAttribute) {
		super(owner, parent);
	}
  
	get value(): null {
		return null;
	}
}
