import { Component, DefineComponent } from '@/core';

import { specification, ICheckboxComponent } from './checkbox.types';

@DefineComponent('checkbox')
export default class Checkbox extends Component<ICheckboxComponent>(specification) {}
