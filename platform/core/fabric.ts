import { BaseClass } from '../ui/core/base';
import { ChildElemetConfig, DataAttributeEventHandler, DataAttributeValue, ElementEventHandler, ElementProp, StyleProperties, ViewModule } from '../types';

type CustomElementData = {
	context: IDataContext;
	state: IDataContext;
};

export function setObservation(element: BaseClass, prop: ElementProp, data: CustomElementData, setter: DataAttributeEventHandler): void {
	if(!(prop)) return;

	if(typeof prop === 'string') {
		setter(prop);
	} else if((prop as IDataAttribute).DataAttribute) {
		setter((prop as IDataAttribute).value);
		element.observe((prop as IDataAttribute), () => setter((prop as IDataAttribute).value));
	} else if(typeof prop === 'object' && (prop as ElementPropertyHandler).handler) {
		setter((prop as ElementPropertyHandler).handler!(data.context));
		if((prop as ElementPropertyHandler).dependencies?.length) {
			for(const dep of (prop as ElementPropertyHandler).dependencies!) {
				element.observe(dep, () => setter((prop as ElementPropertyHandler).handler!(data.context)));
			}
		} else {
			element.addEventListener('change', () => setter((prop as ElementPropertyHandler).handler!(data.context)));
			// element.addEventListener('input', () => setter((prop as ElementPropertyHandler).handler!(data.context)));
		}
	}  else if(typeof prop === 'object' && (prop as ElementPropertyDataSource).path) {
		prop = prop as ElementPropertyDataSource;
		let dataProvider = data.context;
		if(prop.path.startsWith('$')) {
			dataProvider = data.state;
		}
		const attr = dataProvider[prop.path] as IDataAttribute;
		setter(attr.value);
		element.observe(attr, () => setter(attr.value));
	}
}

export function getPropValue(prop: ElementProp, state: IDataContext): DataAttributeValue {
	if(!(prop || state)) return;

	if(typeof prop === 'string') {
		return prop;
	} else if((prop as IDataAttribute).DataAttribute) {
		return (prop as IDataAttribute).value;
	} else if(typeof prop === 'object' && (prop as ElementPropertyHandler).handler) {
		return (prop as ElementPropertyHandler).handler!(state);
	}
}

export function createElement(parent: BaseClass, config: ChildElemetConfig, data: CustomElementData, viewModule: ViewModule): BaseClass | HTMLElement | SVGSVGElement {
	// first trying to create custom element
	if(config.type !== 'native') {
		const Constructor = customElements.get(/(\@|ui\-)/.test(config.tagName) ? config.tagName.replace('@', 'uimo-').replace('ui-', 'uimo-') : `uimo-${config.tagName}`);
		if(Constructor) {
			return new Constructor(parent.owner, config, data, viewModule) as BaseClass;
		}
	}

	// creating build-in element 
	if(config.tagName === 'svg') {
		return document.createElementNS('http://www.w3.org/2000/svg', 'svg') as SVGSVGElement;
	} else {
		return document.createElement(config.tagName) as HTMLElement;
	}
}

export function buildElement(parent: BaseClass, config: ChildElemetConfig, data: CustomElementData, viewModule: ViewModule): BaseClass | HTMLElement | SVGSVGElement {
  
	const element = createElement(parent, config, data, viewModule);
	if((element as BaseClass).isCustom) {
		return element;
	}

	config.id && element.setAttribute('id', config.id);

	if(config.className) {
		const prop = config.className;
		const setter = (value: DataAttributeValue) => element.setAttribute('class', value as string); 
		if((element as BaseClass).isCustom) {
			setObservation(element as BaseClass, prop, data, setter);
		} else {
			setObservation(parent, prop, data, setter);
		}
	}

	Object.entries(config.attributes || {}).map(([name, prop]) => {
		const setter = (value: DataAttributeValue) => {
			element.setAttribute(name, value as string); 
		};
		if((element as BaseClass).isCustom) {
			setObservation(element as BaseClass, prop!, data, setter);
		} else {
			setObservation(parent, prop!, data, setter);
		}
	});

	Object.entries(config.props || {}).map(([name, prop]) => {
		const setter = (value: DataAttributeValue) => {
			//@ts-ignore
			element[name] = value; 
		};
		if((element as BaseClass).isCustom) {
			setObservation(element as BaseClass, prop!, data, setter);
			// Object.defineProperty(element as CustomElement, name, {
			//   get: () => getPropValue(prop, state),
			//   set: (newProp) => setObservation(element as CustomElement, newProp, state, () => {})
			// });
		} else {
			setObservation(parent, prop!, data, setter);
		}
	});

	for(const styleName in config.style) {
		const prop = config.style[styleName as StyleProperties];
		const setter = (value: DataAttributeValue) => element.style[styleName as StyleProperties] = value as any; 
		if((element as BaseClass).isCustom) {
			setObservation(element as BaseClass, prop!, data, setter);
		} else {
			setObservation(parent, prop!, data, setter);
		}
	}

	Object.entries(config.events || {}).map(([name, event]) => {
		element.addEventListener(name, (e: Event) => {
			if(typeof event === 'string') {
				const handler = viewModule[event as keyof BaseClass] as ElementEventHandler;
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
				const child = buildElement(parent, childConfig, data, viewModule);
				element.appendChild(child);
			}
		}
	}

	return element;
}
