module.exports = {
  root: true,
  env: {
		// 启用 ES6 语法支持以及新的 ES6 全局变量或类型
		es6: true, 
		// Node.js 全局变量和 Node.js 作用域
		node: true, 
		// 浏览器全局变量
    browser: true, 
  },
  extends: [
    "eslint:recommended",
    "plugin:vue/essential"
  ],
  plugins: [
    "vue"
  ],
  rules: {
    /** style rules */
    // auto 数组开闭括号始终统一,要么换行，要么不换行
    "array-bracket-newline": [1, { "multiline": true }],
    // auto 数组内需要空格
    "array-bracket-spacing": ["error", "always", { 
      "singleValue": true,
      "objectsInArrays": false,
      "arraysInArrays": false
    }],
    // auto 大括号中不需要空格开始，空格结尾
    "block-spacing": [1, "never"],
    // auto 大括号与声明语句同一行
    "brace-style": 2,
    // auto 禁止数组或对象中拖尾逗号
    "comma-dangle": [1, "never"],
    // auto 数组或对象中逗号后留一空格
    "comma-spacing": [1, { "before": false, "after": true }],
    // auto 强制在文件末尾空一行
    "eol-last": [1, "always"],
    // auto 禁止在箭头函数体之前出现换行
    "implicit-arrow-linebreak": [1, "beside"],
    // auto 使用一个tab缩进
    "indent": [1, "tab", { 
      "ArrayExpression": 1,
      "SwitchCase": 1,
      "ObjectExpression": 1,
      "ImportDeclaration": 1,
    }],
    // auto 强制所有不包含单引号的 JSX 属性值使用单引号
    "jsx-quotes": [1, "prefer-single"],
    // auto 强制在对象字面量的属性中键和值之间使用一致的间距
    "key-spacing": [1, { 
      "beforeColon": false,
      "afterColon": true,
      "mode": "strict"
    }],
    // auto 强制使用 Unix 换行符
    "linebreak-style": [1, "unix"],
    // 单文件最大行数
    "max-lines": [1, 1200],
    // 可以使用空格和tab混合缩进
    "no-mixed-spaces-and-tabs": [1, "smart-tabs"],
    // auto 最多一个空行
    "no-multiple-empty-lines": [1, { "max": 1, "maxEOF": 0 }],
    // auto 禁止行尾留空格，允许行尾注释
    "no-trailing-spaces": [1, { 
      "skipBlankLines": true,
      "ignoreComments": true
    }],
    // auto 禁止属性前有空白
    "no-whitespace-before-property": 1,
    // auto 对象花括号中前后需要空格
    "object-curly-spacing": [1, "always", { "objectsInObjects": true }],
    // auto 函数语句中变量和函数之间有空行
    "padding-line-between-statements": [
      1,
      { blankLine: "always", prev: ["const", "let", "var"], next: "*" },
      { blankLine: "any",    prev: ["const", "let", "var"], next: ["const", "let", "var"] }
    ],
    // auto 对象健名统一加引号或统一不加引号
    "quote-props": [1, "consistent-as-needed"],
    // auto 尽可能使用单引号,允许字符串使用反勾号
    "quotes": [1, "single", { 
      "allowTemplateLiterals": true,
      "avoidEscape": true
    }],
    // auto 强制行尾插入分号
    "semi": [1, "always"],
    // auto 强制分号前后没有空格
    "semi-spacing": 1,
    // auto 强制分号在行尾
    "semi-style": [1, "last"],
    // auto 强制块状前一个空格
    "space-before-blocks": 1,
    // auto 函数括号前没有空格
    "space-before-function-paren": [1, "never"],
    // auto 强制圆括号内没有空格
    "space-in-parens": [1, "never"],
    // auto 强制操作符周围有空格
    "space-infix-ops": 1,
    // auto 强制注释前一个空格
    "spaced-comment": [1, "always"],
    
    /** es6 rules */
    // auto 箭头函数按需使用大括号
    "arrow-body-style": [1, "as-needed"],
    // auto 当只有一个参数时允许省略圆括号
    "arrow-parens": [1, "as-needed"],
    // auto 箭头函数的箭头前后有空格
    "arrow-spacing": 1,
    // 单个模块的所有的导入都在同一个 import 语句中
    "no-duplicate-imports": 1,
    // auto 禁止使用var关键字
    "no-var": 1,
    // auto ...扩展运算符之后不能有空格
    "rest-spread-spacing": [1, "never"],
    // auto 强制模板字符串中不留空格
    "template-curly-spacing": 1,

    /** variables rules */
    // 可以删除对象中的属性
    "no-delete-var": 0,
    // 禁止使用未定义的变量
    "no-use-before-define": 2,

    /** best practices rules */
    // auto 不允许使用 ==
    "eqeqeq": 2,
    // 不允许空函数
    "no-empty-function": 2,

    /** possible errors rules */
    // 开发模式允许使用 console
    "no-console": process.env.NODE_ENV === "production" ? 2 : 0,
    // 开发模式允许使用 debugger
    "no-debugger": process.env.NODE_ENV === "production" ? 2 : 0,
  },
  parserOptions: {
    // 支持es语法
    ecmaVersion: 6,
    // 使用babel-eslint解析器
    parser: "babel-eslint",
    // 模块加载资源类型
    sourceType: "module",
  }
};
