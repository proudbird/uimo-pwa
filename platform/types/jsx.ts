
import { StandardProperties } from "csstype";
import { ComponentDefinition, ComponentPropsFromDefinition, DataSourceType } from '../core/types';
import { ElementEvents } from './dom';

export type JSXElementProps<T> = {
  [Property in keyof T as `p:${string & Property}`]?: T[Property];
}

export type JSXElementStyle = {
  [Property in keyof StandardProperties as`s:${string & Property}`]?: StandardProperties[Property];
}

export type JSXElementEvents<T extends HTMLElement = HTMLElement> = {
  [Event in keyof ElementEvents<T> as`e:${string & Event}`]?: string | ElementEvents<T>[Event];
}

export type JSXElementSpecificEvents<T extends ComponentDefinition<any>> = {
  [Event in T['events'] as`e:${string & Event}`]?: string;
}

export type JSXElementDataSource = {
  'd:path'?: string;
  'd:source'?: DataSourceType;
  'id'? : string;
  'alias'? : string;
  'className'? : string;
}

export type JSXElement<T extends ComponentDefinition<any>, K extends HTMLElement = HTMLElement> = 
  JSXElementProps<ComponentPropsFromDefinition<T>> &
  JSXElementStyle & 
  JSXElementEvents<K> & 
  JSXElementSpecificEvents<T> & 
  JSXElementDataSource &
  { 
    props?: ComponentPropsFromDefinition<T>;
    style?: StandardProperties;
    events?: ElementEvents<K>;
    data? : { path?: string; source?: string };
    children?: JSXElement<ComponentDefinition<any>> | JSXElement<ComponentDefinition<any>>[] | string; 
  };
