import { Component, DefineComponent } from '@/core';
import { getProperty } from '@/core/fabric';

import { specification, IIconComponent } from './icon.types';
import { PropHandlerDefinition } from '@/core/types';

@DefineComponent('icon')
export default class Icon extends Component<IIconComponent>(specification) {
  render() {
    return {
      ...this.config,
      className: {
        handler: () => {
          const { set, variant } = getIconDefinition(this.props.variant);
          let passedClassName = getProperty(this.config.className) || '';
          let className = '';

          switch (true) {
            case set === 'mso':
              className = 'mso';
              break;
            case set === 'vsc':
              className = `codicon codicon-${variant}`;
              break;
            case set === 'urs':
              className = `urs fi-rs-${variant}`;
              break;
            default:
              break;
          }

          return `${passedClassName} ${className}`
        },
        dependencies: (this.config?.className as PropHandlerDefinition)?.dependencies
      },
      props: {
        innerHTML: {
          handler: () => {
            const { set, variant } = getIconDefinition(this.props.variant);
            if(set === 'mso') {
              return variant;
            } else {
              return '';
            }
          }
        }
      },
      style: {
        fontSize: this.props.size
      }
    }
  }
}

function getIconDefinition(icon: string) {
  let set = 'mso';
  let variant = '';

  const parts = icon.split(':');

  if(parts.length === 2) {
    set = parts[0];
    variant = parts[1];
  } else {
    variant = icon;
  }

  return { set, variant };
} 