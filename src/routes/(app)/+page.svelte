<script lang="ts">
  import { getQuizStage } from "$lib/helpers/get-quiz-stage";
  import { getStoredResult, getStoredUser, removeResult, removeUser } from "$lib/helpers/localstorage-utils";
  import { goto, invalidate } from "$app/navigation";
  import { INIT_DATA_RELOAD_INTERVAL, INIT_DEPENDENCY, LEADERBOARD_PAGE, QUIZ_PAGE } from "$lib/constants";
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
  import type { Stage, User } from "$lib/types";

  export let data: PageData;

  let intervalId: number;
  let quizStage: Stage = Stages.Pending;
  let restartTimer: (a: number) => void;
  let prevData = data;
  let countdownSeconds: number | undefined = undefined;
  let user: User | undefined = undefined;

  const result = getStoredResult();
  if (result && (data.lastResetTime !== result.lastResetTime || data.quizLaunchTime < 0)) removeResult();

  function restoreUser(data: PageData) {
    const storedUser = getStoredUser();
    if (!storedUser) return;
    if (storedUser.lastResetTime !== data.lastResetTime || data.quizLaunchTime < 0) {
      removeUser();
    } else {
      userStore.set(storedUser);
      user = storedUser;
    }
  }

  function resetData() {
    quizStage = Stages.Pending;
    countdownSeconds = undefined;
    const result = getStoredResult();
    if (result) removeResult();
    const storedUser = getStoredUser();
    if (storedUser) removeUser();
    userStore.set(undefined);
  }

  function updateInitData(data: PageData) {
    if (data.lastResetTime !== prevData.lastResetTime) {
      resetData();
    }
    if (data.quizLaunchTime <= 0) quizStage = Stages.Standby;
    else {
      const msTillStart = data.quizLaunchTime - data.serverTime;
      quizStage = getQuizStage(msTillStart, data.quizDuration);
      if (user) {
        if (countdownSeconds === undefined) {
          countdownSeconds = msTillStart ? Math.floor(msTillStart / 1000) : undefined;
        } else if (data.quizLaunchTime !== prevData.quizLaunchTime && restartTimer) {
          restartTimer(Math.floor(msTillStart / 1000));
        }
      }
    }
    prevData = data;
  }

  function checkInitData() {
    if (intervalId && (quizStage === Stages.Finished || quizStage === Stages.Running)) {
      clearInterval(intervalId);
      return;
    }
    invalidate(INIT_DEPENDENCY);
  }

  function startChecking() {
    intervalId = setInterval(checkInitData, INIT_DATA_RELOAD_INTERVAL);
  }

  restoreUser(data);

  $: if (data) {
    updateInitData(data);
  }

  $: user = $userStore;
  $: if (quizStage === Stages.Running && user) goto(QUIZ_PAGE);
  $: if (quizStage === Stages.Finished) goto(LEADERBOARD_PAGE);

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
  {#if quizStage !== Stages.Pending && quizStage !== Stages.Finished}
    <img class="banner" src={user === undefined && quizStage === Stages.Standby ? bannerBottom : bannerTop} alt="Quiz banner" />

    {#if user === undefined && quizStage === Stages.Running}
      <MissedQuizMessage />
    {/if}
    {#if user === undefined && quizStage === Stages.Standby}
      <Login lastResetTime={data.lastResetTime} />
    {/if}
    {#if user !== undefined && quizStage === Stages.Standby && countdownSeconds !== undefined}
      <Greeting userName={user.name} />
      <Timer {countdownSeconds} callback={() => (quizStage = Stages.Running)} bind:restartTimer />
    {/if}
  {/if}
</div>
