import { ElementConfig } from "@/types";

export default {
 children: [
  {
    tagName: '@box',
    alias: 'Container',
    children: [
      {
        tagName: '@label',
        alias: 'Label',
        props: {
          value: 'greeting'
        }
      },
      {
        tagName: '@button',
        alias: 'StartButton',
        props: {
          label: 'Get started'
        },
        events: [
          {
            click: 'onStartButtonClick'
          }
        ]
      },
    ]
  }
 ] 
} as ElementConfig;
