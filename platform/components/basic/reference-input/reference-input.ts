import { Component, DefineComponent } from '@/core';
import { Template } from '@/core/types';
import { DataAttribute, ReferenceAttribute } from '@/core/data';

import { specification, IReferenceInputComponent } from './reference-input.types';
import InstanceAttribute from '@/core/data/attribute/instance';
import Reference from '@/core/objects/reference';

@DefineComponent('reference-input')
export default class ReferenceInput extends Component<IReferenceInputComponent>(specification) {
  render(): Template {
		return {
			...this.config,
			className: {
				handler: () => {
					return `size-${this.props.size}`;}
			},
			children: [{
				tagName: 'input',
				id: String(this.config?.props?.inputId) || '',
				props: {
					value: {
            handler: () => (this.config.data as ReferenceAttribute)?.value?.presentation || '',
            dependencies: [this.config.data as DataAttribute]
          },
				},
				events: {
					input: (e: Event) => {
						
					}
				}
			},
			{
				tagName: 'action-bar',
				children: [{
					tagName: 'action-button',
					events: {
						click: async() => {
							const ref = (this.config.data as ReferenceAttribute)?.value;
							const viewId = `${ref?.cube}.${ref?.className}.${ref?.model}.List`
							const chooseView = await Application.showView(viewId, { selectedItems: [ref] });
							chooseView.on('close', (e: CustomEvent) => {
								(this.data as ReferenceAttribute).value = e.detail[0].Reference.value;
							});
						}
					},
					children: [
						{
							tagName: 'icon',
              props: {
                variant: 'more_horiz'
              },
						}
					]
				}]
			}]
		};
	}
}

