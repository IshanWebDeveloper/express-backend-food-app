import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';

export default defineConfig([
    globalIgnores([
        'node_modules/*', // ignore its content
        'dist/*',
        'coverage/*',
        '**/*.d.ts',
        '/src/public/',
        '/src/types/',
    ]),
    {
        files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
        plugins: { js },
        extends: ['js/recommended'],

        languageOptions: { globals: globals.browser },
    },
    tseslint.configs.recommended,
]);
