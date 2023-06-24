import { ViewTemplate } from "@/types";

export default {
  tagName: '@view',
  children: [
    {
      tagName: '@box',
      alias: 'Container',
      children: [
        {
          tagName: '@label',
          alias: 'Label',
          props: {
            value: { dataPath: 'greeting', source: 'context' }
          }
        },
        {
          tagName: '@button',
          alias: 'StartButton',
          props: {
            label: 'Get started'
          },
          events: {
            click: 'onStartButtonClick'
          }
        },
      ]
    }
  ] 
} as ViewTemplate;
