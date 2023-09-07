
import { buildElement, setObservation } from '@/core/fabric';
import { genId } from '@/utils/helpers';
import { 
	ChildElementDefinition,
	Constructable, 
	ConstructableCustomElement, 
	CustomElement, 
	CustomElementOptions, 
	CustomElementProps, 
	DataAttributeSetter, 
	DataAttributeValue, 
	ElementDefinition, 
	ElementDescription, 
	ElementEventHandler, 
	ElementPropertyDataSource, 
	ICustomElement, 
	IDataAttribute, 
	IDataAttributeIterable, 
	IState, 
	IView, 
	StateDefinition, 
	StyleProperties, 
	ViewModule 
} from '@/types';
import PropertyManager from '../../core/data/manager';
import { createState } from '../../state/state';

type Observation = {
  observable: IDataAttribute,
  callback: EventListenerOrEventListenerObject
}

// decorator to register class as custom element
export function DefineElement(tagName: string) {
	return function <T extends Constructable<ICustomElement>>(constructor: T) {
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

function customElementFabric<D extends ElementDescription>(description: D): ReturnClassType<D> {
	class Base extends HTMLElement implements ICustomElement {
		#id: string;
		#config: ElementDefinition = {} as ElementDefinition;
		#state: IState;
		#scope: IState;
		#props: IState;
		#propsManager: PropertyManager<D>;
		#context: IState;
		#module: ViewModule;
		#elements: Record<string, ICustomElement> = {};
		#parent: ICustomElement;
		#owner: IView;
		#data: IDataAttribute | IDataAttributeIterable = {} as IDataAttribute;
  
		#observables: Array<Observation> = [];
  
		public get isCustom(): true {
			return true;
		}
  
		constructor({ owner, parent, config, context, stateDefinition, module }: CustomElementOptions) {
			super();
			this.#parent = parent || { config: {} } as ICustomElement;
			this.#config = config;
			this.#id = this.#config.id || genId();
			this.#state = createState(this, stateDefinition);
			this.#scope = this.#parent.config.scope === this.config.scope ? { ...this.#parent.scope, ...this.#parent.state } : {};
			this.#context = context || {};
			this.#props = {};
			this.#module = module || {};
			this.#owner = owner;

			this.#propsManager = new PropertyManager(this, description, config.props || {});

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
					//@ts-ignore
					this.#data =  this.#context[(this.#config.data as ElementPropertyDataSource).path] as IDataAttribute;
				} else {
					this.#data =  this.#config.data as IDataAttribute;
				}
				setObservation(this, this.#config.data!, this.#context);
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
  
		/**
		 * Defines element configuration to be rendered
		 * @returns {ElementDefinition} - element configuration
		 */
		protected render(): ElementDefinition {
			return this.config;
		}
  
		#build(): void {
			const template = this.render();
      
			this.setAttribute('id', this.#id);
			template.alias && this.setAttribute('alias', template.alias as string); 
  
			if(template.className) {
				const prop = template.className;
				const setter = (value: DataAttributeValue) => this.setAttribute('class', value as string); 
				setObservation(this as ICustomElement, prop, this.#context, setter);
			}

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

				function setPropsObservation(prop: PropertyManager<any>, name: string, setter: DataAttributeSetter): void {
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
					setObservation(this, prop!, this.#context, setter);
				}
			});

			for(const styleName in template.style) {
				const prop = template.style[styleName as StyleProperties];
				setObservation(this, prop!, this.#context, (value: DataAttributeValue) => {
					this.style[styleName as StyleProperties] = value as any;
					// this.style.setProperty(styleName as StyleProperties, value as any)
				});
			}
  
			Object.entries(template.events || {}).map(([name, event]) => {
				this.addEventListener(name, (e: Event | MouseEvent) => {
					if(typeof event === 'string') {
						const handler = this.#module[event as keyof Base] as ElementEventHandler;
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
						const child = buildElement({ parent: this, config: childConfig, context: this.#context, module: this.#module });
						this.appendChild(child);
						if(childConfig.alias) {
							this.#elements[childConfig.alias] = child as ICustomElement;
						}
					}
				}
			}
		}

		public addElements(elements: ChildElementDefinition[]): void {
			if(!Array.isArray(elements)) {
				elements = [elements];
			}

			for(const elementConfig of elements) {
				const element = buildElement({ parent: this, config: elementConfig, module: this.#module });
				this.appendChild(element);
				if(elementConfig.alias) {
					this.#elements[elementConfig.alias] = element as ICustomElement;
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
  
		public get config(): ElementDefinition {
			return this.#config;
		} 
  
		public get props(): CustomElementProps<D> {
			return this.#propsManager as CustomElementProps<D>;
		}  
  
		public get state(): IState {
			return this.#state;
		} 

		public get scope(): IState {
			return this.#scope;
		}  
  
		public get elements(): Record<string, ICustomElement> {
			return this.#elements;
		} 
  
		public get context(): IState {
			return this.#context;
		} 

		public get owner() {
			return this.#owner;
		}

		public set owner(value: any) {
			this.#owner = value;
		}

		public get data() {
			return this.#data;
		}
	}

	return Base as ReturnClassType<D>;
}

export type ReturnClassType<D extends ElementDescription> = Constructable<ICustomElement> & ConstructableCustomElement<CustomElement<D>>

export const customElement = customElementFabric as (
  <D extends ElementDescription>(definition: D) => ReturnClassType<D>
);
