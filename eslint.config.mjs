import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
	eslint.configs.recommended,
	...tseslint.configs.recommended,
	{
		files: ['src/**/*.ts'],
		languageOptions: {
			ecmaVersion: 2022,
			sourceType: 'module',
		},
		rules: {
			'@typescript-eslint/naming-convention': 'warn',
			'curly': 'warn',
			'eqeqeq': 'warn',
			'no-throw-literal': 'warn',
		},
	},
	{
		ignores: ['out/**', 'dist/**', '**/*.d.ts', 'node_modules/**'],
	}
);
