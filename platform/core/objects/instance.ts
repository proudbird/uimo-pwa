export interface InstanceProps {
  cube: string;
  className: string;
  model: string;
  id: string;
}

export default class Instance {
  #cube: string;
  #className: string;
  #model: string;
  #id: string;

  constructor({ cube, className, model, id }: InstanceProps) {
    this.#cube = cube;
    this.#className = className;
    this.#model = model;
    this.#id = id;
  }

  get id(): string {
    return this.#id;
  }

  get cube(): string {  
    return this.#cube;
  }

  get className(): string {
    return this.#className;
  }

  get model(): string {
    return this.#model;
  }
}