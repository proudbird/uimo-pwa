
import { customElement, DefineElement } from '@/ui/core/base';
import description from './table.desc';
import { buildElement } from '../../../../core/fabric';
import { BuildElememtParams, ChildElemetConfig, ElementConfig, StyleDefinidion } from '../../../../types';
import Context from '../../../../core/data/context';
import { AttributeType } from '../../../../core/types';
import BooleanAttribute from '../../../../core/data/boolean';

const tagName = 'table';

@DefineElement(tagName)
export default class Table extends customElement(description) {
  #container: HTMLElement;
  #header: HTMLElement;
  #body: HTMLElement;

  constructor(...args: BuildElememtParams) {
    super(...args);
    
    const containerConfig = {
      tagName: 'div',
      className: 'table-container',
    }
    this.#container = buildElement(this, containerConfig, { context: {}, state: {}}, {}) as HTMLElement;
    this.appendChild(this.#container);
    
    const headerConfig = {
      tagName: 'table-header',
    }
    this.#header = buildElement(this, headerConfig, { context: {}, state: {}}, {}) as HTMLElement;
    this.#container.appendChild(this.#header);
  
    const bodyConfig = {
      tagName: 'table-body',
    }
    this.#body = buildElement(this, bodyConfig, { context: {}, state: {}}, {}) as HTMLElement;
    this.#container.appendChild(this.#body);
    
    this.data.addEventListener('load', this.#onLoadData.bind(this) )
  }

  #onLoadData() {
    const itemSlot = (this.config.children as ChildElemetConfig[])?.find(slot => slot.tagName === 'item');

    let colIndex = 1;
    for(let fieldConfig of ((itemSlot?.children || []) as ChildElemetConfig[])) {
      const headerCellConfig = {
        tagName: 'table-header-cell',
        props: {
          title: fieldConfig?.props?.title,
        },
        style: {} as Partial<StyleDefinidion>
      };
      // if(colIndex !== 1) {
      //   headerCellConfig.style.borderInlineStart = '1px solid var(--spectrum-global-color-gray-400)';
      // }
      colIndex++;
      const headerCellElement = buildElement(this, headerCellConfig, { context: {}, state: {}}, {}) as HTMLElement;
      this.#header.appendChild(headerCellElement);
    }

    let count = 0;
    for(let item of (this.data as IDataAttributeIterable)) {
      // if(count++ > 10) break;
      const rowConfig = {
        tagName: 'table-row',
        props: {
          isHovered: { path: 'isRowHovered' }
        }
      };
      const definition: StateDefinition = {
        isRowHovered: {  type: AttributeType.BOOLEAN }
      }
      const rowContext = { isRowHovered: new BooleanAttribute({ initValue: false }) };
      const rowElement = buildElement(this, rowConfig, { context: rowContext, state: {}}, {}) as HTMLElement;
      let colIndex = 1;
      for(let fieldConfig of ((itemSlot?.children || []) as ChildElemetConfig[])) {
        fieldConfig.style = fieldConfig.style || {};
        fieldConfig.style.gridColumn = `${colIndex}/${colIndex+1}`;
        fieldConfig.props = fieldConfig.props || {};
        fieldConfig.props.isRowHovered = { path: 'isRowHovered' };
        // if(colIndex !== 1) {
        //   fieldConfig.style.borderInlineStart = '1px solid var(--spectrum-global-color-gray-400)';
        // }
        colIndex++;
        const itemElement = buildElement(this, fieldConfig, { context: { ...item, ...rowContext }, state: {}}, {}) as HTMLElement;
        rowElement.appendChild(itemElement);
      }
      this.#body.appendChild(rowElement);
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
