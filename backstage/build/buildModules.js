'use strict';
const fs = require('fs');
const path = require('path');
const os = require('os');
const envSetStr = os.type() === 'Windows_NT' ? 'set' : 'export';
const modulesPath = path.resolve(__dirname, '../');
const shell = require('shelljs');
const settings = require('../publicMethods/settings');
const { scanFiles, scanforder, uploadByQiniu } = require('./utils');

// 指定打包模块
let designatedModule = ['adminResource'];

let copyType = 'dev',
  targetModules = '',
  localDistPath = ''; //  ALL 或 separate 可选
const argvs = process.argv;
if (argvs[2] === '--type') {
  copyType = argvs[3];
}
if (argvs[4] === '--modules') {
  targetModules = argvs[5];
  if (targetModules && targetModules !== 'ALL') {
    if (
      targetModules.indexOf(',') >= 0 &&
      targetModules.split(',').length > 0
    ) {
      designatedModule = designatedModule.concat(targetModules.split(','));
    } else {
      designatedModule.push(targetModules);
    }
    console.log('begin build target module: ', targetModules);
  }
}

if (argvs[6] === '--localDistPath') {
  localDistPath = argvs[7];
}

let targetBuildModules = scanforder(modulesPath);
if (designatedModule.length > 0) {
  targetBuildModules = designatedModule;
}
targetBuildModules.forEach(function (name) {
  if (
    name !== '.git' &&
    name !== 'build' &&
    name !== 'publicMethods' &&
    name !== 'dist'
  ) {
    shell.cd(`${modulesPath}/${name}`);
    shell.exec(`${envSetStr} NODE_ENV=production && npm run build`);
    if (!fs.existsSync(`${modulesPath}/dist/${name}`)) {
      shell.mkdir('-p', `${modulesPath}/dist/${name}`);
    } else {
      shell.rm('-rf', `${modulesPath}/dist/${name}/*`);
    }
    shell.cp(
      '-R',
      `${modulesPath}/${name}/dist/*`,
      `${modulesPath}/dist/${name}`
    );
    console.info(`module ${name} build success!`);
  }
});

if (copyType === 'prd') {
  let uploadInfo = [];

  const updateQniu = async (uploadInfo) => {
    console.log('Begin upload to Qiniu');
    for (const uploadItem of uploadInfo) {
      const { localFile, pathKey } = uploadItem;

      console.log(`Begin upload ${pathKey}`);
      await uploadByQiniu(localFile, settings.qiniuStaticPath + pathKey);
      console.log(`Upload ${pathKey} success!`);
    }
    console.log('All upload to Qiniu success!');
  };

  if (designatedModule.length > 0) {
    for (const moduleItem of targetBuildModules) {
      uploadInfo = scanFiles(modulesPath, `${modulesPath}/dist/${moduleItem}`);
      updateQniu(uploadInfo);

      if (localDistPath) {
        const targetLocalPluginPath = `${localDistPath}/${moduleItem}`;
        if (fs.existsSync(targetLocalPluginPath)) {
          shell.rm('-rf', `${targetLocalPluginPath}/*`);
        }
        shell.cp(
          '-R',
          `${modulesPath}/dist/${moduleItem}/*`,
          `${targetLocalPluginPath}`
        );
      }
    }
  } else {
    if (localDistPath) {
      if (fs.existsSync(`${modulesPath}/dist`)) {
        shell.rm('-rf', `${modulesPath}/dist/*`);
      }
      shell.cp('-R', `${modulesPath}/dist/*`, `${localDistPath}`);
    }
    uploadInfo = scanFiles(modulesPath, `${modulesPath}/dist`);
    updateQniu(uploadInfo);
  }
}
