
module.exports={
    "extends": "airbnb",
    "parser": "babel-eslint",
    "env": {
      "browser": true,
      "node": true,
      "mocha": true
    },
    "globals": {
      "Babel": true,
      "$":true,
      "jQuery":true,
      "rfplat":true,
      "rfutil":true,
      "_":true,
      "rfcobase":true
    },
    "rules": {
      "spaced-comment": 0,
      "comma-dangle": [
        2,
        "never"
      ],
      "no-var": 0,
      "linebreak-style":"off",
      "max-len":[2,150],
      "no-alert":"off",
      "no-console":"off",
      "object-shorthand":"off",
      "indent":["warn",2],
      "eqeqeq": "error",
      "quotes": "off",
      "quote-props":"off",
      "prefer-arrow-callback": "off",
      "prefer-template":"off",
      "arrow-parens":"off",
      "global-require": "off",
      "import/no-unresolved": "off",
      "no-underscore-dangle": "off",
      "no-new-func": "off",
      "no-param-reassign": "off",
      "no-restricted-syntax": "off",
      "consistent-return":"off",
      "prefer-promise-reject-errors":"warn",
      "func-names":"off",
      "no-else-return":"warn",
      "space-before-blocks":"off",
      "keyword-spacing":"off",
      "vars-on-top":"off",
      "space-before-function-paren": [
        0,
        "always"
      ],
      "prefer-destructuring": [
        "error",
        {
          "object": false,
          "array": false
        }
      ],
      "import/newline-after-import":"off",
      "camelcase":"warn",
      "wrap-iife":"off"
    }
  };