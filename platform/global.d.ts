declare var __APP_ID__: string;
declare var Application: Application;
declare var cubes: Record<string, any>;
declare var modules: Record<string, any>;
declare var views: Record<string, any>;
declare var defineGlobals: any;

declare interface Constructable {
  new (...args: any[]): any;
}
declare interface Application {
  id: string;
  appFrame: any;
  showView: (viewId: string, params: Record<string, any>) => any;
  courier: any;
}
