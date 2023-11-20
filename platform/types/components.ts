/**
 * That file was added to make JSX work properly and pass components
 * props to JSX Elements. Passing the same types directly from
 * components 'types.ts' files doesn't work.
 */

import { ComponentDefinition } from '../core';

import {
  ActionBarExtraProps,
	ActionBarSpecification,
	ActionButtonExtraProps,
	ActionButtonSpecification,
	BoxSpecification,
	ButtonSpecification,
	IconExtraProps,
	IconSpecification,
	LabelSpecification,
	MenuExtraProps,
	MenuItemExtraProps,
	MenuItemSpecification,
	MenuSpecification,
	ModalExtraProps,
	ModalSpecification,
	NumberFieldSpecification,
	PopoverExtraProps,
	PopoverSpecification,
	ReferenceFieldExtraProps,
	ReferenceFieldSpecification,
	ReferenceInputExtraProps,
	ReferenceInputSpecification,
	TableFieldExtraProps,
	TableFieldSpecification,
	TableFilterPanelExtraProps,
	TableFilterPanelSpecification,
	TableSpecification,
	TabsBodyExtraProps,
	TabsBodySpecification,
	TabsExtraProps,
	TabsItemExtraProps,
	TabsItemSpecification,
	TabsItemsExtraProps,
	TabsItemsSpecification,
	TabsSpecification,
	TagExtraProps,
	TagSpecification,
	TaggroupExtraProps,
	TaggroupSpecification,
	TextFieldSpecification,
	TextSpecification,
	ViewSpecification,
	WorkPanelExtraProps,
	WorkPanelSpecification,
} from '../components/definitions';

export type ActionBarComponent = ComponentDefinition<typeof ActionBarSpecification, ActionBarExtraProps>;
export type ActionButtonComponent = ComponentDefinition<typeof ActionButtonSpecification, ActionButtonExtraProps>;
export type BoxComponent = ComponentDefinition<typeof BoxSpecification>;
export type ButtonComponent = ComponentDefinition<typeof ButtonSpecification>;
export type IconComponent = ComponentDefinition<typeof IconSpecification, IconExtraProps>;
export type LabelComponent = ComponentDefinition<typeof LabelSpecification>;
export type MenuComponent = ComponentDefinition<typeof MenuSpecification, MenuExtraProps>;
export type MenuItemComponent = ComponentDefinition<typeof MenuItemSpecification, MenuItemExtraProps>;
export type ModalComponent = ComponentDefinition<typeof ModalSpecification, ModalExtraProps>;
export type NumberFieldComponent = ComponentDefinition<typeof NumberFieldSpecification>;
export type PopoverComponent = ComponentDefinition<typeof PopoverSpecification, PopoverExtraProps>;
export type ReferenceFieldComponent = ComponentDefinition<typeof ReferenceFieldSpecification, ReferenceFieldExtraProps>;
export type ReferenceInputComponent = ComponentDefinition<typeof ReferenceInputSpecification, ReferenceInputExtraProps>;
export type TableComponent = ComponentDefinition<typeof TableSpecification>;
export type TableFieldComponent = ComponentDefinition<typeof TableFieldSpecification, TableFieldExtraProps>;
export type TableFilterPanelComponent = ComponentDefinition<typeof TableFilterPanelSpecification, TableFilterPanelExtraProps>;
export type TabsBodyComponent = ComponentDefinition<typeof TabsBodySpecification, TabsBodyExtraProps>;
export type TabsComponent = ComponentDefinition<typeof TabsSpecification, TabsExtraProps>;
export type TabsItemComponent = ComponentDefinition<typeof TabsItemSpecification, TabsItemExtraProps>;
export type TabsItemsComponent = ComponentDefinition<typeof TabsItemsSpecification, TabsItemsExtraProps>;
export type TagComponent = ComponentDefinition<typeof TagSpecification, TagExtraProps>;
export type TaggroupComponent = ComponentDefinition<typeof TaggroupSpecification, TaggroupExtraProps>;
export type TextComponent = ComponentDefinition<typeof TextSpecification>;
export type TextFieldComponent = ComponentDefinition<typeof TextFieldSpecification>;
export type ViewComponent = ComponentDefinition<typeof ViewSpecification>;
export type WorkPanelComponent = ComponentDefinition<typeof WorkPanelSpecification, WorkPanelExtraProps>;