module.exports = {
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint'],
    extends: ['plugin:@typescript-eslint/recommended', 'plugin:react/recommended'],
    rules: {
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/explicit-member-accessibility": "off",
        "@typescript-eslint/no-object-literal-type-assertion": "off",
    },
    "overrides": [
        {
          "files": [ "src/**" ],
        }
    ],
  };