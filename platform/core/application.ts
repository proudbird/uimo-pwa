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

  async showView(viewId: string, params?: any) {
    await loadModule(`view/${viewId}`);

    const viewDefinition = window.views[viewId];

    if(viewDefinition.error) {
      const errorContainer = document.createElement('div');
      errorContainer.innerHTML = `
        <h1>Error</h1>
        <p>${viewDefinition.error}</p>
      `;
      return errorContainer;
    }

    const { layout, data, getModule } = viewDefinition;
    const view = new View(layout, data, getModule, params);
    this.viewFrame.showView(view);
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