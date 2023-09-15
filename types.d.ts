
import { JSXElement } from './platform/types/jsx';

import { 
  IBoxComponent,
  IButtonComponent,
  ITextFieldComponent,
  INumberFieldComponent,
  ITableComponent,
  ITableFieldComponent,
  ITextComponent,
  IViewComponent
} from './platform/components/types';

declare namespace JSX {
  interface IntrinsicElements {
    'view': JSXElement<IViewComponent>;
    'button': JSXElement<IButtonComponent>;
    'box': JSXElement<IBoxComponent>;
    'text': JSXElement<ITextComponent>;
    'text-field': JSXElement<ITextFieldComponent>;
    'number-field': JSXElement<INumberFieldComponent>;
    'table': JSXElement<ITableComponent>;
    'table-field': JSXElement<ITableFieldComponent>;
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
