export const text2Blob = (str: string) =>
  new Blob([str], {
    type: 'text/plain',
  });
