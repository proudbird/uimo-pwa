/**
 * The base class to define different Data Attribute classes
 */
export default class DataAttributeBase extends EventTarget {
	get isIterable(): boolean {
		return this.hasOwnProperty(Symbol.iterator);
	}

	readonly DataAttribute = true;
}
