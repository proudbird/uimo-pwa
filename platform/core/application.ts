import View from './view';
import loadModule from './loadModule';

export default class Application {
  #id: string;
  #appFrame: View | null = null;
  #viewFrame: View | null = null;

  constructor() {
    const pathParts = location.pathname.split('/');
    if(pathParts[1] === 'app' && pathParts.length >= 3 && pathParts[2]) {
      this.#id = pathParts[2];
    } else {
      throw new Error('Application id is not defined');
    }
  }

  get id(): string {
    return this.#id;
  }

  set appFrame(view: View) {
    if(this.#appFrame) {
      throw new Error('Application frame already defined');
    }
    this.#appFrame = view;
  }

  get appFrame(): View {
    if(!this.#appFrame) {
      throw new Error('Application frame is not defined');
    }
    return this.#appFrame;
  }

  set viewFrame(view: View) {
    this.#viewFrame = view;
  }

  get viewFrame(): View {
    if(!this.#viewFrame && !this.#appFrame) {
      throw new Error('View frame is not defined');
    }
    return this.#viewFrame || this.#appFrame!;
  }

  async showView(viewId: string, params?: any, target: 'app-frame' | 'view-frame' = 'view-frame') {
    if(!window.views[viewId]) {
      await loadModule(`view/${viewId}`);
    }

    const viewDefinition = window.views[viewId];

    if(viewDefinition.error) {
      const errorContainer = document.createElement('div');
      errorContainer.innerHTML = `
        <h1>Error</h1>
        <p>${viewDefinition.error}</p>
      `;
      return errorContainer;
    }

    const { layout, data, style, getModule } = viewDefinition;

    if(style) {
      let styleElement = document.getElementById(`style-${viewId}`);
      if(!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = `style-${viewId}`;
        document.head.appendChild(styleElement);
      }
      styleElement.innerHTML = style;
    }

    const view = new View(viewId, layout, data, getModule, params);
    // TODO: we need change the way of creating view, because now 
    // every time we want show a view we create a new instance of it,
    // even if it is in memory already

    if(target === 'view-frame') {
      this.viewFrame.showView(view);
    } else {
      this.appFrame.showView(view);
    }

    return view;
  }

  async getSession(login: string, password: string) {
    const response = await fetch(`${location.origin}/app/${this.#id}/session/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.json();
  }

  async login(login: string, password: string) {
    const response = await fetch(`${location.origin}/app/${this.#id}/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        login,
        password
      })
    });
    return response.json();
  }
}