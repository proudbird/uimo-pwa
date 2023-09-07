
import { 
	ChildElementDefinition,
	CustomElementOptions,
	DataAttributeSetter,
	DataAttributeValue, 
	ElementEventHandler, 
	ElementProp, 
	ElementPropertyDataSource, 
	ElementPropertyHandler, 
	ICustomElement, 
	IDataAttribute, 
	IState, 
	StyleProperties, 
	ViewModule 
} from '@/types';

export function setObservation(element: ICustomElement, prop: ElementProp, data: IState, setter?: DataAttributeSetter): void {
	if(!(prop)) return;

	if(typeof prop === 'string') {
		setter && setter(prop);
	} else if((prop as IDataAttribute).DataAttribute) {
		setter && setter((prop as IDataAttribute).value);
		element.observe((prop as IDataAttribute), () => setter && setter((prop as IDataAttribute).value));
	} else if(typeof prop === 'object' && (prop as ElementPropertyHandler).handler) {
		setter && setter((prop as ElementPropertyHandler).handler!(data));
		if((prop as ElementPropertyHandler).dependencies?.length) {
			for(const dep of (prop as ElementPropertyHandler).dependencies!) {
				element.observe(dep, () => setter && setter((prop as ElementPropertyHandler).handler!(data)));
			}
		} else {
			element.addEventListener('change', () => setter && setter((prop as ElementPropertyHandler).handler!(data)));
			// element.addEventListener('input', () => setter((prop as ElementPropertyHandler).handler!(data.parent.state)));
		}
	}  else if(typeof prop === 'object' && (prop as ElementPropertyDataSource).path) {
		prop = prop as ElementPropertyDataSource;
		let dataProvider = data;
		const attr = dataProvider[prop.path] as IDataAttribute;
		setter && setter(attr.value);
		element.observe(attr, () => setter && setter(attr.value));
	}
}

export function getPropValue(prop: ElementProp, state: IState): DataAttributeValue {
	if(!(prop || state)) return;

	if(typeof prop === 'string') {
		return prop;
	} else if((prop as IDataAttribute).DataAttribute) {
		return (prop as IDataAttribute).value;
	} else if(typeof prop === 'object' && (prop as ElementPropertyHandler).handler) {
		return (prop as ElementPropertyHandler).handler!(state);
	}
}

export function createElement({ parent, config, context, module }: BuildElementOptions): ICustomElement | HTMLElement | SVGSVGElement {
	// first trying to create custom element
	if(config.type !== 'native') {
		const Constructor = customElements.get(/(\@|ui\-)/.test(config.tagName) ? config.tagName.replace('@', 'uimo-').replace('ui-', 'uimo-') : `uimo-${config.tagName}`);
		if(Constructor) {
			return new Constructor({ owner: parent.owner, parent, config, context, module } as CustomElementOptions) as ICustomElement;
		}
	}

	// creating build-in element 
	if(config.tagName === 'svg') {
		return document.createElementNS('http://www.w3.org/2000/svg', 'svg') as SVGSVGElement;
	} else {
		return document.createElement(config.tagName) as HTMLElement;
	}
}

export type BuildElementOptions = {
	parent: ICustomElement;
	config: ChildElementDefinition;
	context?: IState;
	module?: ViewModule;
};

export function buildElement({ parent, config, context, module }: BuildElementOptions): ICustomElement | HTMLElement | SVGSVGElement {
	const element = createElement({ parent, config, context, module });
	if((element as ICustomElement).isCustom) {
		return element;
	}

	config.id && element.setAttribute('id', config.id);

	if(config.className) {
		const prop = config.className;
		const setter = (value: DataAttributeValue) => element.setAttribute('class', value as string); 
		if((element as ICustomElement).isCustom) {
			setObservation(element as ICustomElement, prop, parent.state, setter);
		} else {
			setObservation(parent, prop, parent.state, setter);
		}
	}

	Object.entries(config.attributes || {}).map(([name, prop]) => {
		const setter = (value: DataAttributeValue) => {
			element.setAttribute(name, value as string); 
		};
		if((element as ICustomElement).isCustom) {
			setObservation(element as ICustomElement, prop!, parent.state, setter);
		} else {
			setObservation(parent, prop!, parent.state, setter);
		}
	});

	Object.entries(config.props || {}).map(([name, prop]) => {
		const setter = (value: DataAttributeValue) => {
			//@ts-ignore
			element[name] = value; 
		};
		if((element as ICustomElement).isCustom) {
			setObservation(element as ICustomElement, prop!, parent.state, setter);
			// Object.defineProperty(element as CustomElement, name, {
			//   get: () => getPropValue(prop, state),
			//   set: (newProp) => setObservation(element as CustomElement, newProp, state, () => {})
			// });
		} else {
			setObservation(parent, prop!, parent.state, setter);
		}
	});

	for(const styleName in config.style) {
		const prop = config.style[styleName as StyleProperties];
		const setter = (value: DataAttributeValue) => element.style[styleName as StyleProperties] = value as any; 
		if((element as ICustomElement).isCustom) {
			setObservation(element as ICustomElement, prop!, parent.state, setter);
		} else {
			setObservation(parent, prop!, parent.state, setter);
		}
	}

	Object.entries(config.events || {}).map(([name, event]) => {
		element.addEventListener(name, (e: Event) => {
			if(typeof event === 'string') {
				if(!module) {
					throw new Error(`Can't get handler '${event}' for element '${config.tagName}': View module is not defined`);
				}
				const handler = module[event as keyof ICustomElement] as ElementEventHandler;
				if(handler) {
					handler.call(parent.owner, e);
				} else {
					throw new Error(`Element doesn't have a function ${event}`);
				}
			} else if(typeof event === 'function') {
				event.call(parent.owner, e);
			} else {
				throw new Error(`Wrong object was defined as event handler. Only 'string' or 'function' are allowed. Type '${typeof event}' was provided.`);
			}
		});
	});

	if(config.children) {
		if(typeof config.children === 'string') {
			element.innerHTML = config.children;
		} else {
			for(const childConfig of config.children) {
				console.log(childConfig);
				if(typeof childConfig === 'string') {
					console.log(childConfig);
					element.innerHTML = childConfig;
					continue;
				}
				if(childConfig.type === 'slot') continue;
				const child = buildElement({ parent, config: childConfig, module });
				element.appendChild(child);
			}
		}
	}

	return element;
}
