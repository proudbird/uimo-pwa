export default {
	props: {
		template: {
			type: 'string',
		},
		selectionMode: {
			type: [
				{ value: 'none', title: 'None' },
				{ value: 'single', title: 'Single' },
				{ value: 'multiple', title: 'Multiple' },
			],
			defaultValue: 'none'
		}
	}
} as const;
