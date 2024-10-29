// commitlint.config.js
module.exports = {
extends: ['@commitlint/config-conventional'],
rules: {
    'header-max-length': [2, 'always', 72],
    'subject-case': [2, 'always', ['sentence-case']],
    'type-enum': [
        2,
        'always',
        [
        'feat', // 新功能
        'fix',  // 修复bug
        'docs', // 文档更改
        'style', // 代码格式修改
        'refactor', // 代码重构
        'test', // 增加测试
        'chore' // 构建过程或辅助工具的变动
        ],
        ],
    },
};