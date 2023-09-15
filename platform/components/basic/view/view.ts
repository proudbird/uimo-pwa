import { Component, DefineComponent } from '@/core';

import { specification, IViewComponent } from './view.types';

@DefineComponent('view')
export default class View extends Component<IViewComponent>(specification) {}
