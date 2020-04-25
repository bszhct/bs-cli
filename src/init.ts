#!/usr/bin/env node

import * as fs from 'fs-extra'
import * as inquirer from 'inquirer'
import * as _ from 'lodash'
import * as download from 'download-git-repo'
import * as ora from 'ora'
import { checkDir, log, fileDisplay, defaultProjectTips } from './utils'
import { TEMPLATES, PKG_INFO } from './const'

export default (dir: string): void => {
  const root = process.cwd()
  // 工程目录
  const projectDir = dir ? `${root}/${dir}` : root
  // 工程名称
  const projectName = dir || root.split('/').pop()
  // 清空判断
  checkDir(projectDir, () => {
    // 工程类型
    inquirer.prompt({
      type: 'list',
      name: 'type',
      message: '请选择工程类型：',
      choices: TEMPLATES
    }).then(project => {
      // 变量替换
      inquirer.prompt(PKG_INFO).then(pkg => {
        const spinner = ora('工程初始化中，请稍等').start()
        download(project.type, projectDir, (error: string) => {
          if (error) {
            spinner.text = '模板下载失败'
            spinner.stop()
            log.error(error)
            process.exit()
          }
          spinner.text = '下载完成，开始生成 package.json'
          // 替换 package.json 中 version、description 和 name 的值
          const pkgPath = `${projectDir}/package.json`
          fs.writeFileSync(
            pkgPath,
            JSON.stringify({ ...require(pkgPath), ...pkg, name: `@bszhct/${projectName}` }, null, 2)
          )
          // 如果是 template-component 模板，进行 component-name 的变量替换
          if (project.type.includes('template-component')) {
            spinner.text = '开始进行变量替换'
            // 模板变量
            const vars = {
              ComponentName: _.upperFirst(_.camelCase(projectName)),
              componentName: _.camelCase(projectName),
              'component-name': projectName.toLocaleLowerCase()
            }
            fileDisplay(projectDir, (file: string) => {
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

          spinner.stop()
          log.ok('工程初始化成功', false)
          defaultProjectTips()
        })
      })
    })
  })
}
