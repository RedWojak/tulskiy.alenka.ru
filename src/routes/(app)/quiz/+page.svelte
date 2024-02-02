<script lang="ts">
  import { getQuizStage } from "$lib/helpers/get-quiz-stage";
  import { getStoredResult, getStoredUser, saveResult } from "$lib/helpers/localstorage-utils";
  import { goto } from "$app/navigation";
  import { HOME_PAGE, LEADERBOARD_PAGE, LEADERS_DATA_LOAD_DELAY } from "$lib/constants";
  import { makeQuizModel } from "../../../lib/helpers/make-quiz-model";
  import { sendAnswers } from "$lib/api";
  import { sleep } from "$lib/helpers/sleep";
  import { Stages, type Stage, type Result, type QuizModel } from "$lib/types";
  import { theme } from "$lib/stores";
  import QuestionView from "$lib/components/QuestionView.svelte";
  import Timer from "$lib/components/Timer.svelte";
  import type { PageData } from "./$types";

  export let data: PageData;

  const storedResult = getStoredResult();
  const userData = getStoredUser();
  let lastResetTime = data.lastResetTime ?? null;
  let msTillStart = data.startTime - data.serverTime;
  let questionStartTime = Date.now();
  let quiz: QuizModel = [];
  let quizStage: Stage = Stages.Pending;
  let restartTimer: (a: number) => void;

  let selectedIdx: number | undefined;
  let waitingResult = false;

  let result: Result =
    lastResetTime && storedResult && lastResetTime === storedResult.lastResetTime
      ? storedResult
      : initResult();
  function initResult() {
    const answers: {
      answer: number;
      time: number;
    }[] = [];

    for (let i = 0; i < data.questions.length; i += 1) {
      answers.push({ answer: -1, time: data.questions[i].time });
    }

    return { answers, lastResetTime };
  }
  function handleAnswerClick(answer: number) {
    let answerTime = Date.now();
    selectedIdx = answer;
    result.answers[currentIdx] = {
      answer,
      time: answerTime - questionStartTime
    };

    saveResult(result);
  }
  function handleQTimeFinished() {
    saveResult(result);
    if (currentIdx < quiz.length - 1) {
      selectedIdx = undefined;
      currentIdx += 1;
      restartTimer(Math.floor(quiz[currentIdx].duration / 1000));
      questionStartTime = Date.now();
    } else if (!waitingResult) {
      theme.toggleMainTheme();
      waitingResult = true;
      waitAndSendAnswers();
    }
  }
  async function waitAndSendAnswers() {
    try {
      const randomTimeout = Math.floor(Math.random() * 4) * 1000;
      await sleep(randomTimeout);
      await sendAnswers({ phone: userData!.phone, results: result.answers });
    } catch (e) {
      console.error(e);
    }
  }
  $: if (msTillStart) quizStage = getQuizStage(msTillStart, data.quizDuration);
  $: if (quizStage === Stages.Finished) goto(LEADERBOARD_PAGE, { invalidateAll: true });
  $: if (quizStage === Stages.Standby) goto(HOME_PAGE);
  $: if (msTillStart) quiz = makeQuizModel(msTillStart, data.questions);
  $: currentIdx = quiz.findIndex(({ tillEnd }) => tillEnd > 0);
  $: if (userData === undefined) goto(HOME_PAGE);
  $: if (userData && quiz[currentIdx]?.useAlternativeTheme) {
    theme.toggleAltTheme();
  } else {
    theme.toggleMainTheme();
  }
</script>

<style>
  .timer-hint {
    margin-top: var(--spacing-huge);
    text-align: center;
  }
  .quiz-finish-message {
    padding-block: var(--spacing-huge);
    text-align: center;
  }
</style>

<div class="container">
  {#if currentIdx !== undefined && quiz.length > 0 && quizStage === Stages.Running && userData && !waitingResult}
    <QuestionView
      questionNumber={`${currentIdx + 1} / ${quiz.length}`}
      question={quiz[currentIdx].question}
      answers={quiz[currentIdx].answers}
      {selectedIdx}
      {handleAnswerClick}
    />
    <p class="timer-hint">{`До следующего вопроса осталось:`}</p>
    <Timer
      countdownSeconds={Math.floor(quiz[currentIdx].duration / 1000)}
      hideMinutes
      callback={handleQTimeFinished}
      bind:restartTimer
    />
  {:else if waitingResult}
    <h3 class="h3 quiz-finish-message">
      {@html `Спасибо за участие! </br>Список победителей будет опубликован через несколько секунд.`}
    </h3>
    <Timer
      countdownSeconds={Math.floor(LEADERS_DATA_LOAD_DELAY / 1000)}
      hideMinutes
      callback={() => goto(LEADERBOARD_PAGE)}
    />
  {/if}
</div>
