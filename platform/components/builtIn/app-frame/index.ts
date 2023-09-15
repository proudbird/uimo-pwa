import View from '@/core/view';

import layout from './app-frame.layout';
import data from './app-frame.data';
import * as module from './app-frame';

const getModule = (View: View) => module;

export default { layout, data, getModule };
