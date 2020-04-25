## @bszhct/cli

骆驼的哈乐园。


### 快速开始

1、 安装

```bash
# npm
npm i @bszhct/cli -g

# yarn 
yarn global add @bszhct/cli
```


2、使用

**bs init**

初始化一个工程。目前支持在已经创建好的目录下执行这个命令，例如在 project-name 工程下执行 `bs init`。

1. 如果当前项目不为空，会给出是否要清空的提示

2. 选择工程类型

3. 设置基础的 package 信息

**bs server**

启动一个本地的 Node 进程服务，可以设置文件目录和端口号。

```bash
# bs server [dir]
bs server 
bs server dist

# 更多
bs server -h
```


## 反馈

[传送门](https://github.com/bszhct/bs-cli/issues)
