export default function letters() {
  const res = {
    '-': `


.....


`,
    ' ': `





`,
    '/': `
    .
   .
  .
 .
.
`,
    'x': `
.   .
 . .
  .
 . .
.   .
`,
    'unknown': `
.....
.   .
.   .
.   .
.....
`
  };

  return Object.keys(res)
    .reduce((acc, key) => ({
      [key]: res[key]
        .replace(/^\n|\n$/g, '')
        .split('\n')
        .map(_ => _.split('')),
      ...acc }), {});
}
