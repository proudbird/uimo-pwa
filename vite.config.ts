import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
	build: {
		rollupOptions: {
			input: {path: 'index.html'},
			
		},
		outDir: 'dist',
		sourcemap: true,

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
					if (/\/(app)(.*)\/(session|login|init|cube|module|list|view|instance)\//.test(req.url || '')) {
						return null;
					}
					if (/\/(app)(.*)\/(view)\//.test(req.url || '')) {
						return null;
					}
					return req.url;
				},
			},
		},
	},
});
