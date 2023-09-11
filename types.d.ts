import { StandardProperties } from "csstype";
import { CustomElementProps } from './platform/types.d'
import { ElementEvents } from './dom.d';
import { 
  BoxDescriptionType, 
  ButtonDescriptionType, 
  TextFieldDescriptionType, 
  NumberFieldDescriptionType,
  ViewDescriptionType 
} from "./platform/ui/components/types";

type ComponentProps<T> = {
  [Property in keyof T as `p:${string & Property}`]?: T[Property];
}

type ComponentEvents<T> = {
  [Event in keyof ElementEvents<T> as`e:${string & Event}`]?: string | ElementEvents<T>[Event];
}

type ComponentStyle = {
  [Property in keyof StandardProperties as`s:${string & Property}`]?: StandardProperties[Property];
}

type ComponentDataSource = {
  'd:path'?: string;
  'd:source'?: string;
}

type Component<T, K> = 
  ComponentProps<CustomElementProps<T>> &
  ComponentStyle & 
  ComponentEvents<K> & 
  ComponentDataSource &
  { 
    props?: T['props'];
    style?: StandardProperties;
    events?: ElementEvents<K>;
    data? : { path?: string; source?: string };
    children?: any 
  };

type ViewProps = ComponentProps<CustomElementProps<ButtonDescriptionType>>;
type ViewComponent = Component<ViewDescriptionType, HTMLDivElement>;

declare namespace JSX {
  interface IntrinsicElements {
    'view': Component<ViewDescriptionType, HTMLDivElement>;
    'button': Component<ButtonDescriptionType, HTMLButtonElement>;
    'box': Component<BoxDescriptionType, HTMLDivElement>;
    'textfield': Component<TextFieldDescriptionType, HTMLInputElement>;
    'text': Component<TextFieldDescriptionType, HTMLInputElement>;
    'numberfield': Component<NumberFieldDescriptionType, HTMLInputElement>;
    'table': any;
    'table-field': any;
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

type DynamicList = any;


export as namespace Uimo;
