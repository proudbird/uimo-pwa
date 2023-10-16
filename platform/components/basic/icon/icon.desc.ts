export default {
  props: {
    variant: {
      type: [
        { value: 'home', label: 'Home' },
        { value: 'dashboard', label: 'Dashboard' },
        { value: 'inventory_2', label: 'Inventory 2' },
        { value: 'close', label: 'Close' },
      ]
    },
    size: {
      type: 'string',
      responsible: true,
    }
  }
} as const;    
