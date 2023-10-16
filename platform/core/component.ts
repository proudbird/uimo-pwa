
import { buildElement, setObservation } from '@/core/fabric';
import { genId } from '@/utils/helpers';

import { 
	DataAttribute, 
	IState, 
	IStateManager, 
	StateManager
} from '@/core/data/state';

import PropertyManager from '@/core/data/manager';

import { 
	ChildTemplate,
	ComponentOptions,
	ComponentProps,
	Constructable,
	ComponentDefinition, 
	DOMElement, 
	ElementOptions, 
	EventHandler, 
	IComponent, 
	IView, 
	PropDataSourceDefinition, 
	ExtendedComponent, 
	StyleProperties, 
	Template,
	ViewModule
} from './types';
import { DataAttributeSetter, IPolyDataAttribute, IPolyDataAttributeEvent } from './data';

type Observation = {
  observable: EventTarget,
  callback: EventListenerOrEventListenerObject
}

/**
 * Decorator to register class as custom element
 */
export function DefineComponent(tagName: string) {
	return function <T extends Constructable<IComponent>>(constructor: T) {
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

export function componentFabric<D extends ComponentDefinition<any, any>>(description: D): ExtendedComponent<D> {
	class Base extends HTMLElement implements IComponent {
		#id: string;
		#config: Template = {} as Template;
		#context: IStateManager;
		#state: IStateManager;
		#scope: IStateManager;
		#props: IState;
		#propsManager: PropertyManager<D>;
		#module: ViewModule;
		#elements: Record<string, IComponent> = {};
		#parent: IComponent;
		#owner: IView;
		#data: DataAttribute | IPolyDataAttribute = {} as DataAttribute;
  
		#observables: Array<Observation> = [];
		#eventObservables: Record<string, Array<Observation>> = {};
  
		public get isCustom(): true {
			return true;
		}

		static scopeName: string;
  
		constructor({ owner, parent, config, context, stateDefinition, module }: ComponentOptions) {
			super();
			this.#parent = parent || { config: {} } as IComponent;
			this.#config = config;
			this.#id = this.#config.id || genId();
			this.#state = new StateManager(stateDefinition);
			this.#scope = (this.#parent.constructor as typeof Base).scopeName === (this.constructor as typeof Base).scopeName ? (new StateManager()).merge([this.#parent.$scope, this.#parent.$state]) : new StateManager();
			this.#context = context || new StateManager();
			this.#props = {} as IState;
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
				if(typeof this.#config.data === 'object' && (this.#config.data as PropDataSourceDefinition).path) {
					//@ts-ignore
					this.#data =  this.#context[(this.#config.data as ElementPropertyDataSource).path] as DataAttribute;
				} else {
					this.#data =  this.#config.data as DataAttribute;
				}
				setObservation(this, this.#data, this.#context);
			}
  
			this.#build();
		}
  
		private disconnectedCallback(): void {
			for(let { observable, callback } of this.#observables) {
				observable.removeEventListener('change', callback);
			}
			this.#observables = [];

			for(const eventName in this.#eventObservables) {
				for(let { observable, callback } of this.#eventObservables[eventName]) {
					observable.removeEventListener(eventName, callback);
				}
			}

			this.#eventObservables = {};
		}
  
		public observe(observable: DataAttribute, callback: EventListenerOrEventListenerObject): void {
			observable.addEventListener('change', callback);
			this.#observables.push({
				observable,
				callback 
			});
		}

		public on(event: string, callback: EventListener | string): void {
			const listener = (e: Event) => {
				if(typeof callback === 'string') {
					const handler = this.#module[callback as keyof Base] as EventHandler;
					if(handler) {
						handler.call(this.#owner, e);
					} else {
						throw new Error(`Element doesn't have a function ${callback}`);
					}
				} else if(typeof callback === 'function') {
					callback.call(this, e);
				} else {
					throw new Error(`Wrong object was defined as event handler. Only 'string' or 'function' are allowed. Type '${typeof callback}' was provided.`);
				}
			};

			this.addEventListener(event, listener);
			this.#eventObservables[event] = this.#eventObservables[event] || [];
			this.#eventObservables[event].push({
				observable: this,
				callback: listener
			});
		}

		onDataLoad(data: IPolyDataAttribute): void {}
		onDataChanged(event: IPolyDataAttributeEvent): void {};
  
		/**
		 * Defines element configuration to be rendered
		 */
		render(): Template {
			return this.#config;
		}
  
		#build(): void {
			const template = this.render();
			// this.#config = template;
      
			this.setAttribute('id', this.#id);
			template.alias && this.setAttribute('alias', template.alias as string); 
  
			if(template.className) {
				const prop = template.className;
				const setter = (value: any) => this.setAttribute('class', value as string); 
				setObservation(this as IComponent, prop, this.#context, setter);
			}

			Object.entries(template.attributes || {}).map(([name, prop]) => {
				setObservation(this, prop!, this.#context, (value: any) => {
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

				const setter = (value: any) => {
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
				setObservation(this, prop!, this.#context, (value: any) => {
					this.style[styleName as StyleProperties] = value as any;
					// this.style.setProperty(styleName as StyleProperties, value as any)
				});
			}
  
			Object.entries(template.events || {}).map(([event, callback]) => {
				this.on(event, callback);
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
							this.#elements[childConfig.alias] = child as IComponent;
						}
					}
				}
			}
		}

		public addElement(config: ChildTemplate, { context, position }: ElementOptions): DOMElement {
			const element = buildElement({ parent: this, config, module: this.#module, context });
			if(typeof position === 'number') {
				this.insertBefore(element, this.children[position]);
			} else {
				this.appendChild(element);
			}
			if(config.alias) {
				this.#elements[config.alias] = element as IComponent;
			}

			return element;
		}

		public addElements(configs: ChildTemplate | ChildTemplate[]): void {
			if(!Array.isArray(configs)) {
				configs = [configs];
			}

			for(const elementConfig of configs) {
				const element = buildElement({ parent: this, config: elementConfig, module: this.#module });
				this.appendChild(element);
				if(elementConfig.alias) {
					this.#elements[elementConfig.alias] = element as IComponent;
				}
			}
		}
  
		public handleEvent(eventName: string, e: Event): void {
			const eventDefinition = this.#config.events?.[eventName];
			if(!eventDefinition) return;
  
			if(typeof eventDefinition === 'string') {
				const handler = this[eventDefinition as keyof Base] as EventHandler;
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
  
		public get config(): Template {
			return this.#config;
		} 
  
		public get props(): ComponentProps<D> {
			return this.#propsManager as ComponentProps<D>;
		}  
  
		public get state(): IState {
			return this.#state.getData();
		} 
  
		public get $state(): IStateManager {
			return this.#state;
		} 

		public get scope(): IState {
			return this.#scope.getData();
		}  

		public get $scope(): IStateManager {
			return this.#scope;
		}  
  
		public get elements(): Record<string, IComponent> {
			return this.#elements;
		} 
  
		public get context(): IState {
			return this.#context.getData();
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

	return Base as ExtendedComponent<D>;
}
