import { error } from "@sveltejs/kit";

import type { LayoutServerLoad } from "./$types";
import { PUBLIC_BASE_URL } from "$env/static/public";
import { API_QUIZ } from "$env/static/private";
import { getQuizData } from "$lib/api";

export const load: LayoutServerLoad = async () => {
  try {
    const data = await getQuizData(`${PUBLIC_BASE_URL}${API_QUIZ}`);
    if (data !== undefined) return data;
    else error(500, "Cannot load quiz data");
  } catch (e) {
    error(500, "Cannot load quiz data");
  }
};
