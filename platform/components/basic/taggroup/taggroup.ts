import { Component, DefineComponent } from '@/core';

import { specification, ITagGroupComponent } from './taggroup.types';

@DefineComponent('tag-group')
export default class TagGroup extends Component<ITagGroupComponent>(specification) {}

