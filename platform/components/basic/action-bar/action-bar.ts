import { Component, DefineComponent } from '@/core';

import { specification, IActionBarComponent } from './action-bar.types';

@DefineComponent('action-bar')
export default class ActionBar extends Component<IActionBarComponent>(specification) {}

