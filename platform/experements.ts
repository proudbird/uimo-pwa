//@ts-nocheck

export const definition = {
	props: [
		{
			id: 'label',
			title: 'Label',
			mutable: true,
			responsive: true,
			type: 'string'
		},
		// {
		//   id: 'variant',
		//   title: 'Variant',
		//   mutable: true,
		//   responsive: true,
		//   type: [
		//     { value: 'default', title: 'Default', default: true },
		//     { value: 'primary', title: 'Primary' },
		//     { value: 'negative', title: 'Negative' },
		//   ]
		// },
		// {
		//   id: 'size',
		//   title: 'Size',
		//   mutable: true,
		//   responsive: true,
		//   type: [
		//     { value: 'sm', title: 'Small' },
		//     { value: 'md', title: 'Medium', default: true },
		//     { value: 'lg', title: 'Large' },
		//   ]
		// },
		// {
		//   id: 'treatment',
		//   title: 'Treatment',
		//   mutable: true,
		//   responsive: true,
		//   type: [
		//     { value: 'fill', title: 'Fill', default: true },
		//     { value: 'outline', title: 'Outline' },
		//   ]
		// },
		{
			id: 'disabled',
			title: 'Disabled',
			mutable: true,
			responsive: true,
			type: 'boolean',
			defaultValue: false
		},
		{
			id: 'processing',
			title: 'Processing',
			mutable: true,
			type: 'boolean',
			defaultValue: false
		},
	],
	events: {
		press: { title: 'on press' },
		hover: { title: 'on hover' },
	}
} as const;

type Str = readonly { readonly value: string, readonly title: string }[]
type ProductSections1 = typeof definition;
// type SELECTED_PRODUCTS_STAT1 = { [K in keyof ProductSections1['props']]: 
//   ArrayElement<ProductSections1['props'][K]['type']> extends Str ? ProductSections1['props'][K]['type'][number]['value'] : ProductSections1['props'][K]['type'] }

export type TypesMap = {
  'string': string;
  'number': number;
  'boolean': boolean;
  'date': Date;
};

type rr<i extends number> = {
    [key in ProductSections1['props'][i]['id']]: ProductSections1['props'][i]['type']
}

type rrr = {
  [key in keyof rr<Index>]: 0
} 

type r = {
    [k in Index]: {
      [key in ProductSections1['props'][k]['id']]: ProductSections1['props'][k]['type']
    }
} 

type y = keyof r

type u = keyof r

type x =  ProductSections1['props'] extends readonly (infer T)[] ? T : never;

export type ValuesOf<T extends readonly any[]>= T[number];

type Foo = ValuesOf<ProductSections1['props']>;

type q = {
  [n in keyof Foo]: {
    [v in Foo['id']]: Foo['type']
  }
}

const a = [1,2,3] as const;
type i = {[k in  OnlyIndex<typeof a>]}
type OnlyIndex<T extends readonly any[]> = keyof T

type GetIndex<A extends readonly any[]> = {
  [K in keyof A]:  K ;
}[number]

type Index = GetIndex<ProductSections1['props']>; // Index is "2"

function extendCustomElement<T extends {new (...args: any[]): HTMLElement}, D extends ElementDefinition>(constructor: T, definition: D, tagName: string) {
	class Base extends constructor implements Base {
		private _tagName: string;
		private _id: string;
		private _config: ElementConfig = {};
		private _state: ElementState;
		private _context: ContextState;
  
		private _observables: Array<Observation> = [];
  
		public get isCustom(): true {
			return true;
		}
  
		static register(tagName: string) {
			customElements.define(`uimo-${tagName}`, this);
		}
  
		constructor(...args: any[]) {
			super(...args);
			const [tagName, config, state, context] = args;
			this._id = genId();
			this._tagName = tagName;
			this._config = config;
			this._state = state || {};
			this._context = context || {};
  
			for(const [attrName, attr] of Object.entries(this._state)) {
				Object.defineProperty(this, attrName, {
					get: () => attr.value,
					set: (value: DataAttributeValue) => attr.value = value
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
  
		public observe(observable: DataAttribute, callback: EventListenerOrEventListenerObject): void {
			observable.addEventListener('change', callback);
			this._observables.push({
				observable,
				callback 
			});
		}
  
		protected render(): ElementConfig {
			return {};
		}
  
		protected _build(): void {
			const self = this;
			const template = this.render();
      
			this.setAttribute('id', this._id);
			template.alias && this.setAttribute('alias', template.alias as string); 
  
			template.className && setObservation(this, template.className, this._state, (value: DataAttributeValue) => {
				self.setAttribute('class', `${value}`.trim()); 
			});
  
			Object.entries(template.attributes || {}).map(([name, prop]) => {
				setObservation(this, prop!, this._state, (value: DataAttributeValue) => {
					if(value === true) {
						self.setAttribute(name, ''); 
					} else if(value === false) {
						self.removeAttribute(name);
					} else {
						self.setAttribute(name, value as string); 
					}
				});
			});
  
			Object.entries(template.props || {}).map(([name, prop]) => {
				const setter = (value: DataAttributeValue) => {
					(this)[name] = value; 
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
							handler(e);
						} else {
							throw new Error(`Element doesn't have a function ${event}`);
						}
					} else if(typeof event === 'function') {
						event(e);
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
					handler(e);
				} else {
					throw new Error(`Element doesn't have a function ${eventDefinition}`);
				}
			} else if(typeof eventDefinition === 'function') {
				eventDefinition(e);
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
	}

	// customElements.define(`uimo-${tagName}`, Base);
	return Base;
}