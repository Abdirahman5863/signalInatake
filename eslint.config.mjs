import next from 'eslint-config-next/core-web-vitals'
export default [
  ...next,
  { ignores: ['.next/**', 'node_modules/**', 'output/**', 'tmp/**'] },
  // Existing marketing copy includes ordinary apostrophes and quotation marks.
  { rules: { 'react/no-unescaped-entities': 'off' } },
]
