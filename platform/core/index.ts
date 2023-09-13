import { customElementFabric, DefineElement } from "./custom-element";
import { ElementDescription } from "@/types";
import { CustomElementDefinition, CustomElementOptions, ReturnClassType } from "./types";

export const CustomElement = customElementFabric as (
  <D extends CustomElementDefinition<any, any>>(definition: ElementDescription) => ReturnClassType<D>
);

export { DefineElement };
export type { 
  CustomElementDefinition, 
  CustomElementOptions 
};
