
import { buildElement, setObservation } from '@/core/fabric';
import { genId } from '@/utils/helpers';
import { ChildElemetConfig, ContextState, DataAttributeEventHandler, DataAttributeValue, ElementConfig, ElementEventHandler, ElementPropertyDataSource, ElementState, StyleProperties, ViewModule } from '@/types';
import DataAttributeChangeEvent from '@/state/event';
import View from './view';
import PropertyManager from '../../core/data/manager';
import Context from '../../core/data/context';
import State from '../../state/state';

type Observation = {
  observable: IDataAttribute,
  callback: EventListenerOrEventListenerObject
}

interface Construtable<T> {
  new (...args: any[]): T;
  prototype: T;
}

export type CustomElementData = {
	context: IDataContext;
	state: IDataContext;
};

export type CustomElementArguments = [View, ElementConfig, CustomElementData, ViewModule];

interface ConstrutableB<T> {
  new (...args: CustomElementArguments): T;
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
	defineState(stateDefinition: StateDefinition, initData?: Record<string, any>): void;
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
		}
		customElements.define(`uimo-${tagName}`, Extended as unknown as typeof HTMLElement);
		return Extended;
	};
}

function customElementFabric<D extends ElementDefinition>(description: D): ReturnClassType<D> {
	class Base extends HTMLElement implements BaseClass {
		#id: string;
		#config: ElementConfig = {} as ElementConfig;
		#state: IDataContext;
		#props: IDataContext;
		#propsManager: PropertyManager<D>;
		#context: IDataContext;
		#viewModule: ViewModule;
		#elements: Record<string, BaseClass> = {};
		#owner: View;
		#data: IDataAttribute | IDataAttributeIterable = {} as IDataAttribute;
  
		#observables: Array<Observation> = [];
  
		public get isCustom(): true {
			return true;
		}
  
		constructor(...args: any[]) {
			super();
			const [owner, config, data, viewModule] = args;
			this.#config = config;
			this.#id = this.#config.id || genId();
			this.#state = data.state || {};
			this.#props = {};
			this.#context = data.context || {};
			this.#viewModule = viewModule || {};
			this.#owner = owner;

			this.#propsManager = new PropertyManager(this, description, config.props || {}, data);

			for(let [propName, prop] of Object.entries(this.#propsManager)) {
				Object.defineProperty(this, propName, { 
					get: () => {
						return this.#propsManager[propName as keyof PropertyManager<D>];
					},
					set: (value: any) => {
						this.#propsManager[propName as keyof PropertyManager<D>] = value;
					}
				});
			}

			if(this.#config.data) {
				if(typeof this.#config.data === 'object' && (this.#config.data as ElementPropertyDataSource).path) {
					this.#data =  data.context[(this.#config.data as ElementPropertyDataSource).path] as IDataAttribute;
				} else {
					this.#data =  this.#config.data as IDataAttribute;
				}
				setObservation(this, this.#config.data!, data, () => {});
			}
  
			this.#build();
		}
  
		private disconnectedCallback(): void {
			for(let { observable, callback } of this.#observables) {
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

		public defineState(stateDefinition: StateDefinition, initData?: Record<string, any>): void {
			this.#state = new State(this, stateDefinition, initData);
		}
  
		/**
		 * Defines element configuration to be rendered
		 * @returns {ElementConfig} - element configuration
		 */
		protected render(): ElementConfig {
			return this.config;
		}
  
		#build(): void {
			const template = this.render();

			const data = {
				context: this.#context || {},
				state: this.#state || {}
			};
      
			this.setAttribute('id', this.#id);
			template.alias && this.setAttribute('alias', template.alias as string); 
  
			if(template.className) {
				const prop = template.className;
				const setter = (value: DataAttributeValue) => this.setAttribute('class', value as string); 
				setObservation(this as BaseClass, prop, data, setter);
			}

			// template.className && setObservation(this, template.className, data, (value: DataAttributeValue) => {
			// 	this.setAttribute('class', `${value}`.trim()); 
			// });
  
			Object.entries(template.attributes || {}).map(([name, prop]) => {
				setObservation(this, prop!, data, (value: DataAttributeValue) => {
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

				function setPropsObservation(prop: PropertyManager<any>, name: string, setter: DataAttributeEventHandler): void {
					if(!(prop)) return;
				
					prop.addEventListener(name, (e: Event) => {
						setter((e as CustomEvent).detail.value);
					});
				}

				const setter = (value: DataAttributeValue) => {
					//@ts-ignore
					this[name] = value; 
				};

				if((prop instanceof PropertyManager)) {
					setPropsObservation(prop, name, setter);
				} else {
					setObservation(this, prop!, data, setter);
				}
			});

			
  
			for(const styleName in template.style) {
				const prop = template.style[styleName as StyleProperties];
				setObservation(this, prop!, data, (value: DataAttributeValue) => {
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
						if(typeof childConfig === 'string') {
							this.innerHTML = childConfig;
							continue;
						}
						if(childConfig.type === 'slot') continue;
						const child = buildElement(this, childConfig, data, this.#viewModule);
						this.appendChild(child);
						if(childConfig.alias) {
							this.#elements[childConfig.alias] = child as BaseClass;
						}
					}
				}
			}
		}

		public addElements(elements: ChildElemetConfig[]): void {
			const data = {
				context: this.#context || {},
				state: this.#state || {}
			};

			if(!Array.isArray(elements)) {
				elements = [elements];
			}

			for(const elementConfig of elements) {
				const element = buildElement(this, elementConfig, data, this.#viewModule);
				this.appendChild(element);
				if(elementConfig.alias) {
					this.#elements[elementConfig.alias] = element as BaseClass;
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
  
		public get props(): CustomElementProps<any> {
			return this.#propsManager;
		}  
  
		public get state(): ContextState {
			return this.#state;
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

		public get data() {
			return this.#data;
		}
	}

	return Base as ReturnClassType<D>;
}

export type ReturnClassType<D extends ElementDefinition> = Construtable<BaseClass> & ConstrutableB<CustomElement<D>>

export const customElement = customElementFabric as (
  <D extends ElementDefinition>(definition: D) => ReturnClassType<D>
);