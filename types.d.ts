
import { JSXElement } from './platform/types/jsx';

import { 
  ActionBarComponent,
  ActionButtonComponent,
  BoxComponent,
  ButtonComponent,
  CheckboxFieldComponent,
  IconComponent,
  InlineActionsComponent,
  LabelComponent,
  MenuComponent,
  MenuItemComponent,
  NumberFieldComponent,
  ReferenceFieldComponent,
  TableComponent,
  TreeViewComponent,
  TableFieldComponent,
  TabsComponent,
  TabsItemComponent,
  TextComponent,
  TextFieldComponent,
  WorkPanelComponent,
  ViewComponent
} from './platform/types/components';

declare namespace JSX {
  interface IntrinsicElements<V extends IView = any> {
    'view': JSXElement<ViewComponent>;
    'button': JSXElement<ButtonComponent>;
    'box': JSXElement<BoxComponent>;
    'checkbox': JSXElement<CheckboxFieldComponent>;
    'text': JSXElement<TextComponent>;
    'text-field': JSXElement<TextFieldComponent>;
    'number-field': JSXElement<NumberFieldComponent>;
    'reference-field': JSXElement<ReferenceFieldComponent>;
    'icon': JSXElement<IconComponent>;
    'label': JSXElement<LabelComponent>;
    'table': JSXElement<TableComponent>;
    'table-field': JSXElement<TableFieldComponent>;
    'tree-view': JSXElement<TreeViewComponent>;
    'tabs': JSXElement<TabsComponent>;
    'tabs-item': JSXElement<TabsItemComponent>;
    'menu': JSXElement<MenuComponent>;
    'menu-item': JSXElement<MenuItemComponent>;
    'action-bar': JSXElement<ActionBarComponent>;
    'action-button': JSXElement<ActionButtonComponent>;
    'inline-actions': JSXElement<InlineActionsComponent>;
    'work-panel': JSXElement<WorkPanelComponent>;
    'slot:fields': JSXElement<{}>;
    'slot:context-menu': JSXElement<{}>;
    'slot:tooltip': JSXElement<{}>;
    'slot:body': JSXElement<{}>;
    'slot:item': JSXElement<{}>;
  }
}

declare class Uimo {
  constructor(props: { pathToCubes: string });
  static(): string;
  index(root?: string): string;
  loadView(pathToCubes: string, viewId: string): Promise<any>;
  loadModule(cubeName: string, fileName: string, alias: string): Promise<any>;
  getAppStructure(id: string, cubes: string []): Promise<any>;
}

export as namespace Uimo;
