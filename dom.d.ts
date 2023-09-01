import { DragEventHandler, MouseEventHandler, FormEventHandler } from "react";

export interface ElementEvents<T> {
    // MouseEvents
  auxclick?: MouseEventHandler<T> | undefined;
  click?: MouseEventHandler<T> | undefined;
  contextmenu?: MouseEventHandler<T> | undefined;
  doubleclick?: MouseEventHandler<T> | undefined;
  drag?: DragEventHandler<T> | undefined;
  dragend?: DragEventHandler<T> | undefined;
  dragenter?: DragEventHandler<T> | undefined;
  dragexit?: DragEventHandler<T> | undefined;
  dragleave?: DragEventHandler<T> | undefined;
  dragover?: DragEventHandler<T> | undefined;
  dragstart?: DragEventHandler<T> | undefined;
  drop?: DragEventHandler<T> | undefined;
  mousedown?: MouseEventHandler<T> | undefined;
  mousednter?: MouseEventHandler<T> | undefined;
  mouseleave?: MouseEventHandler<T> | undefined;
  mousemove?: MouseEventHandler<T> | undefined;
  mouseout?: MouseEventHandler<T> | undefined;
  mouseover?: MouseEventHandler<T> | undefined;
  mouseup?: MouseEventHandler<T> | undefined;

  // Form Events
  change?: FormEventHandler<T> | undefined;
  beforeinput?: FormEventHandler<T> | undefined;
  input?: FormEventHandler<T> | undefined;
  reset?: FormEventHandler<T> | undefined;
  submit?: FormEventHandler<T> | undefined;
  invalid?: FormEventHandler<T> | undefined;
}