import { error, type NumericRange } from "@sveltejs/kit";

import { ANSWERS_RETRIES } from "./constants";

import type { AnswersRequest, InitData, LoginRequest, LoginResponse } from "./types";
import { PUBLIC_ANSWERS, PUBLIC_BASE_URL, PUBLIC_INIT, PUBLIC_LOGIN } from "$env/static/public";

async function send({
  method,
  url,
  data
}: {
  method: string;
  url: string;
  data?: LoginRequest | AnswersRequest;
}) {
  const opts: { method: string; headers: Record<string, string>; body?: string } = {
    method,
    headers: {}
  };

  if (data) {
    opts.headers["Content-Type"] = "application/json";
    opts.body = JSON.stringify(data);
  }

  const response = await fetch(url, opts);

  if (response.ok) {
    const data = await response.json();
    return data ?? {};
  }

  throw error(response.status as NumericRange<400, 599>);
}

export const login = async (data: LoginRequest): Promise<LoginResponse | undefined> => {
  try {
    return await send({ method: "POST", url: `${PUBLIC_BASE_URL}${PUBLIC_LOGIN}`, data });
  } catch (e) {
    console.log(e);
  }
};

export const sendAnswers = async (data: AnswersRequest) => {
  for (let index = 1; index <= ANSWERS_RETRIES; index++) {
    try {
      return await send({ method: "POST", url: `${PUBLIC_BASE_URL}${PUBLIC_ANSWERS}`, data });
    } catch (e) {
      console.log(e);
    }
  }
};

export const getInitData = async (): Promise<InitData | undefined> => {
  try {
    const requestStartTime = Date.now();
    const { lastResetTime, startTime, serverTime } = (await send({
      method: "GET",
      url: `${PUBLIC_BASE_URL}${PUBLIC_INIT}`
    })) as InitData;
    let requestEndTime: number = Date.now();
    const requestEvgTime = Math.round((requestEndTime - requestStartTime) / 2);
    return {
      lastResetTime: Number(lastResetTime),
      startTime: Number(startTime),
      serverTime: Number(serverTime)
    };
  } catch (e) {
    console.error(e);
  }
};
