export default {
  props: {
    size: {
			title: 'Size',
			mutable: true,
			responsive: true,
			type: [
				{ value: 'extra-small', title: 'Extra small' },
				{ value: 'small', title: 'Small' },
				{ value: 'medium', title: 'Medium', default: true },
				{ value: 'large', title: 'Large' },
				{ value: 'extra-large', title: 'Extra large' },
			],
			defaultValue: 'medium'
		},
    disabled: {
			title: 'Disabled',
			mutable: true,
			responsive: true,
			type: 'boolean',
			defaultValue: false
		},
  }
} as const;    
