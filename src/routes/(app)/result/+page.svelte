<script lang="ts">
  import { getQuizStage } from "$lib/helpers/get-quiz-stage";
  import { getStoredResult } from "$lib/helpers/localstorage-utils";
  import { goto } from "$app/navigation";
  import { QUIZ_PAGE, HOME_PAGE } from "$lib/constants/pages";
  import { Stages } from "$lib/types";
  import type { PageData } from "./$types";
  import type { Stage } from "$lib/types";

  export let data: PageData;

  let result = getStoredResult();
  let quizStage: Stage = Stages.Pending;

  let msTillStart = data.quizLaunchTime > 0 ? data.quizLaunchTime - data.serverTime : undefined;
  $: outcome = data.correctAnswers ? buildOutcome() : [];
  function buildOutcome() {
    return data.questions.map(({ question, answers }, i) => {
      const userAnswer =
        result && result.answers[i]?.answer >= 0 ? answers[result.answers[i].answer] : "нет ответа";
      const correctId = data.correctAnswers![i];
      const isCorrect = result ? result.answers[i]?.answer === correctId : undefined;
      return { question, correctAnswer: answers[correctId], userAnswer, isCorrect };
    });
  }

  $: if (data.quizLaunchTime < 0) quizStage = Stages.Standby;
  $: if (msTillStart) quizStage = getQuizStage(msTillStart, data.quizDuration);
  $: if (quizStage === Stages.Standby) goto(HOME_PAGE);
  $: if (quizStage === Stages.Running) goto(QUIZ_PAGE);
</script>

<style>
  .results {
    margin-bottom: var(--spacing-huge);
  }
  .item {
    margin-top: var(--spacing-huge);
    margin-inline: auto;
    max-width: 420px;
    width: 100%;
  }
  .answer {
    width: 100%;
    margin-block: var(--spacing-large) var(--spacing-small);
    padding: var(--spacing-medium-small);
    border-radius: var(--rounded);
    color: var(--color-dark);
    background-color: var(--color-light);
  }
  .correct {
    background-color: var(--color-green-light);
    border: 1px solid var(--color-green);
  }
  .incorrect {
    background-color: var(--color-red-light);
    border: 1px solid var(--color-red);
  }
  .question {
    text-align: center;
  }
</style>

{#if quizStage === Stages.Finished}
  <div class="container results">
    <h1 class="h1">Где были ошибки</h1>
    {#each outcome as { question, correctAnswer, userAnswer, isCorrect }, i}
      <div class="item">
        <h2 class="h2">{i + 1}/{data.questions.length}</h2>

        <p class="question">{question}</p>
        <div class="answer" class:correct={isCorrect} class:incorrect={isCorrect === false}>
          {userAnswer}
        </div>
        {#if !isCorrect}
          <p>Правильный ответ: {correctAnswer}</p>
        {/if}
      </div>
    {/each}
  </div>
{/if}
