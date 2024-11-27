<script lang="ts">
  import "../../styles.css";
  import Header from "$lib/components/Header.svelte";
  import { theme } from "$lib/stores";
  import { page } from "$app/stores";
  import { RESULT_PAGE } from "$lib/constants/pages";
  $: showBackBtn = $page.url.pathname === RESULT_PAGE;
</script>

<style>
  .app {
    min-height: 100vh;
    margin: auto;
    min-width: 360px;
    max-width: 780px;
    overflow-y: hidden;
  }
  .main-theme {
    background-color: var(--color-primary);
  }

  main {
    display: flex;
    flex-direction: column;
    align-items: stretch;
  }
</style>

<div class="app {$theme}">
  <Header {showBackBtn} />
  <main>
    <slot />
  </main>
</div>
