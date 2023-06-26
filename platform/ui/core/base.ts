
import { buildElement, setObservation } from '@/core/fabric';
import { genId } from '@/utils/helpers';
import { ContextState, CustomElement, CustomElementProps, DataAttributeValue, ElementConfig, ElementDefinition, ElementEventHandler, ElementPropertyDataSource, ElementState, IDataAttribute, StyleProperties, ViewModule } from '@/types';
import DataAttributeChangeEvent from '@/state/event';
import DataAttribute from '@/state/dataAttribute';
import View from './view';

type Observation = {
  observable: IDataAttribute,
  callback: EventListenerOrEventListenerObject
}

interface Construtable<T> {
  new (...args: any[]): T;
  prototype: T;
}

interface ConstrutableB<T> {
  new (owner: View, config: ElementConfig, context?: ContextState, module?: ViewModule): T;
  prototype: T;
}

export interface BaseClass extends HTMLElement {
  isCustom: true;
  get config(): ElementConfig;
  get state(): ElementState;
  get props(): CustomElementProps<any>;
  get context(): ContextState;
  get elements(): Record<string, BaseClass>;
  get owner(): View;
  observe(observable: IDataAttribute, callback: EventListenerOrEventListenerObject): void;
}


// decorator to register class as custom element
export function DefineElement(tagName: string) {
	return function <T extends Construtable<BaseClass>>(constructor: T) {
		class Extended extends constructor {
			_tagName: string;
			constructor(...args: any[]) {
				super(...args);
				this._tagName = tagName;
			}
		};
		customElements.define(`uimo-${tagName}`, Extended as unknown as typeof HTMLElement);
		return Extended;
	};
}

