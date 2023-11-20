export default {
	props: {
		label: {
			title: 'Label',
			mutable: true,
			responsive: true,
			type: 'string',
			defaultValue: 'Button'
		},
		variant: {
			title: 'Variant',
			mutable: true,
			responsive: true,
			type: [
				{ value: 'primary', title: 'Primary' },
				{ value: 'secondary', title: 'Secondary' },
				{ value: 'accent', title: 'Accent' },
				{ value: 'negative', title: 'Negative' },
			],
			defaultValue: 'primary'
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
		treatment: {
			title: 'Treatment',
			mutable: true,
			responsive: true,
			type: [
				{ value: 'fill', title: 'Fill' },
				{ value: 'outline', title: 'Outline' },
			],
			defaultValue: 'fill'
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
