#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-var-requires */

import * as program from 'caporal'
import * as updateNotifier from 'update-notifier'

import init from './init'
import server from './server'

const pkg = require('../package.json')

// 设置版本号
program.version(pkg.version)
// 设置自动更新提示
const notifier = updateNotifier({
  pkg,
  // 一周
  updateCheckInterval: 1000 * 60 * 60 * 24 * 7
})
notifier.notify()

// 初始化工程
program
  .command('init', '初始化工程')
  .action(init)

// 启动一个本地服务
program
  .command('server', '启动一个本地服务')
  .argument('[dir]', '文件目录', program.STRING, 'dist')
  .argument('[port]', '端口号', program.INT, 9000)
  .action(server)

program.parse(process.argv)
