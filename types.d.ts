
import { JSXElement } from './platform/types/jsx';

import { 
  ActionBarComponent,
  ActionButtonComponent,
  BoxComponent,
  ButtonComponent,
  CheckboxFieldComponent,
  IconComponent,
  LabelComponent,
  MenuComponent,
  MenuItemComponent,
  NumberFieldComponent,
  ReferenceFieldComponent,
  TableComponent,
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
    'tabs': JSXElement<TabsComponent>;
    'tabs-item': JSXElement<TabsItemComponent>;
    'menu': JSXElement<MenuComponent>;
    'menu-item': JSXElement<MenuItemComponent>;
    'action-bar': JSXElement<ActionBarComponent>;
    'action-button': JSXElement<ActionButtonComponent>;
    'work-panel': JSXElement<WorkPanelComponent>;
    'slot:fields': JSXElement<{}>;
    'slot:context-menu': JSXElement<{}>;
    'slot:tooltip': JSXElement<{}>;
    'slot:body': JSXElement<{}>;
  }
}

declare class Uimo {
  constructor(props: { pathToCubes: string });
  static(): string;
  index(): string;
  loadView(pathToCubes: string, viewId: string): Promise<any>;
  loadModule(pathToCubes: string, filename: string, moduleId: string): Promise<any>;
  initApp(params: any): Promise<any>;
}

export as namespace Uimo;
