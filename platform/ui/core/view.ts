import { ContextState, DataAttributeValue, ElementConfig, StateDefinition, ViewModule } from '@/types';
import { DataAttribute } from '@/state';
import ViewElement from '@/ui/components/basic/view';

const typesDefaultValuesMap = {
  'string': ''
} as const;

export default class View {
  #state: ContextState = {};
  #module: ViewModule = {};
  #node: HTMLElement;

  constructor(config: ElementConfig, stateDefinition: StateDefinition, module: ViewModule) {
    this.#module = module;

    Object.entries(stateDefinition || {}).map(([name, value]) => {
      this.#state[name] = new DataAttribute(typesDefaultValuesMap[value as keyof typeof typesDefaultValuesMap]);
      Object.defineProperty(this, name, {
        get: () => this.#state[name].value,
        set: (value: DataAttributeValue) => this.#state[name].value = value,
      });
    });

    this.#node = new ViewElement(this, config, this.#state, this.#module);
  }

  get node(): HTMLElement {
    return this.#node;
  }
}
