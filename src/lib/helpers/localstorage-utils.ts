import { LS_RESULT_KEY, LS_USER_KEY } from "../constants";
import type { Result, User } from "../types";

const getFromLocalStorage = (key: string) => {
  const stored = localStorage.getItem(key);
  return stored === null ? undefined : JSON.parse(stored);
};

const saveToLocalStorage = (key: string, data: User | Result) => {
  localStorage.setItem(key, JSON.stringify(data));
};

const removeFromLocalStorage = (key: string) => {
  localStorage.removeItem(key);
};

export const getStoredUser = (): User | undefined => getFromLocalStorage(LS_USER_KEY);
export const getStoredResult = (): Result | undefined => getFromLocalStorage(LS_RESULT_KEY);

export const saveUser = (userData: User) => saveToLocalStorage(LS_USER_KEY, userData);
export const saveResult = (result: Result) => saveToLocalStorage(LS_RESULT_KEY, result);

export const removeUser = () => removeFromLocalStorage(LS_USER_KEY);
export const removeResult = () => removeFromLocalStorage(LS_RESULT_KEY);
