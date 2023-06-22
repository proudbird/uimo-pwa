
import { buildElement, setObservation } from '@/core/fabric';
import { genId } from '@/utils/helpers';
import { ContextState, CustomElement, CustomElementProps, DataAttributeValue, ElementConfig, ElementDefinition, ElementEventHandler, ElementState, IDataAttribute, StyleProperties } from '@/types';
import DataAttributeChangeEvent from '@/state/event';
import DataAttribute from '@/state/dataAttribute';

type Observation = {
  observable: IDataAttribute,
  callback: EventListenerOrEventListenerObject
}


interface Construtable<T> {
  new (...args: any[]): T;
  prototype: T;
}

interface ConstrutableB<T> {
  new (config: ElementConfig, stateDefinition?: ElementState, context?: ContextState): T;
  prototype: T;
}

export interface BaseClass extends HTMLElement {
  isCustom: true;
  get config(): ElementConfig;
  get state(): ElementState;
  get props(): CustomElementProps<any>;
  get elements(): Record<string, BaseClass>;
  observe(observable: IDataAttribute, callback: EventListenerOrEventListenerObject): void;
}


// decorator to register class as custom element
export function DefineElement(tagName: string) {
	return function <T extends Construtable<BaseClass>>(constructor: T) {
		customElements.define(`uimo-${tagName}`, constructor as unknown as typeof HTMLElement);
		return class extends constructor {
			_tagName: string;
			constructor(...args: any[]) {
				super(...args);
				this._tagName = tagName;
			}
		};
	};
}

function customElementFabric<D extends ElementDefinition>(description: D): ReturnClassType<D> {
	class Base extends HTMLElement implements BaseClass {
		private _id: string;
		private _config: ElementConfig = {};
		private _state: ElementState;
		private _props: CustomElementProps<D>;
		private _context: ContextState;
		private _elements: Record<string, BaseClass> = {};
  
		private _observables: Array<Observation> = [];
  
		public get isCustom(): true {
			return true;
		}
  
		constructor(...args: any[]) {
			super();
			const [config, context] = args;
			this._id = genId();
			this._config = config;
			this._state = {};
			this._props = {} as CustomElementProps<D>;
			this._context = context || {};

			// defining object state on base of element specification 
			Object.entries(description.props || {}).map(([propName, prop]) => {
				if(config.props && config.props[propName]) {
					this._state[propName] = config.props[propName];
				} else {
					this._state[propName] = new DataAttribute(prop.defaultValue);
				}
			});
  
			for(const [attrName, attr] of Object.entries(this._state)) {
				Object.defineProperty(this._props, attrName, {
					get: () => attr.value,
					set: (value: DataAttributeValue) => {
						attr.value = value;}
				});
				this.observe(attr, () => {
					this.dispatchEvent(new DataAttributeChangeEvent(attr, attrName));
				});
			}
  
			this._build();
		}
  
		private disconnectedCallback(): void {
			for(const { observable, callback } of this._observables) {
				observable.removeEventListener('change', callback);
			}
			this._observables = [];
		}
  
		public observe(observable: IDataAttribute, callback: EventListenerOrEventListenerObject): void {
			observable.addEventListener('change', callback);
			this._observables.push({
				observable,
				callback 
			});
		}
  
		protected render(): ElementConfig {
			return this.config;
		}
  
		protected _build(): void {
			const template = this.render();
      
			this.setAttribute('id', this._id);
			template.alias && this.setAttribute('alias', template.alias as string); 
  
			template.className && setObservation(this, template.className, this._state, (value: DataAttributeValue) => {
				this.setAttribute('class', `${value}`.trim()); 
			});
  
			Object.entries(template.attributes || {}).map(([name, prop]) => {
				setObservation(this, prop!, this._state, (value: DataAttributeValue) => {
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
					console.log(value);
					//@ts-ignore
					this[name] = value; 
				};
				setObservation(this, prop!, this._state, setter);
				// TODO: add setter when element default stucture will be implemented, so if property
				// will be defined in element stucture we will be able to redefine behavior
				// Object.defineProperty(this as CustomElement, name, {
				//   get: () => getPropValue(prop, this._state),
				//   // set: (newProp) => setObservation(this as CustomElement, newProp, this._state, setter)
				// });
			});
  
			for(const styleName in template.style) {
				const prop = template.style[styleName as StyleProperties];
				setObservation(this, prop!, this._state, (value: DataAttributeValue) => {
					this.style[styleName as StyleProperties] = value as any;
				});
			}
  
			Object.entries(template.events || {}).map(([name, event]) => {
				this.addEventListener(name, (e: Event) => {
					if(typeof event === 'string') {
						const handler = this[event as keyof Base] as ElementEventHandler;
						if(handler) {
							handler.call(this, e);
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
						const child = buildElement(this, childConfig, this._state);
						this.appendChild(child);
						if(childConfig.alias) {
							this._elements[childConfig.alias] = child as BaseClass;
						}
					}
				}
			}
		}
  
		public handleEvent(eventName: string, e: Event): void {
			const eventDefinition = this._config.events?.[eventName];
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
			return this._config;
		} 
  
		public get state(): ElementState {
			return this._state;
		} 
  
		public get props(): CustomElementProps<D> {
			return this._props;
		} 
  
		public get elements(): Record<string, BaseClass> {
			return this._elements;
		} 
	}

	return Base as ReturnClassType<D>;
}

export type ReturnClassType<D extends ElementDefinition> = Construtable<BaseClass> & ConstrutableB<CustomElement<D>>

export const customElement = customElementFabric as (
  <D extends ElementDefinition>(definition: D) => ReturnClassType<D>
);