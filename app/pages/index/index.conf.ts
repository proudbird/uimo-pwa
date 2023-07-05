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
      width: '300px',
      border: '1px solid #ccc',
      borderRadius: '4px',
      padding: '20px',
    },
    children: [{
      tagName: '@box',
      alias: 'fields',
      style: { alignItems: 'center'},
      children: [{
        tagName: '@textfield',
        alias: 'username',
        props: { 
          label: 'Username',
          value: { dataPath: 'username' } },
      }]}, {

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
      alias: 'info',
      props: { value: { dataPath: 'username' } }
      }, {

      tagName: '@text',
      alias: 'message',
      props: { value: { dataPath: 'message' } }
    }]
  }] 
} as ElementConfig;
