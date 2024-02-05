<script lang="ts">
  import { calcScore } from "$lib/helpers/calc-score";
  import { FALLBACK_LEADERS } from "./fallback";
  import { getQuizStage } from "$lib/helpers/get-quiz-stage";
  import { goto } from "$app/navigation";
  import { PUBLIC_BASE_URL, PUBLIC_LEADERS } from "$env/static/public";
  import { QUIZ_PAGE, RESULT_PAGE } from "$lib/constants/pages";
  import { sleep } from "$lib/helpers/sleep";
  import { Stages } from "$lib/types";
  import {
    getStoredResult,
    getStoredUser,
    removeResult,
    removeUser
  } from "$lib/helpers/localstorage-utils";
  import {
    HOME_PAGE,
    LEADERS_OLD_DATA_RELOAD_COUNT,
    LEADERS_CURRENT_DATA_RELOAD_COUNT,
    LEADERS_DATA_RELOAD_INTERVAL,
    LEADERS_DATA_LOAD_DELAY
  } from "$lib/constants";
  import type { Leader, LeaderboardResponse, Stage } from "$lib/types";
  import type { PageData } from "./$types";

  export let data: PageData;

  let user = getStoredUser();
  let result = getStoredResult();

  const DATA_OLD_AFTER = 60000;

  let msTillStart = data.startTimeISO.length > 0 ? data.startTime - data.serverTime : undefined;
  const maxRetries =
    msTillStart && msTillStart + data.quizDuration + LEADERS_DATA_LOAD_DELAY + DATA_OLD_AFTER > 0
      ? LEADERS_OLD_DATA_RELOAD_COUNT
      : LEADERS_CURRENT_DATA_RELOAD_COUNT;
  let quizStage: Stage = Stages.Pending;
  let leaders: Leader[] | undefined = undefined;
  let position: number | undefined = undefined;

  $: if (data.startTimeISO.length === 0) quizStage = Stages.Standby;
  $: if (msTillStart) quizStage = getQuizStage(msTillStart, data.quizDuration);
  $: if (quizStage === Stages.Standby) goto(HOME_PAGE);
  $: if (quizStage === Stages.Running) goto(QUIZ_PAGE);

  async function getLeaderboard(maxRetries: number, phone: string = "") {
    const url = new URL(`${PUBLIC_BASE_URL}${PUBLIC_LEADERS}`);

    url.searchParams.set("id", phone);
    let leadersData = FALLBACK_LEADERS;
    for (let attempt = 1; attempt <= maxRetries; attempt += 1) {
      try {
        const response = await fetch(url.href);

        if (response.ok) {
          leadersData = (await response.json()) as LeaderboardResponse;
          break;
        } else {
          await sleep(LEADERS_DATA_RELOAD_INTERVAL);
        }
      } catch (error) {
        console.error(`Error fetching data (attempt ${attempt}):`, error);
      }
    }
    leaders = leadersData.leaders;
    position = leadersData.place;
  }

  if (user && data?.lastResetTime && user.lastResetTime !== data.lastResetTime) {
    user = undefined;
    removeUser();
  }

  if (result && data?.lastResetTime && result.lastResetTime !== data.lastResetTime) {
    result = undefined;
    removeResult();
  }
  $: score =
    result && data.correctAnswers ? calcScore(result.answers, data.correctAnswers) : undefined;
  $: isLeader =
    position !== undefined && leaders !== undefined && position >= 0 && position <= leaders.length;
  $: if (quizStage === Stages.Finished) getLeaderboard(maxRetries, user?.phone);
</script>

<style>
  .leaderboard {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 480px;
    justify-content: space-between;
    height: 100%;
  }

  .result {
    margin-block: var(--spacing-medium-large);
    text-align: center;
    font-weight: 600;
  }

  .list {
    margin-top: var(--spacing-huge);
    list-style-type: none;
  }

  .item {
    display: flex;
    background-color: var(--color-light);
    margin-bottom: var(--spacing-medium-small);
    padding: var(--spacing-medium-small);
    border-radius: var(--rounded);
    color: var(--color-dark);
  }
  .item-number {
    display: inline-block;
    width: 26px;
    height: 26px;
    padding: 3px var(--spacing-small);
    background-color: var(--color-secondary);
    border-radius: var(--rounded-sm);
    margin-right: var(--spacing-small);
    flex-shrink: 0;
    text-align: center;
  }
  .item-info {
    display: flex;
    flex-grow: 1;
    justify-content: space-between;
    align-items: center;
  }
  .phone {
    flex-basis: 50%;
  }
  .name {
    flex-basis: 40%;
    overflow-x: hidden;
    text-overflow: ellipsis;
    max-width: 100px;
  }
  .leaderboard-loading {
    margin-top: var(--spacing-huge);
  }
  .link {
    display: block;
    width: fit-content;
    margin: var(--spacing-huge) auto;
    color: var(--color-light);
  }
  .winners-info {
    width: 100%;
  }
  .info {
    margin-top: var(--spacing-small);
    text-align: center;
  }
  .leader-position {
    color: var(--color-yellow);
  }
</style>

{#if quizStage === Stages.Finished}
  <div class="container leaderboard">
    {#if leaders === undefined}
      <h2 class="h2 leaderboard-loading">
        {`Получение списка победителей...`}
      </h2>
    {:else}
      <div>
        {#if isLeader}
          <!-- Надо ли подсвечивать 2 и 3 места? -->
          <h1 class="h1">
            Поздравляем!<br />вы заняли <span class="leader-position">{position} место</span>
          </h1>
          <p class="info">
            Вам позвонят организаторы конкурса и пригласят вас для получения подарка!
          </p>
        {:else if position && position > 0}
          <h1 class="h1">Вы заняли<br />{position} место</h1>
        {/if}
        {#if result !== undefined && score !== undefined}
          <p class="result">
            Ваш результат {score}/{data.questions.length}
          </p>
        {/if}
        <a class="link" href={RESULT_PAGE}>Посмотреть ответы</a>
      </div>
      <div class="winners-info">
        <h2 class="h2">Победители</h2>
        <ol class="list">
          {#each leaders as leader, i}
            <li class="item">
              <span class="item-number">{i + 1}</span>
              <div class="item-info">
                <div class="name">{leader.name}</div>
                <div class="phone">+7******{leader.phone}</div>
              </div>
            </li>
          {/each}
        </ol>
      </div>
    {/if}
  </div>
{/if}
