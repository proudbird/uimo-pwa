/**
 * The base class to define different Data Attribute classes
 */
export default class DataAttributeBase extends EventTarget {
	/**
	 * Indicates that the current object is a Data Attribute
	 */
	readonly DataAttribute = true;

	/**
	 * Indicates that the current object is an iterable Data Attribute
	 */
	get isIterable(): boolean {
		return this.hasOwnProperty(Symbol.iterator);
	}

}
