import { Component, DefineComponent } from '@/core';

import { specification, IPopoverComponent } from './popover.types';

@DefineComponent('popover')
export default class Popover extends Component<IPopoverComponent>(specification) {}

