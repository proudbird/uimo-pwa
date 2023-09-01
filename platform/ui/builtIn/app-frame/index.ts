import layout from './app-frame.layout';
import data from './app-frame.data';
import * as module from './app-frame';
import View from '../../core/view';

const getModule = (Me: View) => module;

export default { layout, data, getModule };