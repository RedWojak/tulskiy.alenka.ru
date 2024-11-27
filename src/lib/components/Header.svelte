<script lang="ts">
  import Logo from "./Logo.svelte";
  import { goto } from "$app/navigation";
  import { LEADERBOARD_PAGE } from "$lib/constants";

  export let showBackBtn = true;
</script>

<style>
  .header {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 21px 42px 0 42px;
  }

  .back {
    display: block;
    border-radius: 50%;
    border: transparent;
    position: absolute;
    width: 36px;
    height: 36px;
    top: 56px;
    left: 5%;
    background-image: url("../images/backIcon.svg");
    background-size: cover;
    background-color: transparent;
    cursor: pointer;
  }
</style>

<header class="header">
  {#if showBackBtn}
    <button on:click={() => goto(LEADERBOARD_PAGE)} class="back"></button>
  {/if}
  <Logo />
  <h3 class="h3">#РусскийТульскийНаш!</h3>
</header>
