export const sortBy = <T, K extends keyof T>(items: T[], key: K): T[] =>
  [...items].sort((a, b) => {
    if (a[key] < b[key]) return -1;
    if (a[key] > b[key]) return 1;
    return 0;
  });
