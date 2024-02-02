<script lang="ts">
  export let question: string;
  export let answers: string[];
  export let handleAnswerClick: (answer: number) => void;
  export let selectedIdx: number | undefined = undefined;
  export let questionNumber: string;
</script>

<style>
  .question {
    margin-bottom: var(--spacing-large);
    text-align: center;
  }
  .answers {
    display: flex;
    flex-direction: column;
  }
  .answer-button {
    text-align: start;
    margin-bottom: var(--spacing-medium-small);
  }

  .answer-button__selected {
    background-color: var(--color-yellow);
  }
</style>

<h2 class="h2 question-number">{questionNumber}</h2>
<p class="question">{question}</p>

<div class="answers">
  {#each answers as answer, i}
    <button
      class="button answer-button"
      class:answer-button__selected={selectedIdx === i}
      on:click={() => handleAnswerClick(i)}>{answer}</button
    >
  {/each}
</div>
