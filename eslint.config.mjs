import prettier from "eslint-config-prettier/flat";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = [
	...nextCoreWebVitals,
	...nextTypescript,
	prettier,
	{
		ignores: [
			// Default ignores of eslint-config-next:
			".next/**",
			"out/**",
			"build/**",
			"next-env.d.ts",
			"node_modules/",
		],
	},
	{
		files: ["**/*.{js,jsx,ts,tsx}"],
		languageOptions: {
			ecmaVersion: 2020,
		},
		rules: {
			"react-hooks/rules-of-hooks": "error",
			"react-hooks/exhaustive-deps": "warn",
			"no-unused-vars": [
				"error",
				{
					varsIgnorePattern: "^_",
					argsIgnorePattern: "^_",
					caughtErrorsIgnorePattern: "^_",
				},
			],
			semi: ["error", "always"],
			// Disabled indent rule due to known bugs in ESLint 9.x causing stack overflow
			// Consider using Prettier or @stylistic/eslint-plugin instead
			indent: "off",
			"linebreak-style": ["error", "unix"],
			quotes: ["error", "double", { avoidEscape: false }],
			curly: ["error", "all"],
			"object-curly-spacing": ["error", "always"],
			"react/jsx-curly-spacing": [
				"error",
				{ when: "always", children: true },
			],
		},
	},
];

export default eslintConfig;
