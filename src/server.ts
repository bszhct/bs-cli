#!/usr/bin/env node

import * as server from 'pushstate-server'
import { log } from './utils'

export default ({ dir, port }): void => {
  server.start({
    port,
    directories: dir.split(',')
  }, () => {
    log.info('服务启动成功', `http://0.0.0.0:${port}`)
  })
}
