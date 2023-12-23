
export default function initCourier(): Courier {
  try {
    //@ts-ignore
    const vscode = acquireVsCodeApi();
    return new VSCodeCourier(vscode);
  } catch(error) {
    return new HTTPCourier();
  }
}

export interface Courier {
  post(topic: string, body?: any): Promise<any>;
}

export class HTTPCourier implements Courier {

  constructor() {

  }

  async post(topic: string, body: any) {
    //@ts-ignore
    const response = await fetch(`/app/${window.__APP_ID__}/${topic}/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    const result = await response.json();

    return result;
  }
}

export class VSCodeCourier implements Courier {
  #vscode: any;
  #messageId: number = 0;

  constructor(vscode: any) {
    this.#vscode = vscode;
  }

  async post(topic: string, body?: any) {

    const messageId = this.#messageId++;

    return new Promise((resolve, reject) => {
      const handler = ({ data }: any) => {
  
        if(data.messageId === messageId) {
          resolve(data.body);
          window.removeEventListener('message', handler);
        }
      };
  
      window.addEventListener('message', handler);
  
      this.#vscode.postMessage({
        messageId,
        topic,
        body
      });
    });
  }
}