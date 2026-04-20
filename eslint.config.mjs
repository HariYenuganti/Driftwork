import next from 'eslint-config-next';
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';

const config = [
  ...next,
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'dist/**',
      'prisma/data/**',
      'public/mockServiceWorker.js',
    ],
  },
  {
    rules: {
      // Experimental React Compiler rule. Flags legitimate "reset derived
      // state on external change" patterns (URL sync, filter-change page
      // reset, batched-fetch reset). Keep as warn, audit in review.
      'react-hooks/set-state-in-effect': 'warn',
    },
  },
];

export default config;
