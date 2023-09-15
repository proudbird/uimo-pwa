
import { JSXElement } from './platform/types/jsx';

import {
  IBoxComponent,
  IButtonComponent,
  INumberFieldComponent,
  ITableComponent,
  ITableFieldComponent,
  ITextComponent,
  ITextFieldComponent,
  IViewComponent
} from './platform/components/types';

import { 
  BoxComponent,
  ButtonComponent,
  NumberFieldComponent,
  TableComponent,
  TableFieldComponent,
  TextComponent,
  TextFieldComponent,
  ViewComponent
} from './platform/types/components';

declare namespace JSX {
  interface IntrinsicElements {
    'view': JSXElement<ViewComponent>;
    'button': JSXElement<ButtonComponent>;
    'box': JSXElement<BoxComponent>;
    'text': JSXElement<TextComponent>;
    'text-field': JSXElement<TextFieldComponent>;
    'number-field': JSXElement<NumberFieldComponent>;
    'table': JSXElement<TableComponent>;
    'table-field': JSXElement<TableFieldComponent>;
    'slot:fields': any;
    'slot:context-menu': any;
    'slot:tooltip': any;
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
