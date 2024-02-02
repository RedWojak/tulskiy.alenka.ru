<script lang="ts">
  export let invalid: boolean = false;
  export let error = "";
</script>

<style>
  .wrapper {
    position: relative;
  }
  .tooltip {
    width: fit-content;

    padding: 7px var(--spacing-medium);

    position: absolute;
    top: -30px;
    left: 17px;

    text-align: center;

    border: 1px solid var(--color-red);
    border-radius: var(--rounded);

    z-index: 10;

    background: var(--color-light);
    color: var(--color-red);
  }

  .tooltip::after {
    content: "";
    width: 7px;
    height: 7px;

    position: absolute;
    bottom: -4.2px;
    left: 10px;

    border-bottom: 1px solid var(--color-red);
    border-right: 1px solid var(--color-red);

    background: inherit;
    transform: rotate(45deg);
  }
  .error {
    position: absolute;
    top: 13px;
    right: var(--spacing-huge);
    display: inline-flex;
    justify-content: center;
    width: 22px;
    height: 22px;
    color: var(--color-red);
  }
  .error-icon {
    width: 100%;
    height: 100%;
    background: url("$lib/images/error.svg") no-repeat;
  }
</style>

<div class="wrapper">
  {#if invalid}
    <div class="tooltip">{error}</div>
  {/if}
  <slot />
  {#if invalid}
    <div class="error">
      <span class="error-icon" />
    </div>
  {/if}
</div>
