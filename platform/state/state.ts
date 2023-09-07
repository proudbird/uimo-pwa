import DataAttributeChangeEvent from './event';
import dataAttributeConstructors from'@/core/data/constructors';
import { DataDefinition, ICustomElement, IDataAttribute, IState, StateDefinition, StateValueType } from '@/types';

export default class State extends EventTarget {
	constructor(owner: ICustomElement, definition: DataDefinition | StateDefinition | IDataAttribute = {}, initData?: Record<string, any>) {
		super();

		for(let [attrName, attr] of Object.entries(definition)) {
			const options = attr;
			if(!attr.DataAttribute) {
				if(initData) {
					options.initValue = initData[attrName];
				} else {
					options.initValue = attr.defaultValue;
				}
				const Constructor = dataAttributeConstructors[attr.type as StateValueType];
				attr = new Constructor(options as any);
				Object.defineProperty(this, attrName, {
					value: attr,
					writable: false,
					enumerable: true,
				});
			}

			owner.observe(attr, () => {
				owner.dispatchEvent(new DataAttributeChangeEvent(attr, attrName));
			});
		}
	}

}

export function createStateFabric(owner: ICustomElement, definition: DataDefinition | StateDefinition, initData?: Record<string, any>) {
	return new State(owner, definition, initData);
}

export const createState = createStateFabric as unknown as (
  (owner: ICustomElement, definition: DataDefinition | StateDefinition | undefined, initData?: Record<string, any>) => IState
);