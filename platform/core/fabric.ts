import { BaseClass } from '../ui/core/base';
import { DataAttribute } from '../state';
import { ChildElemetConfig, ContextState, DataAttributeEventHandler, DataAttributeValue, ElementEventHandler, ElementProp, ElementPropertyDataSource, ElementPropertyHandler, IDataAttribute, StyleProperties, ViewModule } from '../types';
import { View } from '@/ui/components';

export function setObservation(element: BaseClass, prop: ElementProp, context: ContextState, setter: DataAttributeEventHandler): void {
	if(!(prop || context)) return;

	if(typeof prop === 'string') {
		setter(prop);
	} else if(prop instanceof DataAttribute) {
		setter(prop.value);
		element.observe(prop, () => setter((prop as IDataAttribute).value));
	} else if(typeof prop === 'object' && (prop as ElementPropertyHandler).handler) {
		setter((prop as ElementPropertyHandler).handler!(context));
		if((prop as ElementPropertyHandler).dependencies?.length) {
			for(const dep of (prop as ElementPropertyHandler).dependencies!) {
				element.observe(dep, () => setter((prop as ElementPropertyHandler).handler!(context)));
			}
		} else {
			element.addEventListener('change', () => setter((prop as ElementPropertyHandler).handler!(context)));
		}
	}  else if(typeof prop === 'object' && (prop as ElementPropertyDataSource).dataPath) {
		prop = prop as ElementPropertyDataSource;
		const attr = context[prop.dataPath];
		setter(attr.value);
		element.observe(attr, () => setter(attr.value));
	}
}

export function getPropValue(prop: ElementProp, state: ContextState): DataAttributeValue {
	if(!(prop || state)) return;

	if(typeof prop === 'string') {
		return prop;
	} else if(prop instanceof DataAttribute) {
		return prop.value;
	} else if(typeof prop === 'object' && (prop as ElementPropertyHandler).handler) {
		return (prop as ElementPropertyHandler).handler!(state);
	}
}

export function createElement(owner: View, config: ChildElemetConfig, context: ContextState, viewModule: ViewModule): BaseClass | HTMLElement | SVGSVGElement {
	// first trying to create custom element
	const Constructor = customElements.get(config.tagName.replace('@', 'uimo-'));
	if(Constructor) {
		return new Constructor(owner, config, context, viewModule) as BaseClass;
	}

	// creating build-in element 
	if(config.tagName === 'svg') {
		return document.createElementNS('http://www.w3.org/2000/svg', 'svg') as SVGSVGElement;
	} else {
		return document.createElement(config.tagName) as HTMLElement;
	}
}

export function buildElement(owner: View, config: ChildElemetConfig, context: ContextState, viewModule: ViewModule): BaseClass | HTMLElement | SVGSVGElement {
  
	const element = createElement(owner, config, context, viewModule);
	if((element as BaseClass).isCustom) {
		return element;
	}

	config.id && element.setAttribute('id', config.id);

	if(config.className) {
		const prop = config.className;
		const setter = (value: DataAttributeValue) => element.setAttribute('class', value as string); 
		if((element as BaseClass).isCustom) {
			setObservation(element as BaseClass, prop, context, setter);
		} else {
			setObservation(owner, prop, context, setter);
		}
	}

	Object.entries(config.attributes || {}).map(([name, prop]) => {
		const setter = (value: DataAttributeValue) => {
			element.setAttribute(name, value as string); 
		};
		if((element as BaseClass).isCustom) {
			setObservation(element as BaseClass, prop!, context, setter);
		} else {
			setObservation(owner, prop!, context, setter);
		}
	});

	Object.entries(config.props || {}).map(([name, prop]) => {
		const setter = (value: DataAttributeValue) => {
			//@ts-ignore
			element[name] = value; 
		};
		if((element as BaseClass).isCustom) {
			setObservation(element as BaseClass, prop!, context, setter);
			// Object.defineProperty(element as CustomElement, name, {
			//   get: () => getPropValue(prop, state),
			//   set: (newProp) => setObservation(element as CustomElement, newProp, state, () => {})
			// });
		} else {
			setObservation(owner, prop!, context, setter);
		}
	});

	for(const styleName in config.style) {
		const prop = config.style[styleName as StyleProperties];
		const setter = (value: DataAttributeValue) => element.style[styleName as StyleProperties] = value as any; 
		if((element as BaseClass).isCustom) {
			setObservation(element as BaseClass, prop!, context, setter);
		} else {
			setObservation(owner, prop!, context, setter);
		}
	}

	Object.entries(config.events || {}).map(([name, event]) => {
		element.addEventListener(name, (e: Event) => {
			if(typeof event === 'string') {
				const handler = viewModule[event as keyof BaseClass] as ElementEventHandler;
				if(handler) {
					handler.call(owner, e);
				} else {
					throw new Error(`Element doesn't have a function ${event}`);
				}
			} else if(typeof event === 'function') {
				event.call(owner, e);
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
				const child = buildElement(owner, childConfig, context, viewModule);
				element.appendChild(child);
			}
		}
	}

	return element;
}
