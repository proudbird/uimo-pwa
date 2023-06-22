import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
	resolve: {
		alias:[
			{
				find: /~(.+)/,
				replacement: path.join(__dirname, 'node_modules/$1'),
			},
			{
				find: /@\//,
				replacement: path.join(__dirname, 'platform/'),
			},
			{
				find: /app\//,
				replacement: path.join(__dirname, 'app/'),
			},
		]
	}
});
