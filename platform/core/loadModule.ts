
export default function loadModule(path: string): Promise<void> {

	return new Promise<void>((resolve, reject) => {

		const script = document.createElement('script');
		script.src = path;
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
