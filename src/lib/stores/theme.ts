import { Themes } from "$lib/types";
import { writable, type Writable } from "svelte/store";

const themeStore: Writable<typeof Themes.Main | typeof Themes.Alternative> = writable(Themes.Main);

export const theme = {
  subscribe: themeStore.subscribe,
  toggleAltTheme: () => themeStore.update(() => Themes.Alternative),
  toggleMainTheme: () => themeStore.update(() => Themes.Main)
};
