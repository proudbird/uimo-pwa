declare var Application: Application;
declare var cubes: Record<string, any>;
declare var modules: Record<string, any>;
declare var views: Record<string, any>;
declare var defineGlobals: any;

declare interface Constructable {
  new (...args: any[]): any;
}
declare interface Application implements Constructable {
  id: string;
  appFrame: View;
}
