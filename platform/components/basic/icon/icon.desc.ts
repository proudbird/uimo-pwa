export default {
  props: {
    variant: {
      type: [
        { value: 'home', label: 'Home' },
        { value: 'dashboard', label: 'Dashboard' },
        { value: 'inventory_2', label: 'Inventory 2' },
        { value: 'close', label: 'Close' },
        { value: 'more-horiz', label: 'More Horiz' },
      ]
    },
    size: {
      type: 'string',
      responsible: true,
    }
  }
} as const;    
