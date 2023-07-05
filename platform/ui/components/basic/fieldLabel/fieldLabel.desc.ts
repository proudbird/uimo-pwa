export default {
	props: {
		value: {
			title: 'Value',
			mutable: true,
			responsive: true,
			type: 'string'
		},
		for: {
			title: 'For input',
			type: 'string'
		},
		size: {
			title: 'Size',
			mutable: true,
			responsive: true,
			type: [
				{ value: 'small', title: 'Small' },
				{ value: 'medium', title: 'Medium', default: true },
				{ value: 'large', title: 'Large' },
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
