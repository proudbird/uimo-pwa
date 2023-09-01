import DataAttributeChangeEvent from './event';
import { BaseClass } from '../ui/core/base';
import dataAttributeConstructors from'@/core/data/constructors';


export interface IStateDefintion {
  [key: string]: IDataAttribute;
}

export default class State extends EventTarget {
	constructor(owner: BaseClass, definition: DataDefinition | StateDefinition, initData?: Record<string, any>) {
		super();

		for(const [attrName, attr] of Object.entries(definition)) {
			const options = attr;
			if(initData) {
				options.initValue = initData[attrName];
			}
			let dataAttribute: IDataAttribute;
			const Constructor = dataAttributeConstructors[attr.type as StateValueType];
			dataAttribute = new Constructor(options as any);
			Object.defineProperty(this, attrName, {
				value: dataAttribute,
				writable: false,
			});

			owner.observe(dataAttribute, () => {
				owner.dispatchEvent(new DataAttributeChangeEvent(dataAttribute, attrName));
			});
		}
	}
}
