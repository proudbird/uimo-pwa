import { DataAttributeSetter, IMonoDataAttribute, IPolyDataAttribute } from './data';
import UnknownAttribute from './data/attribute/unknown';
import { DataAttributeChangeEvent } from './data/events';
import { DataAttribute, IStateManager } from './data/state';
import { ChildTemplate, ComponentOptions, EventHandler, IComponent, IView, MethodHandler, MethodHandlerDefinition, PolyChildTemplate, PropDataSourceDefinition, PropDefinition, PropHandler, PropHandlerDefinition, StyleProperties, ViewModule } from './types';

export function getProperty(prop: PropDefinition | PropHandler | undefined, owner: IView): any {
	if(!prop) return;

	if(typeof prop === 'string' || typeof prop === 'number' || typeof prop === 'boolean') {
		return prop;
	} else {
		return executeMethod(
			prop as MethodHandlerDefinition, 
			owner
		);	
	}
}

export function executeMethod(
	eventDefinition: MethodHandlerDefinition | PropHandlerDefinition | undefined, 
	owner: IView, 
	args?: any[]
) {
	if(!eventDefinition) return;

	args = args || [];
	let result: any;

	if(typeof eventDefinition === 'string') {
		const handler = owner.module[eventDefinition as keyof ViewModule] as MethodHandler;
		if(handler) {
			result = handler.apply(owner, args);
		} else {
			throw new Error(`Element doesn't have a function ${eventDefinition}`);
		}
	} else if(typeof eventDefinition === 'function') {
		result = eventDefinition.apply(owner, args);
	} else if(typeof eventDefinition === 'object' && (eventDefinition as PropHandlerDefinition).handler) {
		return executeMethod(
			(eventDefinition as PropHandlerDefinition).handler, 
			owner, 
			args
		);
	} else {
		throw new Error(`Wrong object was defined as event handler. Only 'string' or 'function' are allowed. Type '${typeof eventDefinition}' was provided.`);
	}

	return result;
}

export function setObservation(element: IComponent, prop: PropDefinition, data: IStateManager, setter?: DataAttributeSetter): void {
	if(prop === undefined || prop === null) return;

	if(typeof prop === 'string' || typeof prop === 'number' || typeof prop === 'boolean') { // if date???
		setter && setter(prop);
	} else if((prop as IPolyDataAttribute).isIterable) {
		element.observe((prop as DataAttribute), () => element.onDataLoad && element.onDataLoad(prop as IPolyDataAttribute));
	} else if((prop as DataAttribute).DataAttribute) {
		setter && setter((prop as IMonoDataAttribute).value);
		element.observe((prop as DataAttribute), (e: Event) => {
			const changeEvent = e as DataAttributeChangeEvent;
			setter && setter(changeEvent.newValue);
		});
		if(prop instanceof UnknownAttribute) {
			prop.addEventListener('initialized', (e: Event) => {
				const newTarget = (e as CustomEvent).detail.value;
				if(newTarget) {
					element.observe((newTarget as DataAttribute), (e: Event) => {
						const changeEvent = e as DataAttributeChangeEvent;
						setter && setter(changeEvent.newValue);
					});
				}
			})
		}
	} else if(typeof prop === 'object' && (prop as PropHandlerDefinition).handler) {
		const handler = (prop as PropHandlerDefinition).handler;

		const setValue = () => {
			setter && setter(getProperty(
				handler, 
				element.owner
			));
		};

		setValue(); // initial value

		if((prop as PropHandlerDefinition).dependencies?.length) {
			for(const dep of (prop as PropHandlerDefinition).dependencies!) {
				element.observe(dep as DataAttribute, setValue);
			}
		} else {
			element.addEventListener('change', setValue);
			// element.addEventListener('input', () => setter((prop as PropHandlerDefinition).handler!(data.parent.state)));
		}
	}  else if(typeof prop === 'object' && (prop as PropDataSourceDefinition).path) {
		prop = prop as PropDataSourceDefinition;
		let dataProvider = data;
		const attr = dataProvider[prop.path];
		if(!attr) {
			throw new Error(`Can't find path ${prop.path} in data provider`);
		}
		if((attr as IPolyDataAttribute)?.isIterable) { 
			element.observe(attr, () => element.onDataLoad && element.onDataLoad(attr));
		} else {
			setter && setter(attr.value);
			element.observe(attr, () => setter && setter(attr.value));
		}
	}
}

