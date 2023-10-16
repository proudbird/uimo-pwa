
<ui-box e:click={'click'} p:size='small' a:role='button' s:justifyContent='center' className='test'>
  <ui-button e:blur={(e) => console.log(`${Math.random()}`)}>Click</ui-button>
  <slot:item>
    <ui-button e:click={(e) => console.log(`${Math.random()}`)}>Click</ui-button>
  </slot:item>
</ui-box>
