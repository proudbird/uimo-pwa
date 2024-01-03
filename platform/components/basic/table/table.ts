
import { Component, DefineComponent } from '@/core';
import { DataAttribute, DynamicListAttribute, IMonoDataAttribute } from '@/core/data';
import { type ComponentOptions, IComponent, PolyChildTemplate } from '@/core/types';
import Reference from '@/core/objects/reference';

import { specification, ITableComponent } from './table.types';
import ListAttribute from '@/core/data/attribute/list';
import { CollectionDataAttributeUpdateEvent } from '@/core/data/events';

@DefineComponent('table')
export default class Table extends Component<ITableComponent, DynamicListAttribute>(specification) {

  #body: IComponent | null = null;
  #header: IComponent | null = null;
  #triggerAtStart: HTMLElement | null = null;
  #triggerAtEnd: HTMLElement | null = null;
  #firstElement: HTMLElement | null = null;
  #firstElementTopOffset: number = 0;

  static scopeName = 'table';

  constructor({ config, stateDefinition, owner, ...rest }: ComponentOptions) {
    config = config || {};
    config.scope = 'table';

    const itemSlot = (config.children as PolyChildTemplate[])?.find(slot => slot.tagName === 'fields'); 

    const colTemplate = config.props?.template || (itemSlot?.children as PolyChildTemplate[])?.map(() => '1fr').join(' ');
    stateDefinition = {
      template: { type: 'string', initValue: colTemplate },
      resizePending: { type: 'boolean', initValue: false },
      resizeCursorPosition: { type: 'number', initValue: NaN },
      selectedItems: { type: 'List', initValue: owner.params.selectedItems },
      editingElement: { type: 'Variable' },
      filters: { type: 'List', initValue: [] },
    };

    super({ config, stateDefinition, owner, ...rest });
    
    this.addElements([
      {
        tagName: 'table-filter-panel',
        alias: 'filtersPanel',
        scope: 'table',
        data: this.state.filters
      },
      {
        tagName: 'box',
        alias: 'tableContainer',
        scope: 'table',
        className: 'table-container',
        children: [
          {
            tagName: 'table-header',
            alias: 'header',
            scope: 'table',
            style: { gridTemplateColumns: `var(--tableTemplate)` }
          }, {
            tagName: 'box',
            scope: 'table',
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
        ]
      }
    ]);

    this.#header = this.elements.tableContainer.elements.header;
    this.#body = this.elements.tableContainer.elements.bodyContainer.elements.body;
    this.#triggerAtStart = this.elements.tableContainer.elements.bodyContainer.elements.triggerAtStart;
    this.#triggerAtEnd = this.elements.tableContainer.elements.bodyContainer.elements.triggerAtEnd;

    const templateVariableSetter = () => this.style.setProperty('--tableTemplate', this.state.template);
    templateVariableSetter();
    this.observe(this.$state.template, templateVariableSetter);

    this.data.addEventListener('clear', () => {
      this.#header!.replaceChildren();
      this.#body!.replaceChildren();

      this.#firstElement = null;
      this.#firstElementTopOffset = 0;

      this.#triggerAtStart!.style.display = 'none';
      this.#triggerAtEnd!.style.display = 'none';
    })

    this.data.addEventListener('update', (e: Event) => {
      const instance = (e as CollectionDataAttributeUpdateEvent).instance;
      for(let [attrName, attr] of Object.entries<Record<string, DataAttribute>>(this.state.editingElement.value)) {
        const edited = (instance.getAttribute(attrName) as IMonoDataAttribute);
        if(edited) {
          attr.value = edited.value;
        }
      }
    });
    
    (this.state.filters as ListAttribute).addEventListener('change', () => {
      const dataAttributes = (this.data as DynamicListAttribute).provider.attributes;
      const filters = [];
      for(const filter of (this.$state.filters as ListAttribute)) {
        let additionalLevel = ''
        const attrDefinition = dataAttributes[filter.id];
        if(attrDefinition.type.dataType === 'FK') {
          additionalLevel = `.Name`
        }

        let filterValue = '';
        if(filter.value) {
          filterValue = `%${filter.value}%`;
        }

        filters.push({
          iLike: [`${(this.data as DynamicListAttribute).model}.${filter.id}${additionalLevel}`, filterValue]
        });
      }

      (this.data as DynamicListAttribute).setFilters(filters);
    });
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
    let afterTriggerTarget = this.#triggerAtEnd;
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

          this.#firstElement = this.#body!.childNodes[0] as HTMLElement;
          
          (this.data as DynamicListAttribute).prevPage();
        }
      });
    }
        
    let startTriggerObserver = new IntersectionObserver(prevCallback, options);
    let startTriggerTarget = this.#triggerAtStart;
    startTriggerTarget && startTriggerObserver.observe(startTriggerTarget);
  }

  onDataLoad() {
    this.#firstElementTopOffset = this.#firstElement?.offsetTop || 0;
    
    const itemSlot = (this.config.children as PolyChildTemplate[])?.find(slot => slot.tagName === 'fields');
    
    const data =  this.data as DynamicListAttribute;

    this.data.selected && (this.state.selectedItems as ListAttribute).set(0, { id: this.data.selected });
    if(!this.#header!.childNodes.length) {
      ((itemSlot?.children || []) as PolyChildTemplate[]).forEach((fieldConfig, colIndex) => {
        this.#header!.addElements({
          tagName: 'table-header-cell',
          alias: fieldConfig.alias,
          scope: 'table',
          index: colIndex,
          props: { 
            title: fieldConfig?.props?.title || '',
          },
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
      const fieldConfigs = ((itemSlot?.children || []) as PolyChildTemplate[]).map((fieldConfig, colIndex) => {
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
        position = this.#body!.childNodes.length;
      }

      const isSelected = isSelectionMode(this) && !!this.state.selectedItems.length && !!this.state.selectedItems.find((selected: Reference) => {
        return selected.id === item.Reference?.value.id
      });
      
      this.#body!.addElement({
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
        this.#triggerAtStart!.style.display = 'none';
        setTimeout(() => {
          this.#firstElement!.scrollIntoView({ block: 'start' });
          this.#body!.scrollBy(0, -this.#firstElementTopOffset);
        });
      } 
    }

    if(!this.#firstElement && isFetchingDataFromMiddle(this) && data.page === 1 && this.data.length > this.data.limit) {
      new ResizeObserver(() => {
        (this.#body!.childNodes[0] as HTMLElement).scrollIntoView({ block: 'start' });
      }).observe(this.#body!.childNodes[0] as HTMLElement)
    }

    if(!data.isFullFromStart) {
      this.#triggerAtStart!.style.display = 'flex';
    }
  }
}

function isSelectionMode(table: Table): boolean {
  return table.props.selectionMode !== 'none';
}

function isFetchingDataFromMiddle(table: Table): boolean {
  return !!table.data.cursor;
}