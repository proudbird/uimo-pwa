import { 
	CustomElementProps,
	ElementDescription, 
	ElementPropertyDataSource, 
	ElementPropertyHandler, 
	ElementProps, 
	ICustomElement, 
	IDataAttribute 
} from "@/types";

export default class PropertyManager<D extends ElementDescription> extends EventTarget implements CustomElementProps<any> {
	#values: Record<string, any>;

	constructor(element: ICustomElement, description: D, inputProps: ElementProps) {
		super();
		this.#values = {};

		Object.entries(description.props || {}).map(([propName, prop]) => {
			let defaultValue = prop?.defaultValue;
			let definedProp = inputProps[propName as keyof ElementProps];
			if(definedProp) {
				if(typeof definedProp === 'string') {
					defaultValue = definedProp;
				} else if((definedProp as IDataAttribute).DataAttribute) {
					defaultValue = (definedProp as IDataAttribute).value;
				} else if(typeof definedProp === 'object' && (definedProp as ElementPropertyHandler).handler) {
					defaultValue = (definedProp as ElementPropertyHandler).handler!.apply(element, [element.context]);
				} else if(typeof definedProp === 'object' && (definedProp as ElementPropertyDataSource).path) {
					let dataProvider = element.context;
					const attr = dataProvider[(definedProp as ElementPropertyDataSource).path] as IDataAttribute;
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
