
import { StandardProperties } from "csstype";
import { ComponentDefinition, ComponentProps, ComponentPropsFromDefinition, ComponentSpecification, DataSourceType } from '../core/types';
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

export type JSXElementDataSource = {
  'd:path'?: string;
  'd:source'?: DataSourceType;
}

export type JSXElement<T extends ComponentDefinition, K extends HTMLElement = HTMLElement> = 
  JSXElementProps<ComponentPropsFromDefinition<T>> &
  JSXElementStyle & 
  JSXElementEvents<K> & 
  JSXElementDataSource &
  { 
    props?: ComponentPropsFromDefinition<T>;
    style?: StandardProperties;
    events?: ElementEvents<K>;
    data? : { path?: string; source?: string };
    children?: JSXElement<ComponentDefinition>[] | string; 
  };
