import * as fs from 'fs-extra'
import * as path from 'path'
import * as inquirer from 'inquirer'
import * as chalk from 'chalk'

const logTypes = {
  1: 'Usage',
  2: 'Configuration item',
  3: 'Step'
}

// 统一的日志输出
export const log = {
  info: (type: number | string, text: string, br = false): void => {
    const key = typeof type === 'number' ? logTypes[type] : type
    console.log(`\n${key}：${chalk.cyan(text)}${br ? '\n' : ''}`)
  },
  ok: (text: string, br = false): void => {
    console.log(`\n${chalk.green('Success：')}${chalk.cyan(text)}${br ? '\n' : ''}`)
  },
  error: (text: string, br = false): void => {
    console.log(`\n${chalk.red(`Error：${text}`)}${br ? '\n' : ''}`)
  },
  todo: (action: string, detail: string, br = false): void => {
    console.log(`\n${chalk.magenta(`${action}`)}\n  ${chalk.cyan(detail)}${br ? '\n' : ''}`)
  }
}

// 默认的工程脚本提示
export const defaultProjectTips = (filename?: string): void => {
  if (filename) {
    log.todo(`cd ${filename} && yarn install`, '进入目录并安装依赖')
  } else {
    log.todo('yarn install', '安装依赖')
  }
  log.todo('yarn run dev', '启动开发服务')
  log.todo('yarn run build', '启动脚本构建服务', true)
}

// 判断目录是否为空
export const checkDir = (filePath: string, fn: () => void): boolean => {
  let cover = false
  fs.readdir(filePath, (error, files) => {
    if (error && error.code !== 'ENOENT') {
      log.error('无法读取文件', true)
      process.exit()
    }
    // 确认是否清空
    if (!(!files || !files.length)) {
      inquirer.prompt({
        message: '检测到该文件夹下有文件，是否要清空？',
        type: 'confirm',
        name: 'status',
        default: false
      }).then(res => {
        cover = res.status
        if (cover) {
          fs.emptyDirSync(process.cwd())
        }
        fn()
      })
    } else {
      fn()
    }
  })
  return cover
}

// 递归获取所有文件并进行操作
export const fileDisplay = (filePath: string, fn: (file: string) => void): void => {
  // 根据文件路径读取文件, 返回文件列表
  fs.readdir(filePath, (error, files) => {
    if (error) {
      log.error('文件读取错误')
      process.exit()
    } else {
      // 遍历读取到的文件列表
      files.forEach(filename => {
        // 获取当前文件的绝对路径
        const file = path.join(filePath, filename)
        // 根据文件路径获取文件信息
        fs.stat(file, (err, stats) => {
          if (err) {
            log.error('获取文件 stats 失败')
            process.exit()
          } else {
            const isFile = stats.isFile()
            const isDir = stats.isDirectory()
            if (isFile) {
              fn(file)
            }
            if (isDir) {
              fileDisplay(file, fn)
            }
          }
        })
      })
    }
  })
}
