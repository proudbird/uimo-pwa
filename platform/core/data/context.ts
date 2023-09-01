import dataAttributeConstructors from'@/core/data/constructors';

export default class Context implements IDataContext {
  readonly [name: string]: IDataAttributeBase & IDataAttribute;

	constructor(definition: DataDefinition | StateDefinition, initData?: Record<string, any>) {
		for(const [attrName, attr] of Object.entries(definition)) {
      const options = attr;
			if(initData) {
				options.initValue = initData[attrName];
			}
			let dataAttribute: IDataAttribute;
			if(attr.link) {
				dataAttribute = attr.link;
			} else {
				const Constructor = dataAttributeConstructors[attr.type as StateValueType];
				dataAttribute = new Constructor(options as any);
			}
			Object.defineProperty(this, attrName, {
				value: dataAttribute,
				writable: false,
			});
		}
	}
}
