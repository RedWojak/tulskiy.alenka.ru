<script lang="ts">
  import { page } from "$app/stores";
  import Header from "$lib/components/Header.svelte";
  import "../styles.css";
</script>

<style>
  .error {
    height: 100vh;
    width: 100vw;
    background-color: var(--color-primary);
  }
  .content {
    min-height: 200px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
</style>

<div class="error">
  <Header />
  <main class="container content">
    {#if $page.status === 404}
      <h1 class="h1">404</h1>
      <h3 class="h3">Страница не найдена</h3>
    {:else}
      <h3 class="h3">Что-то пошло не так. Попробуйте перезагрузить страницу</h3>
    {/if}
  </main>
</div>