export function createElement({ parent, config, context, module }: BuildElementOptions): IComponent | HTMLElement | SVGSVGElement {
	config = config as PolyChildTemplate;

	// first trying to create custom element
	if(config.type !== 'native') {
		const Constructor = customElements.get(/(\@|ui\-)/.test(config.tagName) ? config.tagName.replace('@', 'uimo-').replace('ui-', 'uimo-') : `uimo-${config.tagName}`);
		if(Constructor) {
			return new Constructor({ owner: parent.owner, parent, config, context, module } as ComponentOptions) as IComponent;
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
	parent: IComponent;
	config: ChildTemplate;
	context?: IStateManager | DataAttribute;
	module?: ViewModule;
};

export function buildElement({ parent, config, context, module }: BuildElementOptions): IComponent | HTMLElement | SVGSVGElement {
	const element = createElement({ parent, config, context, module });
	if((element as IComponent).isCustom) {
		return element;
	}

	config = config as PolyChildTemplate;
	config.id && element.setAttribute('id', config.id);

	if(config.className) {
		const prop = config.className;
		const setter = (value: any) => element.setAttribute('class', value as string); 
		if((element as IComponent).isCustom) {
			setObservation(element as IComponent, prop, parent.$state, setter);
		} else {
			setObservation(parent, prop, parent.$state, setter);
		}
	}

	Object.entries(config.attributes || {}).map(([name, prop]) => {
		const setter = (value: any) => {
			element.setAttribute(name, value as string); 
		};
		if((element as IComponent).isCustom) {
			setObservation(element as IComponent, prop!, parent.$state, setter);
		} else {
			setObservation(parent, prop!, parent.$state, setter);
		}
	});

	Object.entries(config.props || {}).map(([name, prop]) => {
		const setter = (value: any) => {
			//@ts-ignore
			element[name] = value; 
		};
		if((element as IComponent).isCustom) {
			setObservation(element as IComponent, prop!, parent.$state, setter);
			// Object.defineProperty(element as Component, name, {
			//   get: () => getPropValue(prop, state),
			//   set: (newProp) => setObservation(element as Component, newProp, state, () => {})
			// });
		} else {
			setObservation(parent, prop!, parent.$state, setter);
		}
	});

	for(const styleName in config.style) {
		const prop = config.style[styleName as StyleProperties];
		const setter = (value: any) => element.style[styleName as StyleProperties] = value as any; 
		if((element as IComponent).isCustom) {
			setObservation(element as IComponent, prop!, parent.$state, setter);
		} else {
			setObservation(parent, prop!, parent.$state, setter);
		}
	}

	Object.entries(config.events || {}).map(([name, event]) => {
		element.addEventListener(name, (e: Event) => {
			if(typeof event === 'string') {
				if(!module) {
					throw new Error(`Can't get handler '${event}' for element '${(config as PolyChildTemplate).tagName}': View module is not defined`);
				}
				const handler = module[event as keyof IComponent] as EventHandler;
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
			for(const childConfig of (config.children as PolyChildTemplate[])) {
				if(typeof childConfig === 'string') {
					element.innerHTML = childConfig;
					continue;
				}
				if(childConfig.type === 'slot' || !childConfig || !Object.entries(childConfig).length) continue;
				const child = buildElement({ parent, config: childConfig, module });
				element.appendChild(child);
			}
		}
	}

	return element;
}
