import { Component, DefineComponent } from '@/core';

import { specification, IIconComponent } from './icon.types';

@DefineComponent('icon')
export default class Icon extends Component<IIconComponent>(specification) {
  render() {
    return {
      ...this.config,
      props: {
        innerHTML: this.props.variant
      },
      style: {
        fontSize: this.props.size
      }
    }
  }
}

