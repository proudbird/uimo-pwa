import { BaseClass } from '../ui/core/base';
import { DataAttribute } from '../state';
import { ChildElemetConfig, ContextState, DataAttributeEventHandler, DataAttributeValue, ElementEventHandler, ElementProp, ElementPropertyHandler, StyleProperties } from '../types';

export function setObservation(element: BaseClass, prop: ElementProp, state: ContextState, setter: DataAttributeEventHandler): void {
	if(!(prop || state)) return;

	if(typeof prop === 'string') {
		setter(prop);
	} else if(prop instanceof DataAttribute) {
		setter(prop.value);
		element.observe(prop, () => setter(prop.value));
	} else if(typeof prop === 'object' && (prop as ElementPropertyHandler).handler) {
		setter((prop as ElementPropertyHandler).handler!(state));
		if((prop as ElementPropertyHandler).dependencies?.length) {
			for(const dep of (prop as ElementPropertyHandler).dependencies!) {
				element.observe(dep, () => setter((prop as ElementPropertyHandler).handler!(state)));
			}
		} else {
			element.addEventListener('change', () => setter((prop as ElementPropertyHandler).handler!(state)));
		}
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

export function createElement(config: ChildElemetConfig, state: ContextState): BaseClass | HTMLElement | SVGSVGElement {
	// first trying to create custom element
	const Constructor = customElements.get(config.tagName);
	if(Constructor) {
		return new Constructor(config, state) as BaseClass;
	}

	// creating build-in element 
	if(config.tagName === 'svg') {
		return document.createElementNS('http://www.w3.org/2000/svg', 'svg') as SVGSVGElement;
	} else {
		return document.createElement(config.tagName) as HTMLElement;
	}
}

export function buildElement(owner: BaseClass, config: ChildElemetConfig, state: ContextState): BaseClass | HTMLElement | SVGSVGElement {
  
	const element = createElement(config, state);
	if((element as BaseClass).isCustom) {
		return element;
	}

	config.id && element.setAttribute('id', config.id);

	if(config.className) {
		const prop = config.className;
		const setter = (value: DataAttributeValue) => element.setAttribute('class', value as string); 
		if((element as BaseClass).isCustom) {
			setObservation(element as BaseClass, prop, state, setter);
		} else {
			setObservation(owner, prop, state, setter);
		}
	}

	Object.entries(config.attributes || {}).map(([name, prop]) => {
		const setter = (value: DataAttributeValue) => {
			element.setAttribute(name, value as string); 
		};
		if((element as BaseClass).isCustom) {
			setObservation(element as BaseClass, prop!, state, setter);
		} else {
			setObservation(owner, prop!, state, setter);
		}
	});

	Object.entries(config.props || {}).map(([name, prop]) => {
		const setter = (value: DataAttributeValue) => {
			//@ts-ignore
			element[name] = value; 
		};
		if((element as BaseClass).isCustom) {
			setObservation(element as BaseClass, prop!, state, setter);
			// Object.defineProperty(element as CustomElement, name, {
			//   get: () => getPropValue(prop, state),
			//   set: (newProp) => setObservation(element as CustomElement, newProp, state, () => {})
			// });
		} else {
			setObservation(owner, prop!, state, setter);
		}
	});

	for(const styleName in config.style) {
		const prop = config.style[styleName as StyleProperties];
		const setter = (value: DataAttributeValue) => element.style[styleName as StyleProperties] = value as any; 
		if((element as BaseClass).isCustom) {
			setObservation(element as BaseClass, prop!, state, setter);
		} else {
			setObservation(owner, prop!, state, setter);
		}
	}

	Object.entries(config.events || {}).map(([name, event]) => {
		element.addEventListener(name, (e: Event) => {
			if(typeof event === 'string') {
				const handler = owner[event as keyof BaseClass] as ElementEventHandler;
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
				const child = buildElement(owner, childConfig, state!);
				element.appendChild(child);
			}
		}
	}

	return element;
}
