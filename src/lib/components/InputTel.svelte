<script lang="ts">
  import {
    getCountryCallingCode,
    parsePhoneNumber,
    validatePhoneNumberLength
  } from "libphonenumber-js";
  import { DEFAULT_COUNTRY } from "$lib/constants";
  import { tick } from "svelte";
  import InputWithErrorIcon from "./InputWithErrorIcon.svelte";
  import type { CountryCallingCode } from "libphonenumber-js";

  export let error = "";
  export let invalid: boolean | undefined = undefined;
  export let userPhone = "";

  let currentCode: CountryCallingCode = getCountryCallingCode(DEFAULT_COUNTRY);
  let input: HTMLInputElement;
  let placeholder = "(999) 000-00-00";
  let prevValue = "";
  let value = "";

  async function setCursor(selection: number) {
    await tick();
    input.setSelectionRange(selection, selection);
  }

  function getFullName(value: string) {
    return "+" + currentCode + value;
  }
  function validatePhone(value: string) {
    return validatePhoneNumberLength(getFullName(value));
  }

  function calcCursorPosition(value: string, currentSelection: number) {
    let selection = currentSelection;
    const subValue = value.substring(0, currentSelection);
    const formatted = formatStrAsPhone(subValue);
    const offset = formatted.length! - subValue.length;
    selection = currentSelection + offset;
    return selection;
  }

  function formatStrAsPhone(value: string) {
    const normalized = value.replaceAll(" ", "");
    const result = normalized.split("").reduce((acc, char, idx) => {
      if (idx === 3 || idx === 6 || idx === 8 || idx === 10) {
        return `${acc} ${char}`;
      } else return `${acc}${char}`;
    }, "");
    return result;
  }

  function setUserPhone(value: string) {
    try {
      userPhone = parsePhoneNumber(getFullName(value), DEFAULT_COUNTRY).number;
    } catch (e) {
      userPhone = "";
    }
  }

  function setValidity(isValid: boolean) {
    if (isValid) {
      invalid = false;
      error = "";
    } else {
      invalid = true;
      error = "Неверный формат";
    }
  }
  function handleInput(event: Event) {
    setValidity(true);

    const validateResult = validatePhone(value);
    if (validateResult === "TOO_SHORT" || validateResult === undefined) {
      const selection = calcCursorPosition(value, (<HTMLInputElement>event.target).selectionStart!);
      const formatted = formatStrAsPhone(value);
      value = formatted;
      setCursor(selection);
      prevValue = formatted;
      if (validateResult === "TOO_SHORT") {
        setUserPhone("");
      } else {
        setUserPhone(value);
      }
    } else {
      const offset = value.length - prevValue.length;
      const selection = (<HTMLInputElement>event.target).selectionStart! - offset;
      value = prevValue;
      setCursor(selection);
    }
  }
  function handleBlur() {
    if (validatePhone(value) === undefined) {
      setValidity(true);
      setUserPhone(value);
    } else {
      setValidity(false);
      setUserPhone("");
    }
  }
</script>

<style>
  .phone-field {
    padding-left: calc(2 * var(--spacing-medium-large));
  }

  .region {
    position: absolute;
    top: 0;
    left: 0;

    width: calc(1.7 * var(--spacing-medium-large));
    padding: var(--spacing-medium) 0;

    display: flex;
    justify-content: end;
    border: 1px solid transparent;
    color: var(--color-dark);
  }
  .region__invalid {
    color: var(--color-red);
  }

  .phone-field__invalid {
    border-color: var(--color-red);
    color: var(--color-red);
  }
</style>

<InputWithErrorIcon {invalid} {error}>
  <div class="region" class:region__invalid={invalid}>
    +{currentCode}
  </div>
  <input
    class="text-input phone-field"
    type="tel"
    class:phone-field__invalid={invalid}
    required
    {placeholder}
    bind:this={input}
    bind:value
    on:input={handleInput}
    on:focus={() => setValidity(true)}
    on:blur={handleBlur}
  />
</InputWithErrorIcon>
