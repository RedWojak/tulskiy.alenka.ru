<script lang="ts">
  import InputWithErrorIcon from "./InputWithErrorIcon.svelte";

  export let userName = "";

  let invalid: boolean | undefined = undefined;
  let placeholder = "Имя";
  let error = "";

  function validate() {
    invalid = userName === "";
  }

  $: if (!invalid) error = "";
  else error = "Слишком короткое имя";
</script>

<style>
  .invalid {
    border-color: var(--color-red);
    color: var(--color-red);
  }
</style>

<InputWithErrorIcon {invalid} {error}>
  <input
    class="text-input"
    type="text"
    class:invalid
    required
    {placeholder}
    bind:value={userName}
    on:change={validate}
    on:focus={() => (invalid = false)}
    on:blur={validate}
  />
</InputWithErrorIcon>
