import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
	build: {
		outDir: './public',
		sourcemap: 'inline',
	},
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
	},
	server: {
		proxy: {
			'/': {
				target: 'http://127.0.0.1:21021/',
				changeOrigin: true,
				bypass: function(req) {
					if (/\/(app)(.*)\/(view)\//.test(req.url || '')) {
						console.log(req.url);
						return null;
					}
					return req.url;
				},
			},
		},
	},
});
