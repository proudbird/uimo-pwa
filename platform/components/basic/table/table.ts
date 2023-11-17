
import { Component, DefineComponent } from '@/core';
import { DataAttribute, DynamicListAttribute, IMonoDataAttribute } from '@/core/data';
import { IView, type ComponentOptions } from '@/core/types';
import { ChildTemplate } from '@/core/types';
import Reference from '@/core/objects/reference';

import { specification, ITableComponent } from './table.types';
import TableField from './table-field/table-field';
import { set } from 'yaml/dist/schema/yaml-1.1/set';
import ListAttribute from '@/core/data/attribute/list';
import { CollectionDataAttributeUpdateEvent } from '@/core/data/events';

@DefineComponent('table')
export default class Table extends Component<ITableComponent, DynamicListAttribute>(specification) {

  #firstElement: HTMLElement | null = null;
  #firstElementTopOffset: number = 0;

  constructor({ config, stateDefinition, owner, ...rest }: ComponentOptions) {
    config = config || {};
    config.scope = 'table';

    const itemSlot = (config.children as ChildTemplate[])?.find(slot => slot.tagName === 'fields'); 

    const colTemplate = config.props?.template || (itemSlot?.children as ChildTemplate[])?.map(() => '1fr').join(' ');
    stateDefinition = {
      template: { type: 'string', initValue: colTemplate },
      resizePending: { type: 'boolean', initValue: false },
      resizeCursorPosition: { type: 'number', initValue: NaN },
      selectedItems: { type: 'list', initValue: owner.params.selectedItems },
      editingElement: { type: 'variable' }
    };

    super({ config, stateDefinition, owner, ...rest });
    
    this.addElements([
      {
        tagName: 'div',
        alias: 'container',
        scope: 'table',
        className: 'table-container',
      }, {
        tagName: 'table-header',
        alias: 'header',
        scope: 'table',
        style: { gridTemplateColumns: `var(--tableTemplate)` }
      }, {
        tagName: 'box',
        alias: 'bodyContainer',
        className: 'body-container',
        children: [
          {
            tagName: 'div',
            alias: 'triggerAtStart',
            className: 'fetch-trigger start',
          },
          {
            tagName: 'table-body',
            alias: 'body',
            scope: 'table',
          },
          {
            tagName: 'div',
            alias: 'triggerAtEnd',
            className: 'fetch-trigger end',
            style: { 
              display: { 
                handler: () => {
                  const shouldDisplay = !this.data.isFullFromEnd;
                  const value = shouldDisplay ? 'flex' : 'none';
                  
                  return value;
                }, 
                dependencies: [this.data] 
              }
            },
          }
        ]
      }, {
        tagName: 'div',
        scope: 'table',
        className: 'table-resize-indicator',
        style: {
          display: {
            handler: () => this.state.resizeCursorPosition && this.state.resizePending ? 'block' : 'none',
            dependencies: [this.$state.resizeCursorPosition, this.$state.resizePending]
          },
          left: {
            handler: () => `${this.state.resizeCursorPosition - this.getBoundingClientRect().left - 2}px`,
            dependencies: [this.$state.resizeCursorPosition]
          },
        }
      }
    ]);

    const templateVariableSetter = () => this.style.setProperty('--tableTemplate', this.state.template);
    templateVariableSetter();
    this.observe(this.$state.template, templateVariableSetter);

    this.data.addEventListener('clear', () => {
      this.elements.header.replaceChildren();
      this.elements.bodyContainer.elements.body.replaceChildren();

      this.#firstElement = null;
      this.#firstElementTopOffset = 0;

      this.elements.bodyContainer.elements.triggerAtStart.style.display = 'none';
      this.elements.bodyContainer.elements.triggerAtEnd.style.display = 'none';
    })

    this.data.addEventListener('update', (e: Event) => {
      const instance = (e as CollectionDataAttributeUpdateEvent).instance;
      for(let [attrName, attr] of Object.entries<Record<string, DataAttribute>>(this.state.editingElement.value)) {
        const edited = (instance.getAttribute(attrName) as IMonoDataAttribute);
        if(edited) {
          attr.value = edited.value;
        }
      }
    })
  }

