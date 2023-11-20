import { Component, DefineComponent } from '@/core';
import { ComponentOptions, IView, PolyChildTemplate, Template, ViewModule } from '@/core/types';
import View from '@/core/view';
import Modal from '@/components/basic/modal';
import { DynamicListAttribute } from '@/core/data';
import ListAttribute from '@/core/data/attribute/list';

import { specification, ITableHeaderCellComponent } from './table-header-cell.types';

@DefineComponent('table-header-cell')
export default class TableHeaderCell extends Component<ITableHeaderCellComponent>(specification) {
  #resizeTimeout: number | undefined;
  #filterView: View | undefined;

  static scopeName = 'table';

  render(): Template {
    return {
      ...this.config,
      children: [
        {
          tagName: 'div',
          className: 'cell-content',
          children: [
            {
              tagName: 'span',
              className: 'title',
              props: {
                innerHTML: this.config.props?.title || '',
              },
            },
            {
              tagName: 'icon',
              className: 'filter-icon',
              props: {
                variant: 'filter_list',
                size: 'small',
              },
              events: {
                click: () => {
                  const getModule = (view: IView): ViewModule => ({});

                  const existingFilter = (this.master?.$state.filters as ListAttribute).find((filter: any) => filter.id === this.config.alias);
                  const stateDefinition = {
                    value: {
                      type: 'string',
                      initValue: existingFilter ? existingFilter.value : ''
                    }
                  };

                  const handleAssign = () => {
                    (this.#filterView!.node as Modal).close();
                    const value = this.#filterView!.state.value;

                    let fieldId = this.config.alias!;
                    const filtersList = (this.master?.state.filters as ListAttribute);
                    const existingFilter = filtersList.find((filter: any) => filter.id === fieldId);

                    if(!value) {
                      if(existingFilter) {
                        filtersList.remove(existingFilter);
                      }
                      return;
                    }
                    
                    const data = this.master?.data as DynamicListAttribute;

                    let additionalLevel = ''
                    const attrDefinition = data.provider.attributes[fieldId];
                    if(attrDefinition.type.dataType === 'FK') {
                      additionalLevel = `.Name`
                    }

                    if(existingFilter) {
                      filtersList.replace(existingFilter, {
                        id: fieldId,
                        value: value,
                      });
                    } else {
                      filtersList.add({
                        id: fieldId,
                        value: value,
                      });
                    }
                  }

                  const rect = this.getBoundingClientRect();
                  const filterViewConfig: Template = {
                    modal: true,
                    style: {
                      width: '300px',
                      top: rect.y + rect.height + 'px',
                      left: rect.x + 'px',
                      padding: '16px',
                      gap: '16px',
                    },
                    children: [
                      {
                        tagName: 'text-field',
                        alias: 'filterField',
                        props: {
                          label: 'Look for',
                          size: 'small',
                          // labelPosition: 'left',
                        },
                        data: {
                          path: 'value'
                        },
                        events: {
                          keyup: (e: Event) => {
                            if((e as KeyboardEvent).key === 'Enter') {
                              handleAssign();
                            }
                          }
                        }
                      },
                      {
                        tagName: 'box',
                        style: {
                          display: 'flex',
                          flexDirection: 'row',
                          justifyContent: 'flex-end',
                          gap: '8px',
                        },
                        children: [
                          {
                            tagName: 'button',
                            props: {
                              label: 'Assign',
                              treatment: 'outline',
                              size: 'small'
                            },
                            events: {
                              click: handleAssign
                            }
                          },
                          {
                            tagName: 'button',
                            props: {
                              label: 'Cancel',
                              variant: 'secondary',
                              size: 'small'
                            },
                            events: {
                              click: () => (this.#filterView!.node as Modal).close()
                            }
                          }
                        ]
                      }
                    ]
                  };

                  const view = new View('table-column-filter', filterViewConfig, stateDefinition, getModule);

                  this.#filterView = view;
                  document.body.appendChild(view.node);

                  view.node.elements.body.elements.filterField.focus();
                },
              },
            }
          ],
        },
        {
          tagName: 'div',
          className: 'resize-area',
          events: {
            mousedown: (e) => {
              if (this.scope) {
								this.scope.resizePending = true;
                const template = this.scope!.template.split(' ');
                const index = (this.config as PolyChildTemplate).index;
                e.preventDefault();
                e.stopPropagation();
                const startX = (e as MouseEvent).pageX;
                const startWidth = this.clientWidth;
                const startWidthNextCell = this.nextElementSibling?.clientWidth;

                const resize = (e: MouseEvent) => {
                  e.preventDefault();
                  e.stopPropagation();
                  clearTimeout(this.#resizeTimeout);
									document.body.style.cursor = 'col-resize';
									document.body.style.setProperty("cursor", "col-resize", "important")

                  //@ts-ignore
                  this.#resizeTimeout = setTimeout(() => {
                    const width = startWidth + e.pageX - startX;
                    template[index] = `${width}px`;

                    if (template.length > index && startWidthNextCell) {
                      template[index + 1] = `${startWidthNextCell + startWidth - width}px`;
                    }

                    this.scope!.template = template.join(' ');
                    this.scope!.resizeCursorPosition = this.getBoundingClientRect().right;
                  }, 0);
                };

                const stopResize = () => {
									if(this.scope) {
										this.scope.resizePending = false;
                    this.scope!.resizeCursorPosition = NaN;
									}
                  clearTimeout(this.#resizeTimeout);
									document.body.style.cursor = 'default';
                  document.removeEventListener('mousemove', resize);
                  document.removeEventListener('mouseup', stopResize);
                };

                document.addEventListener('mousemove', resize);
                document.addEventListener('mouseup', stopResize);
              }
            },
          },
        },
        {
          tagName: 'div',
          className: 'resize-line',
        },
      ],
    };
  }
}
