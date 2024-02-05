<script lang="ts">
  import "../../../styles.css";
  import {
    INIT_DEPENDENCY,
    KUB_CHECK_STATE_INTERVAL,
    LEADERS_DATA_LOAD_DELAY
  } from "$lib/constants";
  import { invalidate } from "$app/navigation";
  import { onDestroy } from "svelte";
  import Logo from "$lib/components/Logo.svelte";
  import Qr from "$lib/components/QR.svelte";
  import type { PageData } from "./$types";

  export let data: PageData;

  async function checkInitData() {
    if (hasFinished) clearInterval(intervalId);
    await invalidate(INIT_DEPENDENCY);
  }
  let intervalId: number = setInterval(checkInitData, KUB_CHECK_STATE_INTERVAL);
  $: hasFinished =
    data && data.startTimeISO && data.serverTime + LEADERS_DATA_LOAD_DELAY > data.startTime;

  onDestroy(() => clearInterval(intervalId));
</script>

<style>
  .kub {
    height: 100vh;
    width: 100vw;
    max-height: 720px;
    max-width: 1280px;

    background-color: var(--color-primary);
    background-image: var(--kub-bg);
    background-repeat: no-repeat;
    background-size: cover;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .block {
    width: 520px;
    height: 520px;
    border-radius: var(--rounded-xl);
  }
  .logo {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    background-color: var(--color-primary);
  }
  .tagline {
    margin-top: var(--spacing-extra-large);
    font-size: var(--font-size-xxl);
    font-weight: 700;
  }

  .info {
    background-color: var(--color-light);
    padding: 45px;
    display: flex;
    align-items: center;
  }
  .congrats-text {
    color: var(--color-dark);
    font-size: var(--font-size-xxxl);
    line-height: 1.5;
  }
</style>

<div class="kub">
  <div class="block logo">
    <Logo width={410} height={150} />
    <h1 class="tagline">#РусскийТульскийНаш!</h1>
  </div>
  <div class="block info">
    {#if !hasFinished}
      <Qr />
    {:else}
      <h1 class="h1 congrats-text">Поздравляем победителей!</h1>
    {/if}
  </div>
</div>
