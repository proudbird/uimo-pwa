import { loadApp } from './core';

const ROOT_NAME = 'app';

const root = document.getElementById(ROOT_NAME);

if(!root) {
	console.log(`HTML page dosen't have the root container with id '${ROOT_NAME}'`); 
} else {
	loadApp(root);
}

