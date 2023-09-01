
import { customElement, DefineElement } from '@/ui/core/base';
import description from './dynamic-list.desc';
import { buildElement } from '../../../../core/fabric';
import { BuildElememtParams, ElementConfig } from '../../../../types';

const tagName = 'dynamic-list';

@DefineElement(tagName)
export default class DynamicList extends customElement(description) {
  #collection: HTMLElement;

  constructor(...args: BuildElememtParams) {
    super(...args);
  
    const collectionConfig = {
      tagName: 'div',
      alias: 'collection',
    }
    this.#collection = buildElement(this, collectionConfig, { context: {}, state: {}}, {}) as HTMLElement;
    this.appendChild(this.#collection);
    
    this.data.addEventListener('load', this.#onLoadData.bind(this) )
  }

  #onLoadData() {
    for(let item of (this.data as IDataAttributeIterable)) {
      const itemConfig = {
        tagName: 'div',
        props: {
          innerHTML: item.Category.presentation
        }
      };
      const itemElement = buildElement(this, itemConfig, { context: {}, state: {}}, {}) as HTMLElement;
      this.#collection.appendChild(itemElement);
    }
  }

  addElement() {

    
  }

  render(): ElementConfig {
		return {
			...this.config, 
			children: []
		};
	}
}