  private connectedCallback() {
    let options = {
        root: this.elements.bodyContainer,
        rootMargin: '0px',
        threshold: 0.1
    }

    const nextCallback: IntersectionObserverCallback = (entries, observer) => {
        entries.forEach((entry) => {
          if(entry.isIntersecting && entry.boundingClientRect.top > 0) {
            this.#firstElement = null;
            (this.data as DynamicListAttribute).nextPage();
          }       
        });
    }
        
    let afterObserver = new IntersectionObserver(nextCallback, options);
    let afterTriggerTarget = this.elements.bodyContainer.elements.triggerAtEnd;
    afterObserver.observe(afterTriggerTarget!);

    const prevCallback: IntersectionObserverCallback = (entries, observer) => {
      if(!isFetchingDataFromMiddle(this) || this.data.portion  === 'first') {
        return;
      }
      entries.forEach((entry) => {
        if(entry.isIntersecting) {
          if(this.data.portion === 'next' && this.data.page === 1 && this.data.length > this.data.limit) {
            return;
          }

          this.#firstElement = this.elements.bodyContainer.elements.body.childNodes[0] as HTMLElement;
          
          (this.data as DynamicListAttribute).prevPage();
        }
      });
    }
        
    let startTriggerObserver = new IntersectionObserver(prevCallback, options);
    let startTriggerTarget = this.elements.bodyContainer.elements.triggerAtStart;
    startTriggerTarget && startTriggerObserver.observe(startTriggerTarget);
  }

  onDataLoad() {
    this.#firstElementTopOffset = this.#firstElement?.offsetTop || 0;
    
    const itemSlot = (this.config.children as ChildTemplate[])?.find(slot => slot.tagName === 'fields');
    
    const data =  this.data as DynamicListAttribute;

    this.data.selected && (this.state.selectedItems as ListAttribute).set(0, { id: this.data.selected });
    if(!this.elements.header.childNodes.length) {
      ((itemSlot?.children || []) as ChildTemplate[]).forEach((fieldConfig, colIndex) => {
        this.elements.header.addElements({
          tagName: 'table-header-cell',
          scope: 'table',
          index: colIndex,
          props: { title: fieldConfig?.props?.title || ''},
        });
      });
    }

    for(let index = 0; index < data.limit; index++) {
      let item: any;
      try {
        item = data.getItemByPage(data.page, index);
      } catch(error) {
        if(error ===  `index_out_of_range`) {
          this.state.allEntriesLoaded = true;
          break;
        }
      }
      const fieldConfigs = ((itemSlot?.children || []) as ChildTemplate[]).map((fieldConfig, colIndex) => {
        return {
          ...fieldConfig,
          scope: 'table',
          style: {
            ...fieldConfig.style,
            gridColumn: `${colIndex+1}/${colIndex+2}`,
          }
        };
      });
      
      let position: number | undefined;
      if(data.portion === 'prev') {
        position = index;
      } else {
        position = this.elements.bodyContainer.elements.body.childNodes.length;
      }

      const isSelected = isSelectionMode(this) && !!this.state.selectedItems.length && !!this.state.selectedItems.find((selected: Reference) => {
        return selected.id === item.Reference?.value.id
      });
      
      this.elements.bodyContainer.elements.body.addElement({
        tagName: 'table-row',
        children: fieldConfigs,
        props: {
          selectionMode: this.props.selectionMode,
        },
        data: item,
        events: {
          select: this.config.events?.select!,
        }
      }, { context: item, position });

      if(this.#firstElement) {
        this.elements.bodyContainer.elements.triggerAtStart.style.display = 'none';
        setTimeout(() => {
          this.#firstElement!.scrollIntoView({ block: 'start' });
          this.elements.bodyContainer.elements.body.scrollBy(0, -this.#firstElementTopOffset);
        });
      } 
    }

    if(!this.#firstElement && isFetchingDataFromMiddle(this) && data.page === 1 && this.data.length > this.data.limit) {
      new ResizeObserver(() => {
        (this.elements.bodyContainer.elements.body.childNodes[0] as HTMLElement).scrollIntoView({ block: 'start' });
      }).observe(this.elements.bodyContainer.elements.body.childNodes[0] as HTMLElement)
    }

    if(!data.isFullFromStart) {
      this.elements.bodyContainer.elements.triggerAtStart.style.display = 'flex';
    }
  }
}

function isSelectionMode(table: Table): boolean {
  return table.props.selectionMode !== 'none';
}

function isFetchingDataFromMiddle(table: Table): boolean {
  return !!table.data.cursor;
}