// plopfile.js

const axios = require('axios');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

module.exports = function (plop) {
  plop.setGenerator('project', {
    description: '生成前端项目',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: '请输入项目名称：',
        validate: function (value) {
          if (/.+/.test(value)) {
            return true;
          }
          return '项目名称不能为空';
        }
      },
      {
        type: 'input',
        name: 'template',
        message: '请输入模板名称：',
        validate: function (value) {
          if (/.+/.test(value)) {
            return true;
          }
          return '模板名称不能为空';
        }
      }
    ],
    actions: [
      {
        type: 'addMany',
        destination: 'projects/{{name}}',
        templateFiles: 'node_modules/plop-templates/{{template}}/**/*'
      },
      function downloadTemplate(data) {
        const { template } = data;
        const url = `https://github.com/your-username/${template}-template/archive/main.zip`;

        return axios
          .get(url, {
            responseType: 'arraybuffer'
          })
          .then((response) => {
            fs.writeFileSync('template.zip', response.data);
            execSync('unzip template.zip -d node_modules/plop-templates');
            execSync(`mv node_modules/plop-templates/${template}-template-main node_modules/plop-templates/${template}`);
            execSync('rm -rf template.zip');

            console.log(chalk.green('模板下载成功！'));
            return data;
          });
      }
    ]
  });
};
