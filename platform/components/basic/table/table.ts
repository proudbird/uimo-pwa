
import { Component, DefineComponent } from '@/core';
import { DynamicListAttribute } from '@/core/data';
import { IView, type ComponentOptions } from '@/core/types';
import { ChildTemplate } from '@/core/types';
import Reference from '@/core/objects/reference';

import { specification, ITableComponent } from './table.types';
import TableField from './table-field/table-field';
import { set } from 'yaml/dist/schema/yaml-1.1/set';

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
        tagName: 'table-body',
        alias: 'body',
        scope: 'table',
        children: [
          {
            tagName: 'div',
            alias: 'triggerAtStart',
            className: 'fetch-trigger start',
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
  }

  private connectedCallback() {
    let options = {
        root: this.elements.body,
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
    let afterTriggerTarget = this.elements.body.elements.triggerAtEnd;
    afterObserver.observe(afterTriggerTarget!);

    const prevCallback: IntersectionObserverCallback = (entries, observer) => {
      if(!isFetchingDataFromMiddle(this) || this.data.portion  === 'first') {
        return;
      }
      entries.forEach((entry) => {
        if(entry.isIntersecting) {
          if(this.data.portion === 'next' && this.data.page === 1) {
            return;
          }

          this.#firstElement = this.elements.body.childNodes[1] as HTMLElement;
          
          (this.data as DynamicListAttribute).prevPage();
        }
      });
    }
        
    let startTriggerObserver = new IntersectionObserver(prevCallback, options);
    let startTriggerTarget = this.elements.body.elements.triggerAtStart;
    startTriggerTarget && startTriggerObserver.observe(startTriggerTarget);
  }

  onDataLoad() {
    this.#firstElementTopOffset = this.#firstElement?.offsetTop || 0;
    
    const itemSlot = (this.config.children as ChildTemplate[])?.find(slot => slot.tagName === 'fields');
    
    const data = this.data as DynamicListAttribute;

    if(data.portion === 'first') {
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
        position = index + 1;
      } else {
        position = this.elements.body.childNodes.length - 1;
      }

      const isSelected = isSelectionMode(this) && !!this.state.selectedItems.length && !!this.state.selectedItems.find((selected: Reference) => {
        return selected.id === item.Reference?.value.id
      });
      
      this.elements.body.addElement({
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
        this.elements.body.elements.triggerAtStart.style.display = 'none';
        setTimeout(() => {
          this.#firstElement!.scrollIntoView({ block: 'start' });
          this.elements.body.scrollBy(0, -this.#firstElementTopOffset);
        });
      } 
    }

    if(!this.#firstElement && isFetchingDataFromMiddle(this) && data.page === 1) {
      new ResizeObserver(() => {
        (this.elements.body.childNodes[1] as HTMLElement).scrollIntoView({ block: 'start' });
      }).observe(this.elements.body.childNodes[1] as HTMLElement)
    }

    if(!data.isFullFromStart) {
      this.elements.body.elements.triggerAtStart.style.display = 'flex';
    }
  }
}

function isSelectionMode(table: Table): boolean {
  return table.props.selectionMode !== 'none';
}

function isFetchingDataFromMiddle(table: Table): boolean {
  return !!table.state.selectedItems.length;
}