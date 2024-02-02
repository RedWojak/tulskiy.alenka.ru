<script lang="ts">
  export let checked: boolean;
</script>

<style>
  .checkbox {
    outline: none;
    appearance: none;
    -webkit-appearance: none;
    font: inherit;
    width: 20px;
    height: 20px;
    margin-right: 4px;
    background-color: var(--color-light);
    border-radius: var(--rounded-sm);
  }

  .checkbox:hover {
    border: 1px solid var(--color-dark);
  }
  .checkbox:focus {
    border: 1px solid var(--color-dark);
  }

  .checkbox:checked {
    content: var(--check-icon-url);
    border: 1px solid var(--color-blue);
    background-color: var(--color-blue);
    padding: 1px 2px;
  }

  .checkbox:focus:checked {
    border: 1px solid var(--color-dark);
  }

  .label {
    display: flex;
  }
</style>

<label class="label">
  <input class="checkbox" type="checkbox" bind:checked />
  <slot />
</label>
