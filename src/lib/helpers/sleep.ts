export const sleep = async (wait: number) => await new Promise((r) => setTimeout(r, wait));
