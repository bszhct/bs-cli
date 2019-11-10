# @bszhct/cli
前端工程化命令行工具。

---

## 使用

### `install`
```bash
# npm
npm i @bszhct/cli -g

# yarn 
yarn global add @bszhct/cli
```

### `bs init`
初始化一个工程。目前支持在已经创建好的目录下执行这个命令，例如在 project-name 工程下执行 `bs init`。
1. 如果当前项目不为空，会给出是否要清空的提示
2. 选择工程类型
```bash
# 请选择工程类型
# ○ React + Mobx 
# ○ Component(React)
# ○ Node Cli
```
3. 设置基础的 package 信息

### `bs server`
启动一个本地的 Node 进程服务，可以设置文件目录和端口号。
```bash
# bs server [dir] [port]
bs server 
bs server dist
bs server dist,nodule_modules 9999
```

### `bs -h`
查看全局的帮助提示。

### `bs <command> -h`
查看具体某个命令的帮助提示，例如：`bs init -h`。

---

## 反馈
[传送门](https://github.com/bszhct/cli/issues)
