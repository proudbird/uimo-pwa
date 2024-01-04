import { IMonoDataAttribute } from '.';
import { 
	ComponentProps,
	ComponentSpecification,
	IComponent,
	PropDataSourceDefinition,
	PropDefinitions,
	PropHandlerDefinition,
	ViewModule,
} from '../types';
import { executeMethod } from '@/core/fabric';

import { DataAttribute } from './state';

export default class PropertyManager<D extends ComponentSpecification> extends EventTarget implements ComponentProps<any> {
	#values: Record<string, any>;

	constructor(element: IComponent, module: ViewModule | undefined, description: D, inputProps: PropDefinitions) {
		super();
		this.#values = {};

		Object.entries(description.props || {}).map(([propName, prop]) => {
			let definedProp = inputProps[propName as keyof PropDefinitions];
			let defaultValue = definedProp || prop?.defaultValue;
			if(definedProp) {
				if(definedProp) {
					if((definedProp as DataAttribute).DataAttribute) {
						defaultValue = (definedProp as IMonoDataAttribute).value;
					} else if(typeof definedProp === 'object' && (definedProp as PropHandlerDefinition).handler) {
						defaultValue = executeMethod(
							(definedProp as PropHandlerDefinition),
							element.owner,
							[element]);
					} else if(typeof definedProp === 'object' && (definedProp as PropDataSourceDefinition).path) {
						let dataProvider = element.context;
						const attr = dataProvider[(definedProp as PropDataSourceDefinition).path] as IMonoDataAttribute;
						defaultValue = attr.value;
					}
				} else if(typeof definedProp === 'object' && (definedProp as PropDataSourceDefinition).path) {
					let dataProvider = element.context;
					const attr = dataProvider[(definedProp as PropDataSourceDefinition).path] as IMonoDataAttribute;
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
						(this.#values[propName] as IMonoDataAttribute).value = value;
					} else {
						this.#values[propName] = value;
					}
					this.dispatchEvent(new CustomEvent(propName, { detail: { value }}));
				}
			});
		});
	}
}
