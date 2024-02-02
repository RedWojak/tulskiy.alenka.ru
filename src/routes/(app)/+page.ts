import { error } from "@sveltejs/kit";
import { getInitData } from "$lib/api";
import { INIT_DEPENDENCY } from "$lib/constants";
import type { InitData } from "$lib/types";
import type { PageLoad } from "./$types";

export const ssr = false;

export const load: PageLoad<InitData | undefined> = async ({ depends }) => {
  let pageData: InitData | undefined = undefined;
  depends(INIT_DEPENDENCY);

  try {
    pageData = await getInitData();
  } catch (e) {
    error(500, "Cannot load quiz data");
  }
  return pageData;
};
