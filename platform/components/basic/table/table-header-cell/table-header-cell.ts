import { Component, DefineComponent } from '@/core';
import { PolyChildTemplate, Template } from '@/core/types';

import { specification, ITableHeaderCellComponent } from './table-header-cell.types';

@DefineComponent('table-header-cell')
export default class TableHeaderCell extends Component<ITableHeaderCellComponent>(specification) {
  #resizeTimeout: number | undefined;

  render(): Template {
    return {
      ...this.config,
      children: [
        {
          tagName: 'span',
          className: 'title',
          props: {
            innerHTML: this.config.props?.title || '',
          },
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
