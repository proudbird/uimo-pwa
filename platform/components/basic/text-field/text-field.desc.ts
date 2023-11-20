export default {
	props: {
		label: {
			title: 'Label',
			mutable: true,
			responsive: true,
			type: 'string'
		},
		labelPosition: {
			title: 'Label Position',
			mutable: true,
			responsive: true,
			type: [
				{ value: 'left', title: 'Left' },
				{ value: 'top', title: 'Top' },
			],
			defaultValue: 'top'
		},
		value: {
			title: 'Value',
			mutable: true,
			responsive: true,
			type: 'string'
		},
		size: {
			title: 'Size',
			mutable: true,
			responsive: true,
			type: [
				{ value: 'small', title: 'Small' },
				{ value: 'medium', title: 'Medium' },
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
