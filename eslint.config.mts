import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';

export default defineConfig([
    {
        files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
        plugins: { js },
        extends: ['js/recommended'],
        ignores: [
            '  dist/*',
            'coverage/*',
            '**/*.d.ts',
            '/src/public/',
            '/src/types/',
        ],

        languageOptions: { globals: globals.browser },
    },
    tseslint.configs.recommended,
]);
