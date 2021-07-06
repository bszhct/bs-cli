#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-var-requires */

import * as program from 'commander'
import * as updater from '@bszhct/pkg-updater'

import init from './init'
import server from './server'

const pkg = require('../package.json')

// 设置版本号
program.version(pkg.version)
// 设置自动更新提示
updater({
  pkg,
  // 一小时
  checkInterval: 1000 * 60 * 60
})
  .then(() => {
    program
      .command('init [dir]')
      .description('初始化工程')
      .action(init)

    program
      .command('server [dir]')
      .description('启动一个本地服务')
      .option('-a, --address <address>', '访问地址')
      .option('-p, --port <port>', '服务端口号')
      .option('-P, --proxy <proxy>', '代理服务器的地址')
      .option('-o, --open <open>', '启动服务后自动打开窗口')
      .action(server)

    program.parse(process.argv)
  })
