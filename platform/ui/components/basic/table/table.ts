
import { customElement, DefineElement } from '@/ui/core/base';
import { IDataAttributeCollection } from '@/core/data/state';
import { type CustomElementOptions, ChildElementDefinition, ItemElementDefinition } from '@/types';

import description from './table.desc';

const tagName = 'table';

@DefineElement(tagName)
export default class Table extends customElement(description) {

  constructor({ config, stateDefinition, ...rest }: CustomElementOptions) {
    config = config || {};
    config.scope = 'table';
    const itemSlot = (config.children as ChildElementDefinition[])?.find(slot => slot.tagName === 'fields'); 

    const colTemplate = config.props?.template || (itemSlot?.children as ChildElementDefinition[])?.map(() => '1fr').join(' ');
    stateDefinition = {
      template: { type: 'string', initValue: colTemplate },
      resizePending: { type: 'boolean', initValue: false },
      resizeCursorPosition: { type: 'number', initValue: NaN },
      bottomTriggerPosition: { type: 'number', initValue: NaN },
      allEntriesLoaded: { type: 'boolean', initValue: false },
    };

    super({ config, stateDefinition, ...rest });
    
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
            alias: 'endTrigger',
            className: 'end-trigger',
            style: { 
              display: { 
                handler: () => this.state.allEntriesLoaded ? 'none' : 'flex', 
                dependencies: [this.$state.allEntriesLoaded] 
              }
            },
            children: [
              {
                tagName: 'progress-bar',
                props: { indeterminate: true },
              }
            ]
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
        threshold: 0.5
    }

    const callback: IntersectionObserverCallback = (entries, observer) => {
        entries.forEach((entry) => {
          if(entry.boundingClientRect.top > 0) {
            (this.data as IDataAttributeCollection).nextPage();
          }       
        });
    }
        
    let observer = new IntersectionObserver(callback, options);
    let target = this.elements.body.elements.endTrigger;
    observer.observe(target!);
  }

  onDataLoad() {
    const itemSlot = (this.config.children as ChildElementDefinition[])?.find(slot => slot.tagName === 'fields');

    const data = this.data as IDataAttributeCollection;
    if(data.page === 1) {
      ((itemSlot?.children || []) as ChildElementDefinition[]).forEach((fieldConfig, colIndex) => {
        this.elements.header.addElements({
          tagName: 'table-header-cell',
          scope: 'table',
          index: colIndex,
          props: { title: fieldConfig?.props?.title },
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
      const fieldConfigs = ((itemSlot?.children || []) as ItemElementDefinition[]).map((fieldConfig, colIndex) => {
        return {
          ...fieldConfig,
          scope: 'table',
          style: {
            ...fieldConfig.style,
            gridColumn: `${colIndex+1}/${colIndex+2}`,
          }
        };
      });

      this.elements.body.addElement({
        tagName: 'table-row',
        scope: 'table',
        style: { gridTemplateColumns: `var(--tableTemplate)` },
        children: fieldConfigs,
      }, { context: item, position: this.elements.body.childNodes.length - 1 });
    }
  }
}
