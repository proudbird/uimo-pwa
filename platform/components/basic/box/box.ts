import { Component, DefineComponent } from '@/core';

import { specification, IBoxComponent } from './box.types';

@DefineComponent('box')
export default class Box extends Component<IBoxComponent>(specification) {}
