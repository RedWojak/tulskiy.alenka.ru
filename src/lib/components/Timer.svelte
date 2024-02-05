<script lang="ts">
  import { TIMER_INTERVAL } from "$lib/constants";
  import { onDestroy, onMount } from "svelte";

  export let countdownSeconds: number;
  export let callback: () => void;
  export let hideMinutes = false;

  let intervalId: number | undefined;
  let remained: number;
  let endTime: number;

  function startTimer() {
    endTime = Math.floor(Date.now() / 1000) + countdownSeconds;

    remained = endTime - Math.floor(Date.now() / 1000);
    intervalId = setInterval(() => {
      remained = endTime - Math.floor(Date.now() / 1000);
      if (remained < 0) {
        clearInterval(intervalId);
        intervalId = undefined;
        callback();
      }
    }, TIMER_INTERVAL);
  }

  export function restartTimer(newCountdown: number) {
    if (intervalId !== undefined) clearInterval(intervalId);
    countdownSeconds = newCountdown;
    startTimer();
  }

  onMount(startTimer);

  onDestroy(() => {
    if (intervalId !== undefined) clearInterval(intervalId);
  });

  $: minutes = String(Math.floor(remained / 60)).padStart(2, "0");
  $: seconds = String(remained % 60).padStart(2, "0");
</script>

<style>
  .wrapper {
    display: flex;
    justify-content: center;
  }

  .timer {
    width: 128px;
    height: 108px;

    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
  }

  .time {
    position: absolute;
    width: 100%;

    padding: 0 6px;
    display: flex;
    justify-content: center;

    background-color: var(--color-light);
    border-radius: var(--rounded-lg);
    color: var(--color-dark);
    font-size: var(--font-size-xl);
  }
  .time-part {
    width: 45%;
    margin: 0 4px;

    overflow: hidden;
  }

  .minutes-part {
    text-align: end;
  }
  .seconds-part_center {
    text-align: center;
  }
</style>

<div class="wrapper">
  {#if remained >= 0}
    <div class="timer">
      <svg
        width="91"
        height="94"
        viewBox="0 0 91 94"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M78.3724 9.81111C95.2417 24.7912 94.3747 53.538 76.1617 74.0479C57.9487 94.5578 29.506 98.817 12.6367 83.837C-4.23259 68.8569 -3.36562 40.1101 14.8474 19.6002C33.0604 -0.909721 61.5031 -5.16898 78.3724 9.81111Z"
          stroke="white"
        />
      </svg>
      <div class="time">
        {#if !hideMinutes}
          <span class="time-part minutes-part">{minutes}</span>:
        {/if}
        <span class="time-part" class:seconds-part_center={hideMinutes}>{seconds}</span>
      </div>
    </div>
  {/if}
</div>
