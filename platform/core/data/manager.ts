import { 
	CustomElementProps,
	ElementDescription, 
	ElementPropertyDataSource, 
	ElementPropertyHandler, 
	ElementProps, 
	ICustomElement, 
} from '@/types';

import { DataAttribute } from './state';

export default class PropertyManager<D extends ElementDescription> extends EventTarget implements CustomElementProps<any> {
	#values: Record<string, any>;

	constructor(element: ICustomElement, description: D, inputProps: ElementProps) {
		super();
		this.#values = {};

		Object.entries(description.props || {}).map(([propName, prop]) => {
			let definedProp = inputProps[propName as keyof ElementProps];
			let defaultValue = definedProp || prop?.defaultValue;
			if(definedProp) {
				if((definedProp as DataAttribute).DataAttribute) {
					defaultValue = (definedProp as DataAttribute).value;
				} else if(typeof definedProp === 'object' && (definedProp as ElementPropertyHandler).handler) {
					defaultValue = (definedProp as ElementPropertyHandler).handler!.apply(element, [element.context]);
				} else if(typeof definedProp === 'object' && (definedProp as ElementPropertyDataSource).path) {
					let dataProvider = element.context;
					const attr = dataProvider[(definedProp as ElementPropertyDataSource).path] as DataAttribute;
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
						(this.#values[propName] as DataAttribute).value = value;
					} else {
						this.#values[propName] = value;
					}
					this.dispatchEvent(new CustomEvent(propName, { detail: { value }}));
				}
			});
		});
	}
}
