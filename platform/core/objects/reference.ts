import { default as ApplicationClass} from '../application';
import { ViewParams } from '@/core/types';

declare var Application: ApplicationClass;

interface ReferenceProps {
  id: string;
  cube: string;
  className: string;
  model: string;
  presentation: string;
}
  
export default class Reference {
  #cube: string;
  #className: string;
  #model: string;
  #id: string;
  #presentation: string;

	constructor({ cube, className, model, id, presentation }: ReferenceProps) {
		this.#id = id;
    this.#cube = cube;
    this.#className = className;
    this.#model = model;
    this.#presentation = presentation;
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

  get id(): string {
    return this.#id;
  }

  get presentation(): string {
    return this.#presentation;
  }

	show(params?: ViewParams): void {
		Application.showView(
			`${this.#cube}.${this.#className}.${this.#model}.Instance`, 
			{ reference: this, ...params }
		)
	}

  [Symbol.toPrimitive](hint: string) {
    return this.#id;
  }
}
