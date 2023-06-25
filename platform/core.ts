import './ui/components';
import './style.scss';

import View from './ui/core/view';

export async function loadApp(root: HTMLElement): Promise<void> {
	const app = await defineApp();
	if(app) {
		root.appendChild(app);
	}
}

export async function defineApp(): Promise<HTMLElement | undefined> {

	const viewConfig = (await import('app/pages/index/index.conf')).default;
	const viewModule = (await import('app/pages/index/index'));
	const viewState = (await import('app/pages/index/index.state')).default;

	const view = new View(viewConfig, viewState, viewModule);

	return view.node;
}
