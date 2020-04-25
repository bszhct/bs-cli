import * as fs from 'fs-extra'
import * as path from 'path'
import * as inquirer from 'inquirer'
import * as chalk from 'chalk'
import * as ora from 'ora'

// 统一的日志输出
export const log = {
  info: (text: string, br = true): void => {
    console.log()
    console.log(chalk.blue('info：') + text)
    if (br) console.log()
  },
  ok: (text: string, br = true): void => {
    console.log()
    console.log(chalk.green('Success：') + text)
    if (br) console.log()
  },
  error: (text: string, key = true, br = true): void => {
    console.log()
    console.log(chalk.red(key ? `Error：${text}` : text))
    if (br) console.log()
  },
  cmd: (text: string): void => {
    console.log(`${chalk.gray('$')} ${chalk.cyan(text)}`)
  }
}

// 默认的工程脚本提示
export const defaultProjectTips = (filename?: string): void => {
  console.log()
  if (filename) {
    log.cmd(`cd ${filename} && yarn install`)
  } else {
    log.cmd('yarn install')
  }
  log.cmd('yarn run dev')
  log.cmd('yarn run build')
  console.log()
}

// 判断目录是否为空
export const checkDir = (filePath: string, fn: () => void): boolean => {
  let cover = false
  fs.readdir(filePath, (error: NodeJS.ErrnoException, files: string[]) => {
    if (error && error.code !== 'ENOENT') {
      log.error(error.toString(), true)
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
          const spinner = ora(`正在删除 ${chalk.cyan(filePath.split('/').pop())} 中，请稍等`).start()
          try {
            fs.emptyDirSync(filePath)
          } catch (e) {
            log.error(e)
            process.exit()
          }
          spinner.stop()
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
  // 根据文件路径读取文件，返回文件列表
  fs.readdir(filePath, (error: NodeJS.ErrnoException, files: string[]) => {
    if (error) {
      log.error(error.toString(), false)
      process.exit()
    } else {
      // 遍历读取到的文件列表
      files.forEach((filename: string) => {
        // 获取当前文件的绝对路径
        const file = path.join(filePath, filename)
        // 根据文件路径获取文件信息
        fs.stat(file, (err: NodeJS.ErrnoException, stats: fs.Stats) => {
          if (err) {
            log.error(err.toString(), false)
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
