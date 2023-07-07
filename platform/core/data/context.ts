import dataAttributeConstructors from'@/core/data/constructors';

export default class Context implements IDataContext {
  readonly [name: string]: IDataAttributeBase & IDataAttribute;

	constructor(definition: DataDefinition) {
		for(const [attrName, attr] of Object.entries(definition)) {
      const options = attr;
			const Constructor = dataAttributeConstructors[attr.type];
      const dataAttribute = new Constructor(options as any);
			Object.defineProperty(this, attrName, {
				value: dataAttribute,
				writable: false,
			});
		}
	}
}
