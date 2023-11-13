
export default function loadModule(path: string): Promise<void> {

	return new Promise<void>((resolve, reject) => {

		const script = document.createElement('script');
		//@ts-ignore
		script.src = `${location.origin}/app/${window.Application.id}/${path}`;
		script.setAttribute('id', 'bundle');
		document.body.appendChild(script);

		script.onload = (e) => {
			resolve();
		};

		script.onerror = (error) => {
			console.log('error');
			reject(error);
		};
	});
}