function customElementFabric<D extends ElementDefinition>(description: D): ReturnClassType<D> {
	class Base extends HTMLElement implements BaseClass {
		#id: string;
		#config: ElementConfig = {};
		#state: ElementState;
		#props: ElementState;
		#context: ContextState;
		#viewModule: ViewModule;
		#elements: Record<string, BaseClass> = {};
		#owner: View;
  
		#observables: Array<Observation> = [];
  
		public get isCustom(): true {
			return true;
		}

		public props: CustomElementProps<D> = {} as CustomElementProps<D>;
  
		constructor(...args: any[]) {
			super();
			const [owner, config, context, viewModule] = args;
			this.#id = genId();
			this.#config = config;
			this.#state = {};
			this.#props = {};
			this.#context = context || {};
			this.#viewModule = viewModule || {};
			this.#owner = owner;

			// defining object state on base of element specification 
			Object.entries(description.props || {}).map(([propName, prop]) => {
				if(config.props && config.props[propName]) {
					if(typeof config.props[propName] === 'object' && (config.props[propName] as ElementPropertyDataSource).dataPath) {
						this.#props[propName] = context[config.props[propName].dataPath];
					} else {
						this.#props[propName] = config.props[propName];
					}
				} else {
					this.#props[propName] = new DataAttribute(prop.defaultValue);
				}
				Object.defineProperty(this.props, propName, {
					get: () => this.#props[propName].value,
					set: (value: DataAttributeValue) => {
						this.#props[propName].value = value;}
				});
				if(this.#props[propName] instanceof DataAttribute) {
					this.observe(this.#props[propName], () => {
						this.dispatchEvent(new DataAttributeChangeEvent(this.#props[propName], propName));
					});
				}
			});
  
			// for(const [attrName, attr] of Object.entries(this.#state)) {
			// 	Object.defineProperty(this.#props, attrName, {
			// 		get: () => attr.value,
			// 		set: (value: DataAttributeValue) => {
			// 			attr.value = value;}
			// 	});
			// 	this.observe(attr, () => {
			// 		this.dispatchEvent(new DataAttributeChangeEvent(attr, attrName));
			// 	});
			// }
  
			this.#build();
		}
  
		private disconnectedCallback(): void {
			for(const { observable, callback } of this.#observables) {
				observable.removeEventListener('change', callback);
			}
			this.#observables = [];
		}
  
		public observe(observable: IDataAttribute, callback: EventListenerOrEventListenerObject): void {
			observable.addEventListener('change', callback);
			this.#observables.push({
				observable,
				callback 
			});
		}
  
		protected render(): ElementConfig {
			return this.config;
		}
  
		#build(): void {
			const template = this.render();
      
			this.setAttribute('id', this.#id);
			template.alias && this.setAttribute('alias', template.alias as string); 
  
			template.className && setObservation(this, template.className, this.#context, (value: DataAttributeValue) => {
				this.setAttribute('class', `${value}`.trim()); 
			});
  
			Object.entries(template.attributes || {}).map(([name, prop]) => {
				setObservation(this, prop!, this.#context, (value: DataAttributeValue) => {
					if(value === true) {
						this.setAttribute(name, ''); 
					} else if(value === false) {
						this.removeAttribute(name);
					} else {
						this.setAttribute(name, value as string); 
					}
				});
			});
  
			Object.entries(template.props || {}).map(([name, prop]) => {
				const setter = (value: DataAttributeValue) => {
					//@ts-ignore
					this[name] = value; 
				};
				setObservation(this, prop!, this.#context, setter);
			});
  
			for(const styleName in template.style) {
				const prop = template.style[styleName as StyleProperties];
				setObservation(this, prop!, this.#context, (value: DataAttributeValue) => {
					this.style[styleName as StyleProperties] = value as any;
				});
			}
  
			Object.entries(template.events || {}).map(([name, event]) => {
				this.addEventListener(name, (e: Event) => {
					if(typeof event === 'string') {
						const handler = this.#viewModule[event as keyof Base] as ElementEventHandler;
						if(handler) {
							handler.call(this.#owner, e);
						} else {
							throw new Error(`Element doesn't have a function ${event}`);
						}
					} else if(typeof event === 'function') {
						event.call(this, e);
					} else {
						throw new Error(`Wrong object was defined as event handler. Only 'string' or 'function' are allowed. Type '${typeof event}' was provided.`);
					}
				});
			});
  
			if(template.children) {
				if(typeof template.children === 'string') {
					this.innerHTML = template.children;
				} else {
					for(const childConfig of template.children) {
						const child = buildElement(this, childConfig, this.#context, this.#viewModule);
						this.appendChild(child);
						if(childConfig.alias) {
							this.#elements[childConfig.alias] = child as BaseClass;
						}
					}
				}
			}
		}
  
		public handleEvent(eventName: string, e: Event): void {
			const eventDefinition = this.#config.events?.[eventName];
			if(!eventDefinition) return;
  
			if(typeof eventDefinition === 'string') {
				const handler = this[eventDefinition as keyof Base] as ElementEventHandler;
				if(handler) {
					handler.call(this, e);
				} else {
					throw new Error(`Element doesn't have a function ${eventDefinition}`);
				}
			} else if(typeof eventDefinition === 'function') {
				eventDefinition.call(this, e);
			} else {
				throw new Error(`Wrong object was defined as event handler. Only 'string' or 'function' are allowed. Type '${typeof event}' was provided.`);
			}
		}
  
		public get config(): ElementConfig {
			return this.#config;
		} 
  
		public get state(): ElementState {
			return this.#props;
		}  
  
		public get elements(): Record<string, BaseClass> {
			return this.#elements;
		} 
  
		public get context(): ContextState {
			return this.#context;
		} 

		public get owner() {
			return this.#owner;
		}
	}

	return Base as ReturnClassType<D>;
}

export type ReturnClassType<D extends ElementDefinition> = Construtable<BaseClass> & ConstrutableB<CustomElement<D>>

export const customElement = customElementFabric as (
  <D extends ElementDefinition>(definition: D) => ReturnClassType<D>
);