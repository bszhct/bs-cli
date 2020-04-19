#!/usr/bin/env node
/* eslint-disable global-require */

import * as fs from 'fs-extra'
import * as inquirer from 'inquirer'
import * as _ from 'lodash'
import * as download from 'download-git-repo'
import { checkDir, log, fileDisplay, defaultProjectTips } from './utils'
import { TEMPLATES, PKG_INFO } from './const'

export default () => {
  const root = process.cwd()
  // 工程名称
  const projectName = root.split('/').pop()
  // 清空判断
  checkDir(root, () => {
    // 工程类型
    inquirer.prompt({
      type: 'list',
      name: 'type',
      message: '请选择工程类型:',
      choices: TEMPLATES
    }).then(project => {
      // 变量替换
      inquirer.prompt(PKG_INFO).then(pkg => {
        download(project.type, '.', (error: string) => {
          if (error) {
            log.error(error)
            process.exit()
          }
          // 替换 package.json 中 version, description 和 name 的值
          const pkgPath = `${root}/package.json`
          fs.writeFileSync(
            pkgPath,
            JSON.stringify({ ...require(pkgPath), ...pkg, name: `@bszhct/${projectName}` }, null, 2)
          )
          // 如果是 template-component 模板, 进行 component-name 的变量替换
          if (project.type.includes('template-component')) {
            // 模板变量
            const vars = {
              ComponentName: _.upperFirst(_.camelCase(projectName)),
              componentName: _.camelCase(projectName),
              'component-name': projectName.toLocaleLowerCase()
            }
            fileDisplay(root, file => {
              // 过滤以点开头的隐藏文件和资源文件
              const filename = file.split('/').pop()
              if (/(^\..+)|(\.svg|png|jpeg|jpg)/.test(filename)) {
                return
              }
              // 获取文件内容
              let filePath = file
              let content = fs.readFileSync(file).toString()
              Object.keys(vars).forEach(key => {
                const reg = new RegExp(`${key}`, 'g')
                // 文件内容里面的模板变量替换
                if (reg.test(content)) {
                  content = content.replace(reg, vars[key])
                }
                // 文件名修改
                if (reg.test(file)) {
                  filePath = file.replace(reg, `${vars[key]}`)
                  fs.renameSync(file, filePath)
                }
              })
              fs.writeFileSync(filePath, content)
            })
          }

          log.ok('模板下载成功')
          defaultProjectTips()
        })
      })
    })
  })
}
