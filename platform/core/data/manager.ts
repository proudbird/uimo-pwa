import DataAttribute from "./dataAttribute";
import { DataAttributeChangeEvent } from "./events";
import { ValueError } from "./errors";
import { ElementDefinition } from "../../types";
import { BaseClass, CustomElementData } from "../../ui/core/base";

export default class PropertyManager<D extends ElementDefinition> extends EventTarget {
	#values: Record<string, any>;

	constructor(element: BaseClass, description: D, props: ElementProp, data: CustomElementData) {
		super();
		this.#values = {};

		Object.entries(description.props || {}).map(([propName, prop]) => {
			let defaultValue = prop.defaultValue;
			let definedProp = props[propName as keyof ElementProp];
			if(definedProp) {
				if(typeof definedProp === 'string') {
					defaultValue = definedProp;
				} else if((definedProp as IDataAttribute).DataAttribute) {
					defaultValue = (definedProp as IDataAttribute).value;
				} else if(typeof definedProp === 'object' && (definedProp as ElementPropertyHandler).handler) {
					defaultValue = (definedProp as ElementPropertyHandler).handler!.apply(element, [data.context]);
				} else if(typeof definedProp === 'object' && (definedProp as ElementPropertyDataSource).dataPath) {
					let dataProvider = data.context;
					const attr = dataProvider[(definedProp as ElementPropertyDataSource).dataPath] as IDataAttribute;
					defaultValue = attr.value;
				}
			}

			this.#values[propName] = defaultValue;
			Object.defineProperty(this, propName, { 
				enumerable: true,
				get: () => {
					if(this.#values[propName]?.DataAttribute) {
						return (this.#values[propName]).value;
					} else {
						return this.#values[propName];
					}
				},
				set: (value: any) => {
					if(this.#values[propName]?.DataAttribute) {
						(this.#values[propName] as IDataAttribute).value = value;
					} else {
						this.#values[propName] = value;
					}
					this.dispatchEvent(new CustomEvent(propName, { detail: { value }}));
				}
			});
		});
	}
}
