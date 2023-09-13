
import { StandardProperties } from "csstype";
import { CustomElementProps, ElementDescription } from '@/types';
import { ElementEvents } from './dom';


export type ComponentProps<T extends ElementDescription> = {
  [Property in keyof CustomElementProps<T> as `p:${string & Property}`]?: CustomElementProps<T>[Property];
}

export type ComponentEvents<T extends HTMLElement = HTMLElement> = {
  [Event in keyof ElementEvents<T> as`e:${string & Event}`]?: string | ElementEvents<T>[Event];
}

export type ComponentStyle = {
  [Property in keyof StandardProperties as`s:${string & Property}`]?: StandardProperties[Property];
}

export type ComponentDataSource = {
  'd:path'?: string;
  'd:source'?: string;
}

export type Component<T extends ElementDescription, K extends HTMLElement = HTMLElement> = 
  ComponentProps<T> &
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
