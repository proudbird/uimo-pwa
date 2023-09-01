type Cubes = Record<string, AppObjects>;
type AppObjects = Record<string, string[]>;

export default function defineGlobals(source: string, cubeName: string, triggers: string[]): { cubes: Cubes; objects: AppObjects, cube: string } {
	// Create the pattern with the injected triggers
	const pattern = new RegExp(
		`((\\w+|\\w+\\n+\\s*|\\s+)\\.)?(${triggers.join('|')})((\\.\\w+|\\n+|\\s+|\\(\\.+\\)))+`,
		'gm'
	);

	const cubes = {} as Cubes;
	const objects = {} as AppObjects;

	const convertedCode = source;
	let match;
	while ((match = pattern.exec(convertedCode)) !== null) {
		const [full, prefix, key, trigger, suffix] = match;
		if (key) {
			cubes[key] = cubes[key] || {};
			cubes[key][trigger] = cubes[key][trigger] || [];
      
			for (const trig of triggers) {
				const pattern2 = new RegExp(`${trig}`);
				const matches = pattern2.exec(full)!;
				if(matches) {
					console.log(matches.input.split(`${trig}.`)[1]);
					const base = matches.input.split(`${trig}.`)[1];
					cubes[key][trigger].push(base.replace(suffix, ''));
				}
			}
		} else {
			objects[trigger] = cubes[cubeName][trigger] || objects[trigger] || [];
			cubes[cubeName] = cubes[cubeName] || {};
			for (const trig of triggers) {
				const pattern2 = new RegExp(`${trig}`);
				const matches = pattern2.exec(full)!;
				if(matches) {
					console.log(matches.input.split(`${trig}.`)[1]);
					const base = matches.input.split(`${trig}.`)[1];
					objects[trigger].push(base.replace(suffix, ''));
				}
			}
		}
	}

	return { cubes, objects, cube: cubeName };
}
