import { VSCodeCourier } from "./courier";

export default function loadModule(type: string, id?: string): Promise<void> {

	return new Promise<void>(async (resolve, reject) => {

		const script = document.createElement('script');

			//@ts-ignore
		if(Application.courier instanceof VSCodeCourier) {
			//@ts-ignore
			const code = (await Application.courier.post(type, { id })) as string;
			script.innerText = code;
			resolve();
		} else {
			//@ts-ignore
			script.src = `${location.origin}/app/${window.Application.id}/${type}${id ? `/${id}` : ''}`;
		}

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
