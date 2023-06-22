export default {
	props: {
		label: {
			title: 'Label',
			mutable: true,
			responsive: true,
			type: 'string'
		},
		variant: {
			title: 'Variant',
			mutable: true,
			responsive: true,
			type: [
				{ value: 'default', title: 'Default', default: true },
				{ value: 'primary', title: 'Primary' },
				{ value: 'negative', title: 'Negative' },
			]
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
		treatment: {
			title: 'Treatment',
			mutable: true,
			responsive: true,
			type: [
				{ value: 'fill', title: 'Fill', default: true },
				{ value: 'outline', title: 'Outline' },
			]
		},
		disabled: {
			title: 'Disabled',
			mutable: true,
			responsive: true,
			type: 'boolean',
			defaultValue: false
		},
		processing: {
			title: 'Processing',
			mutable: true,
			type: 'boolean',
			defaultValue: false
		},
	}
} as const;
