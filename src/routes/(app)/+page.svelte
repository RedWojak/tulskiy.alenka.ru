<script lang="ts">
  import {
    getStoredResult,
    getStoredUser,
    removeResult,
    removeUser
  } from "$lib/helpers/localstorage-utils";
  import {
    INIT_DATA_RELOAD_INTERVAL,
    INIT_DEPENDENCY,
    LEADERBOARD_PAGE,
    QUIZ_PAGE
  } from "$lib/constants";
  import { getQuizStage } from "$lib/helpers/get-quiz-stage";
  import { goto, invalidate } from "$app/navigation";
  import { onDestroy, onMount } from "svelte";
  import { Stages } from "$lib/types";
  import { user as userStore } from "$lib/stores";
  import bannerBottom from "$lib/images/banner2.png";
  import bannerTop from "$lib/images/banner.png";
  import Greeting from "$lib/components/Greeting.svelte";
  import Login from "$lib/components/Login.svelte";
  import MissedQuizMessage from "$lib/components/MissedQuizMessage.svelte";
  import Timer from "$lib/components/Timer.svelte";
  import type { PageData } from "./$types";
  import type { Stage } from "$lib/types";

  export let data: PageData;

  let intervalId: number;
  let quizStage: Stage = Stages.Pending;
  let restartTimer: (a: number) => void;
  let serverTime = data.serverTime;
  let startTime = data.startTime;
  let lastResetTime = data.lastResetTime;
  let startTimeISO = data.startTimeISO;
  $: if (data) {
    updateInitData(data);
    updateUser(data);
  }
  $: msTillStart = startTimeISO ? startTime - serverTime : undefined;
  $: user = $userStore;
  $: countdownSeconds = msTillStart ? Math.floor(msTillStart / 1000) : undefined;
  $: if (startTimeISO.length === 0) quizStage = Stages.Standby;
  $: if (msTillStart && startTimeISO.length > 0)
    quizStage = getQuizStage(msTillStart, data.quizDuration);
  $: if (quizStage === Stages.Running && user) goto(QUIZ_PAGE);
  $: if (quizStage === Stages.Finished) goto(LEADERBOARD_PAGE);
  $: if (lastResetTime) {
    const result = getStoredResult();
    if (lastResetTime !== result?.lastResetTime) removeResult();
  }

  function updateInitData(data?: PageData) {
    if (data) {
      lastResetTime = data.lastResetTime;
      serverTime = data.serverTime;
      startTime = data.startTime;
      startTimeISO = data?.startTimeISO;

      if (
        startTime &&
        serverTime &&
        (data.startTime !== startTime || lastResetTime !== data.lastResetTime)
      ) {
        restartTimer && restartTimer(Math.floor(startTime - serverTime / 1000));
      }
    }
  }
  function updateUser(data?: PageData) {
    if (!user) {
      const storedUser = getStoredUser();
      if (!storedUser) return;

      if (
        (data && data.startTimeISO.length === 0) ||
        (data?.lastResetTime && storedUser.lastResetTime !== data.lastResetTime)
      ) {
        removeUser();
      } else {
        userStore.set(storedUser);
      }
    } else {
      if (
        (data?.lastResetTime && user.lastResetTime !== data.lastResetTime) ||
        (data && data.startTimeISO.length === 0)
      ) {
        removeUser();
        userStore.set(undefined);
      }
    }
  }

  async function checkInitData() {
    if (intervalId && (quizStage === Stages.Finished || quizStage === Stages.Running)) {
      clearInterval(intervalId);
      return;
    }
    invalidate(INIT_DEPENDENCY);
  }
  function startChecking() {
    intervalId = setInterval(checkInitData, INIT_DATA_RELOAD_INTERVAL);
  }

  updateUser(data);
  onMount(async () => {
    startChecking();
  });

  onDestroy(() => {
    if (intervalId) clearInterval(intervalId);
  });
</script>

<style>
  .banner {
    margin-top: -15%;
    margin-bottom: -15%;
    width: 100%;
  }
  .wrapper {
    display: flex;
    flex-direction: column;
    position: relative;
  }
  .reverse {
    flex-direction: column-reverse;
  }
</style>

<div class="wrapper" class:reverse={user === undefined && quizStage === Stages.Standby}>
  {#if quizStage !== Stages.Pending}
    <img
      class="banner"
      src={user === undefined && quizStage === Stages.Standby ? bannerBottom : bannerTop}
      alt="Quiz banner"
    />

    {#if user === undefined && quizStage !== Stages.Standby}
      <MissedQuizMessage />
    {:else if user === undefined}
      <Login {lastResetTime} />
    {:else if user !== undefined && quizStage === Stages.Standby && countdownSeconds !== undefined}
      <Greeting userName={user.name} />
      <Timer {countdownSeconds} callback={() => (quizStage = Stages.Running)} bind:restartTimer />
    {/if}
  {/if}
</div>
