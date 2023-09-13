
import { Component } from './platform/types/component';

import { 
  ButtonDescription,
  BoxDescription,
  TextDescription,
  TextFieldDescription,
  NumberFieldDescription,
  TableDescription, 
  TableFieldDescription,
  ViewDescription
} from './platform/ui/components/types';

declare namespace JSX {
  interface IntrinsicElements {
    'view': Component<ViewDescription>;
    'button': Component<ButtonDescription>;
    'box': Component<BoxDescription>;
    'text': Component<TextDescription>;
    'text-field': Component<TextFieldDescription>;
    'number-field': Component<NumberFieldDescription>;
    'table': Component<TableDescription>;
    'table-field': Component<TableFieldDescription>;
    'slot:fields': any;
    'slot:context-menu': any;
    'slot:tooltip': any;
  }
}

class Uimo {
  constructor(props: { pathToCubes: string });
  static(): string;
  index(): string;
  loadView(pathToCubes: string, viewId: string): Promise<any>;
  loadModule(pathToCubes: string, filename: string, moduleId: string): Promise<any>;
  initApp(params: any): Promise<any>;
}


export as namespace Uimo;
