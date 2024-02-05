<script lang="ts">
  import { login } from "$lib/api";
  import { saveUser } from "$lib/helpers/localstorage-utils";
  import { user as userStore } from "$lib/stores";
  import Checkbox from "./Checkbox.svelte";
  import InputName from "./InputName.svelte";
  import InputTel from "./InputTel.svelte";
  import rulesSrc from "$lib/rules.pdf";
  import type { HttpError } from "@sveltejs/kit";
  import { invalidate } from "$app/navigation";
  import { INIT_DEPENDENCY } from "$lib/constants";

  export let lastResetTime: number | null = null;

  let checked = false;
  let disabled = true;
  let isValid = false;
  let phoneError = "";
  let phoneInvalid = false;
  let userName = "";
  let userPhone = "";

  $: isValid = userPhone !== "" && userName !== "";
  $: disabled = !checked || !isValid;
  async function handleSubmit() {
    disabled = true;
    const data = { name: userName, phone: userPhone };

    const response = await login(data);
    if (!response?.conflict) {
      const user = { name: userName, phone: userPhone, lastResetTime };
      saveUser(user);
      userStore.set(user);
      invalidate(INIT_DEPENDENCY);
    } else {
      phoneError = "Номер уже зарегистрирован";
      phoneInvalid = true;
      disabled = false;
    }
    disabled = false;
  }
</script>

<style>
  .login {
    z-index: 10;
  }
  .login-input {
    margin-bottom: var(--spacing-medium-small);
  }
  .login-button {
    margin-top: var(--spacing-huge);
  }

  .login-button:disabled {
    opacity: 0.5;
    cursor: default;
  }

  .login-rules {
    margin-top: var(--spacing-medium-large);
  }
  .rules-link {
    color: inherit;
  }
  .rules-text {
    cursor: pointer;
  }
</style>

<div class="container login">
  <h1 class="h2">Регистрация</h1>
  <form class="login-form" method="POST" on:submit|preventDefault={handleSubmit}>
    <div class="login-input">
      <InputName bind:userName />
    </div>
    <div class="login-input">
      <InputTel bind:userPhone bind:error={phoneError} bind:invalid={phoneInvalid} />
    </div>
    <button class="button login-button" {disabled}>Зарегистрироваться</button>
  </form>
  <div class="login-rules">
    <Checkbox bind:checked>
      <span class="rules-text"
        >Я ознакомился с <a class="rules-link" href={rulesSrc} target="_blank" rel="noreferrer"
          >правилами</a
        >
      </span>
    </Checkbox>
  </div>
</div>
