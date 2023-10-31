module.exports = {
    extends: "../../.eslintrc.cjs",
    overrides: [{
        files: ["src/**/*.ts", "build/**/*.js"],
        rules: {
            "prefer-arrow/prefer-arrow-functions": "off"
        }
    }]
};