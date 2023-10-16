export default {
  props: {
    orientation: {
      type: [
        { value: 'horizontal', title: 'Horizontal' },
        { value: 'vertical', title: 'Vertical' },
      ],
      defaultValue: 'horizontal',
      responsive: true,
    }
  }
} as const;    
