import { ElementConfig } from "@/types";

export default {
  style: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  children: [{
    tagName: '@box',
    alias: 'container',
    style: {
      width: '400px',
      border: '1px solid #ccc',
      borderRadius: '4px',
    },
    children: [{
      tagName: '@box',
      alias: 'fields',
      style: { alignItems: 'center'},
      children: [
        // here Username and Password fields should be rendered
      ]}, {

      tagName: '@box',
      alias: 'toolbar',
      style: { alignItems: 'center' },
      children: [{
        tagName: '@button',
        alias: 'loginButton',
        props: { label: 'Log in' },
        style: { width: '120px' },
        events: { click: 'onLoginButtonClick' }
      }]}, {

      tagName: '@text',
      alias: 'message',
      props: { value: { dataPath: 'message' } }
    }]
  }] 
} as ElementConfig;
