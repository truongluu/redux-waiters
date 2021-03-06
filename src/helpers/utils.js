export const delay = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms, ms));

export default {
  delay,
};
