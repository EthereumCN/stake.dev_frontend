---
path: ce-shi-wang-01
id: 25
title: 如何参与Pyrmont测试网质押，Prysm篇。
description:  '如何参与Pyrmont测试网质押，Prysm篇。' 
date: 2020-06-25T02:15:01.762Z
author: Carl Beekhuizen  
---

作者 | Somer Esat

来源 | [someresat.medium.com](https://someresat.medium.com/guide-to-staking-on-ethereum-2-0-ubuntu-pyrmont-prysm-a10b5129c7e3)



![p1](https://i.ibb.co/sPZNnd4/1.png)



**提醒**：不要按照这个指南与Eth2主网连接。主网指南在[这里](https://github.com/SomerEsat/ethereum-staking-guide)。

本文详解如何通过多客户端测试网Pyrmont在以太坊2.0主网质押。主要基于以下几个技术：

- Ubuntu v20.04 (LTS) x64 服务器
- Go Ethereum 节点 ([代码分支](https://github.com/ethereum/go-ethereum))
- Prysmatic Labs ETH 2.0 客户端 —— Prysm ([代码分支](https://github.com/prysmaticlabs/prysm))
- 正式多客户端测试网公网，[Pyrmont](https://github.com/protolambda/pyrmont)
- 浏览器插件加密钱包 [MetaMask](https://metamask.io/)
- [Prometheus](https://prometheus.io/) 参数
- [Grafana](https://grafana.com/) 仪表盘

此篇指南包括以下指令：

- 配置一个新运行的Ubuntu服务器用例
- 配置并运行一个以太坊1.0节点作为服务
- 生成一个Prysm客户端并导入Pyrmont验证者账户密钥
- 给以太坊2.0与阶段0编译并配置Prysmatic Labs信标链和验证者客户端软件，并把它们作为服务来运行
- 安装和配置Prometheus参数，设置一个Grafana仪表盘



# 提醒

此指南时用于Pyrmont测试网的。切记无论如何不要向测试网发送主网的ETH。你发送了就等于丢失了。

**不要**按照这份指南连接Eth2主网。主网专用指南在[这里](https://github.com/SomerEsat/ethereum-staking-guide)。



# 致谢与免责声明

本教程参考了网上的各种资料，感谢这些提供资料的贡献者！

感谢[Prysmatic](https://discord.gg/VaQcHq76yJ)和[EthStaker](https://discord.gg/7z8wzehjrJ)团队的人在discord上提供的帮助与审校。

特别感谢Eth2 客户端团队和以太坊基金会的研究员。他们经过几年的不懈努力，将我们带到这难以置信的时刻——Eth2.0成功创世。

此教程仅作教育用途。我不是本文涉及的任何技术的专家。不保证此教程内容的准确性，因遵循此教程而造成的损失，本人概不负责。

欢迎给我反馈！



# 支持

这个过程可能有些棘手。如果你需要帮助，以下是两个你可以寻求帮助的好资源 （除了我) :

- EthStaker社区是一个以太坊2.0 Staking 社区，资源丰富且十分友好。
  - Reddit：https://www.reddit.com/r/ethstaker/
  - Discord：https://discord.gg/7z8wzehjrJ
- Prysm 客户端团队，[Discord](https://discord.gg/GVM5TJwzkU)，他们是客户端软件的工程团队，是使用Prysm的专家。



# 条件

使用本教程需要对以太坊、ETH、Staking、Linux、MetaMask (Portis或Fortmatic) 有一定的背景知识。

此教程还需要在开始前安装并运行：

- [Ubuntu 服务器 v20.04 (LTS) amd64](https://ubuntu.com/tutorials/install-ubuntu-server#1-overview) 或者一个较新的，在本地计算机、你的网络、或云端 (AWS、Digital Ocean、Microsoft Azure等)安装和运行的Ubuntu服务器。推荐使用本地计算机，以提高网络的去中心化程度——如果云端供应商掉线了，那么托管在这个供应商的节点都会离线。
- 已安装或已配置的浏览器插件加密钱包[MetaMask](https://metamask.zendesk.com/hc/en-us/articles/360015489531-Getting-Started-With-MetaMask-Part-1-)。一台装有操作系统 (Mac、Windows、Linux等) 和浏览器 (Brave、Safari、FireFox等) 的计算机。



# 树莓Pi用户注意

我没有在树莓Pi上测试过这份教程。如果你想尝试的话，只需要把下面列出的软件换成ARM版本。不保证可行。



# 要求

- Ubuntu服务器用例。我用过v20.04 (LTS) amd64服务器 VM

- 浏览器插件加密钱包MetaMask，安装并配置好

- 运行Prysm软件的

  推荐硬件要求

  ：

  - 处理器：Intel Core i7–4770或AMD FX-8310或更好的
  - 内存：16GB RAM
  - 存储空间：可用空间有100GB的固态硬盘 (只用于Prysm客户端)

注意：硬件要求是一个比较大的话题。总的来说：一个相对较新的CPU、16GB内存的RAM、一个内存至少1TB的SSD (1TB更佳)、稳定的网络（足够快的下载速度以及月度数据额度），这些性能都会让质押过程更加安全顺畅。



# 概览

本教程篇幅较长，下面这个图表简要说明了质押的步骤，标黄的即是本文会覆盖到的部分：



![p2](https://i.ibb.co/gSFPstC/2.png)



整个流程可以概念化表述为：

- 设置一个Eth1 节点并同步Eth1 Göerli 测试网的数据；
- 配置信标链节点并同步Eth1 节点的数据；
- 生成验证者密钥并激活；
- 配置验证者客户端；
- 验证者在信标链上借助签名密钥对提议区块、证明区块，当验证者作恶或者怠工时会受到罚没惩罚。

那我们现在就开始吧！



# 第0步：连接至服务器

使用一个SSH端口，连接至你的Ubuntu服务器。在默认情况下，Ubuntu上的root账户通常都是禁用的，然而有些云提供商可以启动root账户。如果你用`root`登录，最好是重新创建一个拥有管理权限的用户账户，因为使用root用户登录存在很大的[风险](https://askubuntu.com/questions/16178/why-is-it-bad-to-log-in-as-root)。

> 注意：如果你不是用`root`登录的便可以直接跳到第1步。

```Powershell
# adduser <yourusername>
```

设置一个密码并填写其他信息。

通过把新的用户加入`sudo`群组中，来授予其管理权限。

```Powershell
# usermod -aG sudo <yourusername>
```

When you log in as `<yourusername>` you can type sudo before commands to perform actions with superuser privileges.

Optional: If you used [SSH keys](https://jumpcloud.com/blog/what-are-ssh-keys) to connect to your Ubuntu instance via the `root` user you will need to associate the new user with the root user’s SSH key data.

当你用你的用户名 `<yourusername>` 登录时，可以通过在命令行前输入sudo，来以超级用户的权限执行操作。

```Powershell
# rsync --archive --chown=<yourusername>:<yourusername> ~/.ssh /home/<yourusername>
```

最后，退出登录你的`root`账户，然后使用你新创建的用户名`<yourusername>`登入Ubuntu服务器。



# 第1步：升级服务器

确保系统更新至最新的软件和安全设置。

```Powershell
$ sudo apt update && sudo apt upgrade
$ sudo apt dist-upgrade && sudo apt autoremove
```



# 第2步：保护服务器

安全性十分重要。但由于本文不是针对安全性的指南，所有只列出了一些基础的设置。

## 配置防火墙

Ubuntu 20.04 服务器可以使用默认的 [UFW 防火墙](https://help.ubuntu.com/community/UFW)来限制访问该服务器的流量，不过要先设置其允许来自 SSH、Go Ethereum、Grafana、Prysm 的入站流量。

**允许 SSH**

允许通过SSH连接到服务器。为了安全，接下来我们要修改默认端口22 (因为这是一个普遍的攻击矢量)。

> 注意：如果你选择不修改默认SSH端口 (不建议)，那就要加一项操作——允许默认SSH端口 `*$ sudo ufw allow 22/tcp*` ，然后跳到允许“Go Ethereum”这一步。

在1024 — 49151之间选择一个端口号，然后运行以下命令以检索尚未使用的端口号。如果显示红色 (被使用了)，就选择另一个端口。

```Powershell
$ sudo ss -tulpn | grep ':<yourSSHportnumber>'
```

更新防火墙，允许`<yourSSHportnumber>` 的入站流量。SSH要求TCP协议。

```Powershell
$ sudo ufw allow <yourSSHportnumber>/tcp
```

下一步，修改默认SSH端口。

```Powershell
$ sudo nano /etc/ssh/sshd_config
```

找到默认端口`# Port 22` 或`Port 22`，然后修改你自己的端口号 `Port <yourSSHportnumber>`。删掉 `#` (如果有的话)。

参考下方的截图，你的文档应该和下图展示的类似 (除了端口号不一样)。保存然后退出。



![p3](https://i.ibb.co/94mtjw9/3.png)



**重启SSH服务**

```Powershell
$ sudo systemctl restart ssh
```

下次你通过SSH登录时就使用你的端口号 `<yourSSHportnumber>` 。

可选：如果你已经使用端口 22/TCP 的UFW了，那就更新防火墙以拒绝该端口的入站流量。请务必在你使用新SSH端口登录之后在操作这一步。

```Powershell
$ sudo ufw deny 22/tcp
```

**允许 Go Ethereum**

允许来自Go Ethereum对等节点 (端口30303/TPC 和 30303/UDP) 的入站请求。如果你使用第三方 (如[Infura](https://infura.io/) 托管的 Eth1 节点，则可以跳过这一步。

> 注意：如果你在本地托管你的Ubuntu服务器，你需要配置你的网络路由以允许来自端口 30303 的入站流量。

```Powershell
$ sudo ufw allow 30303
```

**允许Prysm**

**允许与 Prysm 的对等节点进行点对点连接，以便在信标链节点上 (Prysmatic Labs 的默认端口为 [13000/TCP 和 12000/UDP](https://docs.prylabs.network/docs/prysm-usage/p2p-host-ip/#incoming-p2p-connection-prerequisites) 进行操作。**

> 注意：如果你在本地托管你的Ubuntu服务器，你需要配置你的网络路由或防火墙以允许来自端口 13000 和12000 的入站流量。

```Powershell
$ sudo ufw allow 13000/tcp
$ sudo ufw allow 12000/udp
```

**允许 Grafana**

允许访问Grafana web 服务器 (端口3000/TCP) 的入站请求。

```Powershell
$ sudo ufw allow 3000/tcp
```

**允许 Prometheus (可选)**

如果你想直接访问Prometheus数据服务，你也可以打开端口9090/TCP。如果你仅使用Grafana查看数据，则没有必要这样做。我没有打开这个端口。

```Powershell
$ sudo ufw allow 9090/tcp
```

启动防火墙，检查是否已经正确配置。

```Powershell
$ sudo ufw enable
$ sudo ufw status numbered
```

显示应该是这样的，我使用的SSH端口号是 `1666/tcp` 。



![p4](https://i.ibb.co/yQv0WCx/4.png)





# 第3步：安装并运行 Go Ethereum 节点

安装并配置Eth1.0的节点，信标链将与该节点相连。如果你选择第三方服务 (如Infura) 的话，可以跳过这一步。

## 安装 Go Ethereum

建议使用PPA (Personal Package Archives，个人安装包存档) 安装Go Ethereum客户端。

```Powershell
$ sudo add-apt-repository -y ppa:ethereum/ethereum
```

更新软件包并安装最新的稳定版本。

```Powershell
$ sudo apt update
$ sudo apt install geth
```

## 将Go Ethereum作为后台服务来运行

运行该服务需要创建一个账户，此种类型的账户无法登录服务器。

```Powershell
$ sudo useradd --no-create-home --shell /bin/false goeth
```

为Eth1区块链创建数据目录，用来存储Eth1节点数据。使用 `-p` 选项来创建完整的路径。

```Powershell
$ sudo mkdir -p /var/lib/goethereum
```

设置目录的权限。 `goeth` 账户需要权限来修改该数据目录。

```Powershell
$ sudo chown -R goeth:goeth /var/lib/goethereum
```

创建一个systemd服务文件来储存该服务配置。我们将使用该配置文件来命令systemd运行`geth` 进程。

```Powershell
$ sudo nano /etc/systemd/system/geth.service
```

将下列的服务配置复制粘贴到文档中。

```Powershell
[Unit]
Description=Ethereum go client
After=network.target 
Wants=network.target[Service]
User=goeth 
Group=goeth
Type=simple
Restart=always
RestartSec=5
ExecStart=geth --goerli --http --datadir /var/lib/goethereum[Install]
WantedBy=default.target
```

flag `--goerli` 用于定位 Göerli 测试网，而flag `--http` 用来公开与信标链节点连接的一个HTTP端口 ([http://localhost:8545](http://localhost:8545/))。

参考下方的截图。保存然后退出。



![p5](https://i.ibb.co/s5cGtPQ/5.png)



重新加载 systemd 以显示上述的更改并启动服务。

```Powershell
$ sudo systemctl daemon-reload
```

启动服务，并检查确保其正常运行。

```Powershell
$ sudo systemctl start geth
$ sudo systemctl status geth
```

显示应如下方截图。



![p6](https://i.ibb.co/XWW9Jcx/6.png)



如果你每一步都做对了，它会用绿色字体显示”active (running)"。如果没有显示，你需要倒回去重复上述步骤，修复问题。按Q退出。

允许geth服务在系统重启时自动启动。

```Powershell
$ sudo systemctl enable geth
```

Go Ethereum节点将会开始同步。你可以运行 journal 命令来追踪进程。按“CTRL+c”退出。

```Powershell
$ sudo journalctl -fu geth.service
```

当你花较长的时间来找到需要同步的对等节点时，你可以添加一些对等节点。访问此处以获得最新的清单，并操作下列命令行以修改geth服务：

```Powershell
$ sudo systemctl stop geth
$ sudo nano /etc/systemd/system/geth.service
```

修改 `ExecStart` 行，添加 `--bootnodes` flag：在下方罗列出最新的对等点，并以逗号分割。

```Powershell
ExecStart=geth --goerli --http --datadir /var/lib/goethereum --bootnodes "enode://46add44b9f13965f7b9875ac6b85f016f341012d84f975377573800a863526f4da19ae2c620ec73d11591fa9510e992ecc03ad0751f53cc02f7c7ed6d55c7291@94.237.54.114:30313,enode://119f66b04772e8d2e9d352b81a15aa49d565590bfc9a80fe732706919f8ccd00a471cf8433e398c55c4862aadb4aadf3a010201483b87e8358951698aa0b6f07@13.250.50.139:30303"
```

保存文件之后退出。然后重启服务并观察。

```Powershell
$ sudo systemctl daemon-reload
$ sudo systemctl start geth
$ sudo journalctl -fu geth.service
```

启动后显示应该类似下方截图：



![p7](https://i.ibb.co/BNJYmFT/7.png)



在运行信标链之前，你需要等待节点同步完成。点击此处访问最新的区块。

比如，上方截图显示了节点正在处理区块 `number=498880` ，再看看下方截图，显示最新的区块是 `3270051`。也就是说，我们还有一段时间才能完成同步。



![p8](https://i.ibb.co/LYQWQV9/8.png)



接下来，我们将克隆并构建Prysm软件 (信标链节点和验证者)。考虑在此开启一个新的终端，以便继续观察Eth1节点的同步情况。



# 第4步：安装Bazel

Bazel是一个开源的构建工具。我们将使用它来编译Prysm软件。

[Curl](https://curl.haxx.se/)是必须要有的，以便我们下载Prysm代码。

```Powershell
$ sudo apt install curl gnupg
```

下载并添加Bazel gpg分流URI作为软件包源。

```Powershell
$ curl -fsSL https://bazel.build/bazel-release.pub.gpg | gpg --dearmor > bazel.gpg
$ sudo mv bazel.gpg /etc/apt/trusted.gpg.d/
$ echo "deb [arch=amd64] https://storage.googleapis.com/bazel-apt stable jdk1.8" | sudo tee /etc/apt/sources.list.d/bazel.list
```

根据Bazel的[文档](https://docs.bazel.build/versions/3.4.0/install-ubuntu.html)，组件名称 “jdk1.8” 为之前版本所遗留下来的，与受支持或被包含的JDK版本不再相关。

安装Bazel，首先安装最新的版本，然后安装3.2.0 (Prysm目前要求3.2.0版本)。

```Powershell
$ sudo apt update && sudo apt install bazel
$ sudo apt update && sudo apt full-upgrade
$ sudo apt update && sudo apt install bazel-3.2.0
```

先把需要的文件安装了，以允许我们使用flag `--config=release` 进行编译。

```Powershell
$ sudo apt install -y libtinfo5 # Terminal handling
$ sudo apt-get install -y libssl-dev # OpenSSL 
$ sudo apt-get install -y libgmp-dev # GMP source to build BLS
```



# 第5步：安装和构建Prysm

Prysm客户端由两份二进制文件组成：信标链节点和验证者客户端。本教程将讲解二者的构建。

首先，访问https://github.com/prysmaticlabs/prysm/releases并找到最新发布的Prysm版本。通常在页面的最顶部，比如：



![p9](https://i.ibb.co/MPpyyMQ/9.png)



> 注意：我们要提出最新的版本，而不是`*master*`，因为该版本可能不稳定。

我们将上述的标签`v1.0.0-beta.3` 输入到下列的命令行中，以克隆特定的版本。flag `--single-branch` 阻止获取所有的分支。

```Powershell
$ git clone -b v1.0.0-beta.3 --single-branch https://github.com/prysmaticlabs/prysm.git
$ cd prysm
```

使用Bazel来编译信标链和验证者二进制文件。

```Powershell
$ bazel build //beacon-chain:beacon-chain --config=release
$ bazel build //validator:validator --config=release
```

首次构建信标链需要花点时间，是时候喝点饮料补充补充水分了。也可以阅读我[其他的文章](https://someresat.medium.com/)。

If both builds succeed then continue. If not get help on the [Prysm Discord](https://discord.gg/VaQcHq76yJ).

构建验证者的速度更快，因为其容量更小，而且在构建信标链时，大多数依赖已经被下载以及/或者构建。

如果两者的构建都成功了，就继续。不过不成功，可以去 [Prysm Discord](https://discord.gg/VaQcHq76yJ)请求帮助。

> 注意：如果你需要使用Prysmatic Labs的最新代码来更新二进制文件，请根据文末的指南“附录——更新Prysm”进行操作。



# 第6步：配置信标链

我们将把节点作为服务那样来配置并运行，因此如果系统重启，这个过程将自动重新开始。

## 设置账户和目录

为信标节点的运行创建一个账户。这种账户不能用来登录进入服务器。

```Powershell
$ sudo useradd --no-create-home --shell /bin/false prysm-beaconchain
```

为信标节点的数据库创建数据目录，以便用来存储信标链数据。

```Powershell
$ sudo mkdir -p /var/lib/prysm/beaconchain
```

设置权限。账户 `prysm-beaconchain` 需要权限来修改数据库目录。

```Powershell
$ sudo chown -R prysm-beaconchain:prysm-beaconchain /var/lib/prysm/beaconchain
```

## 复制信标链二进制

接下来，复制粘贴最新的已编制的信标链二进制文件至目录 `/usr/local/bin` 中。我们将从该目录中运行这份文件。

> 注意：每一次提取/构建 `*beacon-chain*` 二进制新版本时都需要做这一步。参考文末的“附录——更新Prysm”。

```Powershell
$ cd ~
$ sudo cp prysm/bazel-bin/beacon-chain/beacon-chain_/beacon-chain /usr/local/bin
```

## 创建和配置服务

创建一个systemd服务文档来存储服务配置。

```Powershell
$ sudo nano /etc/systemd/system/prysm-beaconchain.service
```

复制粘贴下列代码至文档中。

```Powershell
[Unit]
Description=Prysm Beaconchain
Wants=network-online.target
After=network-online.target[Service]
Type=simple
User=prysm-beaconchain
Group=prysm-beaconchain
Restart=always
RestartSec=5
ExecStart=/usr/local/bin/beacon-chain --pyrmont --datadir=/var/lib/prysm/beaconchain --http-web3provider=http://127.0.0.1:8545 --accept-terms-of-use[Install]
WantedBy=multi-user.target
```

`--pyrmont` 用以标明我们正在测试网上运行。

`--http-web3provider` 确定了Eth1节点的端口。如果你在本地安装了一个，值是`http://127.0.0.1:8545`。如果你正使用第三方服务，请使用外部端口地址 (如，Infura或者Prysmatic的Eth1节点：`https://goerli.prylabs.net` )

`--accept-terms-of-use`使我们能够将二进制文件作为服务运行。使用该 flag 表明你已接受Prysm的[使用条款](https://github.com/prysmaticlabs/prysm/blob/master/TERMS_OF_SERVICE.md)。

你的文档需参考下方的截图，保存然后退出。



![p10](https://i.ibb.co/64bGVR1/10.png)



重新加载 systemd 以显示上述的更改。

```Powershell
$ sudo systemctl daemon-reload
```

> 注意：如果你运行一个本地的Eth1节点 (参考第3步)，你需要等到数据完全同步完成之后才能启动信标链服务。在这里查看进程：`*sudo journalctl -fu geth.service*`。

启动服务并确保其正常运行。

```Powershell
$ sudo systemctl start prysm-beaconchain
$ sudo systemctl status prysm-beaconchain
```

应如下方截图。



![p11](https://i.ibb.co/QrzZG2G/11.png)



如果你每一步都做对了，它会用绿色字体显示”active (running)"。如果没有显示，你需要倒回去重复上述步骤，修复问题。按Q退出。

允许服务在系统重启时自动启动。

```Powershell
$ sudo systemctl enable prysm-beaconchain
```

信标链将开始同步，节点完全同步可能需要几个小时。你可以运行 journal 命令来追踪进程。按Ctrl+C退出。

```Powershell
$ sudo journalctl -fu prysm-beaconchain.service
```

终端输出会给出状态信息，表明它正在处理来自Eth1链的存款。



![p12](https://i.ibb.co/YbNzv96/12.png)



现在你的信标链正作为服务运行。恭喜！



# 第7步：进入Pyrmont

为了能在Eth2.0 Pyrmont测试网上运行验证者节点，我们将需要注册一个或多个验证者账户。

> 注意：如果你已经生成了你的存款数据并提交了你的质押存款，你可以跳过这一步。如果你是在别处生成的，你需要复制你的验证者密钥到这个服务器上。

注册步骤如下：

- 获取Göerli ETH
- 生成验证者密钥。一个密钥代表一个验证者账户。
- 向每个验证者账户各存入32个Göerli ETH
- 等候你的验证者账户被激活

那我们现在就开始吧！

## 获取Goerli ETH

1. 使用已经安装了浏览器插件MetaMask的计算机。
2. 点击MetaMask然后登录
3. 点击顶部的下拉菜单，选择**Göerli 测试网络**
4. 点击账户名，复制你的Göerli 测试网钱包地址
5. 使用你的地址从[authenticated faucet](https://faucet.goerli.mudit.blog/)获取Göerli ETH，或者通过在 [ethstaker Discord](https://discord.gg/7z8wzehjrJ)上的`#request-goerli-eth`频道使用机器人命令：`!goerliEth <yourwalletaddress>`。

> 注意：一个验证者需要一笔32个ETH的存款。你的MetaMask钱包需要有充足的 Göerli ETH存进每个验证者客户端里。例如，如果你想要运行10个验证者，拿你就需要320个Göerli ETH以及一些额外的钱 (比如1个Göerli ETH) 来支付gas费。

## 生成验证者密钥

接下来我们要生成验证者密钥。验证者客户端支持多个验证者密钥。在Pyrmont测试网上基本上一个验证者密钥代表一个“验证者账户”。

前往[这里](https://github.com/ethereum/eth2.0-deposit-cli/releases/)获取存款命令行接口应用的“最新发布”。



![p13](https://i.ibb.co/9wt6NsR/13.png)



在“asset"一栏复制这个链接到Linux版本。我们将使用该链接来下载它，如下所示。修改指令里的URL名为最新版本的下载链接。

```Powershell
$ cd ~
$ curl -LO https://github.com/ethereum/eth2.0-deposit-cli/releases/download/v1.1.0/eth2deposit-cli-ed5a6d3-linux-amd64.tar.gz
```

打开tar存档

```Powershell
$ tar xvf eth2deposit-cli-ed5a6d3-linux-amd64.tar.gz
$ cd eth2deposit-cli-ed5a6d3-linux-amd64
```

清除下载的tar存档文档

```Powershell
$ rm -rf eth2deposit-cli-ed5a6d3-linux-amd64.tar.gz
```

运行应用来生成验证者密钥

> 注意：如果是在主网，这一步应在一台没有连接过网络的全新的机器上进行，以防泄露你的助记符。

将`<numberofvalidators>`修改为你想要创建的验证者密钥数。例如：`--num_validators 5`

```Powershell
$ ./deposit new-mnemonic --num_validators <numberofvalidators> --mnemonic_language=english --chain pyrmont
```

它会要求你创建一个钱包密码。我们将使用它来将验证者密钥加载到你客户端的验证者钱包。把它备份到安全的地方。



![p14](https://i.ibb.co/42Mc0cQ/14.png)



它会生成一个种子短语 (助记符)。把它备份到其他地方。



![p15](https://i.ibb.co/vXFQxtP/15.png)



一旦你已经确认了你的助记符，你的验证者密钥就会被创建。



![p16](https://i.ibb.co/9Y4Pt1g/16.png)



新创建的验证者密钥和存款数据文档会在一个特定地方被创建。



![p17](https://i.ibb.co/zZ6Qbr3/17.png)



`deposit_data-[timestamp].json`文档包含了验证者的公钥和存款的相关信息。这个文档会在下一步用来完成存款进程。由于我们是在一个服务器上，而没有一个网络浏览器，因此要使用 [secure FTP (SFTP)](https://www.maketecheasier.com/use-sftp-transfer-files-linux-servers/) 把文档迁移到一部运行MetaMask的计算机上。

`keystore-m...json`文档包含加密的签名密钥。每个验证者账户都有一个 keystore-m。这些会被用来创建客户端验证者钱包。

## 进行验证者存款

这一步涉及将所需的Göerli ETH 存入Pyrmont测试网的质押合约。这一步会在Eth2.0 Launchpad网站上完成

> 提醒：不要发送真正的ETH到Pyrmont测试网，否则等于弄丢你的ETH。

Pyrmont测试网的Launchpad:https://pyrmont.launchpad.ethereum.org/

一直随着屏幕切换点击这些提醒步骤，并选择你打算运行的验证者数量。往下滚动，点击Continue (继续)。



![p18](https://i.ibb.co/SrmFqwc/18.png)



你会被要求上传`deposit_data-[timestamp].json`文档。这个文档你是在上一步生成的。浏览或拖拉这个文档，然后点击Continue。



![p19](https://i.ibb.co/wKqz5zt/19.png)



连接你的钱包。选择MetaMask，登录，选择Göerli 测试网络并点击Continue

> 提醒：Lauchpad应该会阻止你使用Göerli测试网以外的网络，但请100%确认你在MetaMask选择的是Göerli测试网络。不要发送真的ETH到Pymont测试网。



![p20](https://i.ibb.co/ZLGDQsh/20.png)



你MetaMask的余额会显示出来。如果你有充足的Göerli ETH余额，这个网站会允许你继续。



![p21](https://i.ibb.co/XFhCJpY/21.png)



然后会出现一个Summary (总结)，显示验证者数和所需的Göerli ETH数量。如果你同意的话就给那些方框打勾，然后点击Continue。



![p22](https://i.ibb.co/5c7BZwd/22.png)



点击"Initiate All Transactions" (启动所有交易）。会有多个MetaMask实例弹出，每个都对Pyrmont测试网提出一个32个Göerli ETH的交易请求。请确认每一笔交易。



![p23](https://i.ibb.co/sFbLGWt/23.png)



当所有的交易都成功完成时，你的质押也完成了！



![p24](https://i.ibb.co/477pzkH/24.png)



## 查看你的验证者存款状态

新加入的验证者需要等一下 (几个小时到几天不等)才能激活。你可以以下几步来查看你的密钥状态：

1. 复制你的Göerli测试网钱包地址
2. 前往：https://pyrmont.beaconcha.in/
3. 搜索你的钱包地址。你的密钥会显示出来。

点击一个密钥可以看到“预期激活”信息。



![p25](https://i.ibb.co/wLWnK2H/25.png)



完成了！现在创建验证者钱包吧！



# 第8步：创建验证者钱包

创建一个目录以存储验证者钱包数据，并授予当前用户访问该目录的权限。在 `<yourusername>` 修改登入用户名。这是创建钱包时暂时的设定。在后面我们会重新分配权限给验证者。

```Powershell
$ sudo mkdir -p /var/lib/prysm/validator
$ sudo chown -R <yourusername>:<yourusername> /var/lib/prysm/validator
```

然后，我们会使用我们之前创建的Prysm验证者二进制文档来创建一个密钥钱包，并使用我们在上一步生成的密钥。把你生成的验证者密钥路径填到 `<PathToValidatorKeys>`，例如：`-- keys-dir=$HOME/eth2.0-deposit-cli/validator_keys`

```Powershell
$ cd prysm
$  bazel run //validator:validator -- accounts import --keys-dir=<PathToValidatorKeys> --accept-terms-of-use --pyrmont
```

> 注意：你第一次运行这个命令时可能需要稍微等一下。

它会要求你提供一个钱包目录。这时会创建一个你的新钱包。使用`/var/lib/prysm/validator`。这是这一步骤一开始时你授予`<yourusername>`访问权限的位置。

```Powershell
Enter a wallet directory (default: /home/ethstaker/.eth2validators/prysm-wallet-v2):
/var/lib/prysm/validator
```

你会被要求提供一个新的钱包密码。确保你把它保存在安全的地方！我们在后面配置验证者时会用到。

```Powershell
Password requirements: at least 8 characters including at least 1 alphabetical character, 1 number, and 1 unicode special character. Must not be a common password nor easy to guess
New wallet password:
Confirm password:
[2020-11-18 21:47:26]  INFO accounts: Successfully created new wallet wallet-path=/var/lib/prysm/validator
```

接下来，你需要输入你在 [Eth2 Launch Pad](https://pyrmont.launchpad.ethereum.org/)网站上用来创建验证者密钥的密码。如果输入正确，账户会被导入到新的钱包。

```Powershell
Enter the password for your imported accounts:
Importing accounts, this may take a while...
Importing accounts... 100% [==========================================]  [2s:0s]
Successfully imported 2 accounts, view all of them by running accounts list
```

确认你已经创建了验证者账户。

```Powershell
$ bazel run //validator:validator -- accounts list --pyrmont --wallet-dir /var/lib/prysm/validator --accept-terms-of-use
```

显示如下:

```Powershell
Showing 2 validator accounts
View the eth1 deposit transaction data for your accounts by running `validator accounts list --show-deposit-dataAccount 0 | loosely-apparent-feline
[validating public key] 0x8c8b19c544d79bdaf60d7dcc86ebaeeed5d804d2ecb4c66e5b27e19a664a81457a1c02a873a110e1d332abce5800cf7fAccount 1 | remarkably-tight-herring
[validating public key] 0xa79583298ecbd5564fce6ccefe2e69967705aff950235dc59ae303fa210b029b565c08303eb18cf02ecc26c429059d7f
```

创建一个文档来储存钱包密码，验证者就可以访问钱包而无须人工提供密码。这个文档命名为password.txt。

```Powershell
$ touch /var/lib/prysm/validator/password.txt
$ sudo nano /var/lib/prysm/validator/password.txt
```

把你的新钱包密码添加到这个文档。保存并退出。



![p26](https://i.ibb.co/QQTvWPF/26.png)



移除群组和其他人的访问权限以保护文档。

```Powershell
$ sudo chmod go-rw /var/lib/prysm/validator/password.txt
```

完成了！现在验证者钱包和密码文档都配置好了，我们接下来要把验证者节点作为服务来配置并运行。



# 第9步：配置验证者节点

## 设置账户和目标

我们将把验证者节点作为服务来配置并运行，因此如果系统重启，这个进程将自动重新开始。

为服务的运行创建一个账户。这种类型的账户不能用来登录进入服务器。

```Powershell
$ sudo useradd --no-create-home --shell /bin/false prysm-validator
```

我们为在上一步的验证者`/var/lib/prysm/validator`创建数据目录。现在设置目录权限，这样账户`prysm-validator`就可以修改验证者账户的数据目录。

```Powershell
$ sudo chown -R prysm-validator:prysm-validator /var/lib/prysm/validator
```

下一步，复制之前编译的验证者二进制文档到目录`/usr/local/bin`。

> 注意：每一次你拉取/创建一个新版本的验证者二进制文档都需要做这一步。查看教程最后的**附录——更新Prysm**。

```Powershell
$ cd ~
$ sudo cp prysm/bazel-bin/validator/validator_/validator /usr/local/bin
```

## 创建和配置服务

创建一个systemd服务文档来储存config文档的服务。

```Powershell
$ sudo nano /etc/systemd/system/prysm-validator.service
```

完整复制粘贴下面这段代码，除了：在`<POAPstring>` 填上你个人喜欢的文字，例如： `--graffiti "abcdefg12345"`

```Powershell
[Unit]
Description=Validator
Wants=network-online.target
After=network-online.target[Service]
Type=simple
User=prysm-validator
Group=prysm-validator
Restart=always
RestartSec=5
ExecStart=/usr/local/bin/validator --pyrmont --datadir=/var/lib/prysm/validator --wallet-dir=/var/lib/prysm/validator --wallet-password-file=/var/lib/prysm/validator/password.txt --graffiti="<POAPString>" --accept-terms-of-use[Install]
WantedBy=multi-user.target
```

`--pyrmont`这个flag需要表明我们正在测试网上运行

`--accept-terms-of-use`这个flag需要用来将二进制文档作为服务来运行。使用这个flag表示接受Prysm的[使用条款](https://github.com/prysmaticlabs/prysm/blob/master/TERMS_OF_SERVICE.md)。

参考下方的截图。保存并退出。



![p27](https://i.ibb.co/rG4N7Sj/27.png)



重新加载systemd以显示更改。

```Powershell
$ sudo systemctl daemon-reload
```

启动服务并检查，确保正确运行。

```Powershell
$ sudo systemctl start prysm-validator
$ sudo systemctl status prysm-validator
```

你看到的输出应该如下图所示。



![p28](https://i.ibb.co/Mg8gGTJ/28.png)



如果你每一步都做对了，它会用绿色字体显示”active (running)"。如果没有显示，你需要倒回去重复上述步骤，修复问题。按Q退出 。

允许服务随系统重启而自动重启。

```Powershell
$ sudo systemctl enable prysm-validator
```

你可以通过运行日志命令来检查进程。按Ctrl+C 退出。

```Powershell
$ sudo journalctl -fu prysm-validator.service
```

信标链可能需要几小时到几天的时间来同步Eth1节点的数据。如果信标链已经完成了同步，它可能需要几小时或几天来激活验证者账户。验证者进程的输出会显示它的状态。

```Powershell
Nov 18 21:54:35 ETH-STAKER-001 validator[119395]: time="2020-11-18 21:54:35" level=info msg="Waiting for deposit to be observed by beacon node" prefix=validator pubKey=0x8c8b19c544d7 status="UNKNOWN_STATUS"
```

你可以通过[beaconcha.in](https://pyrmont.beaconcha.in/)查看你的验证者状态。只需要搜索你的验证者公钥或使用你的MetaMask （或其他）钱包地址进行搜索。你的数据可能要过一段时间才会在网站上显示。



![p29](https://i.ibb.co/zhHX5KX/29.png)



这一步结束了。我们现在有一条运行中的信标链和一个验证者节点。恭喜你！你棒棒的！



# 第10步：安装Prometheus

Prometheus是一个提供监测功能和警报工具箱的开源系统。它在你的Ubuntu服务器上作为一个服务来运行，而它的职责就是去抓取数据。更多信息请看[这里](https://prometheus.io/docs/introduction/overview/)。

我们会使用Prometheus公开信标链、验证者的运行时数据和特定用例数据。

## 创建用户账户

这些服务是在账户下运行的。这些账户不能登录到服务器。

```Powershell
$ sudo useradd --no-create-home --shell /bin/false prometheus
$ sudo useradd --no-create-home --shell /bin/false node_exporter
```

## 创建目录

程序与数据目录。

```Powershell
$ sudo mkdir /etc/prometheus
$ sudo mkdir /var/lib/prometheus
```

设置目录的所有权。`prometheus`账户会管理这些。

```Powershell
$ sudo chown -R prometheus:prometheus /etc/prometheus
$ sudo chown -R prometheus:prometheus /var/lib/prometheus
```

## 下载Prometheus软件

从[Prometheus下载页面](https://prometheus.io/download/)修改最新版本的版本号。Rpi用户一定要获取ARM二进制文档。

```Powershell
$ cd ~
$ curl -LO https://github.com/prometheus/prometheus/releases/download/v2.22.0/prometheus-2.22.0.linux-amd64.tar.gz
```

打开tar存档。它包含两个二进制文档和一些内容文档。

```Powershell
$ tar xvf prometheus-2.22.0.linux-amd64.tar.gz
```

复制二进制文档到下列位置。

```Powershell
$ sudo cp prometheus-2.22.0.linux-amd64/prometheus /usr/local/bin/
$ sudo cp prometheus-2.22.0.linux-amd64/promtool /usr/local/bin/
```

设置目录的所有权。`prometheus`账户会管理这些。

```Powershell
$ sudo chown -R prometheus:prometheus /usr/local/bin/prometheus
$ sudo chown -R prometheus:prometheus /usr/local/bin/promtool
```

复制这些内容文档到下列位置。

```Powershell
$ sudo cp -r prometheus-2.22.0.linux-amd64/consoles /etc/prometheus
$ sudo cp -r prometheus-2.22.0.linux-amd64/console_libraries /etc/prometheus
```

设置目录和文档 (-R) 的所有权。`prometheus`账户会管理这些。

```Powershell
$ sudo chown -R prometheus:prometheus /etc/prometheus/consoles
$ sudo chown -R prometheus:prometheus /etc/prometheus/console_libraries
```

移除下载存档。

```Powershell
$ rm -rf prometheus-2.22.0.linux-amd64.tar.gz prometheus-2.22.0.linux-amd64
```

## 编辑配置文档

Prometheus使用一个配置文档，这样它就知道去哪里获取数据。

打开YAML配置文档来编辑。

```Powershell
$ sudo nano /etc/prometheus/prometheus.yml
```

复制下面的代码到文档，注意不要进行任何其他编辑，并退出保存文件。

```Powershell
global:
  scrape_interval:     15s # Set the scrape interval to every 15 seconds. Default is every 1 minute.
  evaluation_interval: 15s # Evaluate rules every 15 seconds. The default is every 1 minute.
  # scrape_timeout is set to the global default (10s).
# Alertmanager configuration
alerting:
  alertmanagers:
  - static_configs:
    - targets:
      # - alertmanager:9093
# Load rules once and periodically evaluate them according to the global 'evaluation_interval'.
rule_files:
  # - "first_rules.yml"
  # - "second_rules.yml"
# A scrape configuration containing exactly one endpoint to scrape:
# Here it's Prometheus itself.
scrape_configs:
  - job_name: 'validator'
    static_configs:
      - targets: ['localhost:8081']
  - job_name: 'beacon node'
    static_configs:
      - targets: ['localhost:8080']
  - job_name: 'node_exporter'
    static_configs:
      - targets: ['localhost:9100']
```

scrape_config对不同的分工名称给出定义。我们有三个分工名称：validator (验证者)、beacon node (信标节点) 和node_exporter。前两个的职责很明显，最后一个是用作与服务器用例本身 (内存、CPU、磁盘、网络等) 相关的数据。我们将在下面安装并配置node_exporter。

给config文档设置所有权。prometheus账户将拥有这个所有权。

```Powershell
$ sudo chown -R prometheus:prometheus /etc/prometheus/prometheus.yml
```

最后，测试服务器是否运行正确。

```Powershell
$ sudo -u prometheus /usr/local/bin/prometheus \
    --config.file /etc/prometheus/prometheus.yml \
    --storage.tsdb.path /var/lib/prometheus/ \
    --web.console.templates=/etc/prometheus/consoles \
    --web.console.libraries=/etc/prometheus/console_libraries
```

输出应该如下。按Ctrl + C退出。

```Powershell
level=info ts=2020-10-21T07:18:00.434Z caller=main.go:684 msg="Server is ready to receive web requests."
```

## 将Prometheus设为自动启动的服务。

创建一个systemd服务文档来保存服务配置，它会告诉systemd文档把Prometheus作为prometheus用户来运行，配置文档在目录的保存路径为/etc/prometheus/prometheus.yml，并把数据保存在目录的这里/var/lib/prometheus .

```Powershell
$ sudo nano /etc/systemd/system/prometheus.service
```

将下面的代码复制粘贴到文档。退出并保存。

```Powershell
[Unit]
Description=Prometheus
Wants=network-online.target
After=network-online.target[Service]
Type=simple
User=prometheus
Group=prometheus
Restart=always
RestartSec=5
ExecStart=/usr/local/bin/prometheus \
    --config.file /etc/prometheus/prometheus.yml \
    --storage.tsdb.path /var/lib/prometheus/ \
    --web.console.templates=/etc/prometheus/consoles \
    --web.console.libraries=/etc/prometheus/console_libraries[Install]
WantedBy=multi-user.target
```

重新加载systemd以显示更改。

```Powershell
$ sudo systemctl daemon-reload
```

然后用下面的命令来启动服务，并查看状态以确保运行正确。

```Powershell
$ sudo systemctl start prometheus
$ sudo systemctl status prometheus
```

输出应该如下图：



![p30](https://i.ibb.co/gz3DPMd/30.png)



如果你每一步都做对了，它会用绿色字体显示”active (running)"。如果没有显示，你需要倒回去重复上述步骤，修复问题。按Q退出 。

最后，允许Prometheus随系统启动而启动。

```Powershell
$ sudo systemctl enable prometheus
```



# 第11步：安装Node Exporter

Prometheus会提供关于信标链和验证者的数据。如果我们想要我们Ubuntu用例的数据，我们需要一个叫[Node_Exporter](https://github.com/prometheus/node_exporter)的extension。如果你在下面指定其他版本，你可以在[这里](https://prometheus.io/download/)找到最新的稳定版本。Rpi用户记得要获取ARM二进制文档。

```Powershell
$ cd ~
$ curl -LO https://github.com/prometheus/node_exporter/releases/download/v1.0.1/node_exporter-1.0.1.linux-amd64.tar.gz
```

打开下载了的软件。

```Powershell
$ tar xvf node_exporter-1.0.1.linux-amd64.tar.gz
```

复制二进制文档到目录/usr/local/bin，并设置用户与群组对我们在前面创建的node_exporter用户的所有权。

```Powershell
$ sudo cp node_exporter-1.0.1.linux-amd64/node_exporter /usr/local/bin
$ sudo chown -R node_exporter:node_exporter /usr/local/bin/node_exporter
```

移除下载了的存档。

```Powershell
$ rm -rf node_exporter-1.0.1.linux-amd64.tar.gz node_exporter-1.0.1.linux-amd64
```

## 将Node Exporter设置为自动启动的服务

创建一个systemd服务文档来储存服务config文档，它会告诉systemd把Node_Exporter 作为node_exporter用户来运行。

```Powershell
$ sudo nano /etc/systemd/system/node_exporter.service
```

复制下列代码到文档。退出并保存。

```Powershell
[Unit]
Description=Node Exporter
Wants=network-online.target
After=network-online.target[Service]
User=node_exporter
Group=node_exporter
Type=simple
ExecStart=/usr/local/bin/node_exporter[Install]
WantedBy=multi-user.target
```

重新加载systemd以显示更改。

```Powershell
$ sudo systemctl daemon-reload
```

然后按下面的命令启动服务并检查状态，确保运行正确。

```Powershell
$ sudo systemctl start node_exporter
$ sudo systemctl status node_exporter
```

输出应该如下图。



![p31](https://i.ibb.co/McQtC0X/31.png)



如果你每一步都做对了，它会用绿色字体显示”active (running)"。如果没有显示，你需要倒回去重复上述步骤，修复问题。按Q退出 。

最后，允许Node Exporter随系统启动而启动。

```Powershell
$ sudo systemctl enable node_exporter
```

## 测试Prometheus和Node Exporter

所有东西都准备就绪了。通过在防火墙打开一个端口 (请参阅步骤2）和浏览`http://<yourserverip>:9090`你可以有选择性地测试它的功能。在那里你可以运行查询以查看不同的数据。例如，你可以试这个查询来看还有多少可用内存：

```Powershell
http://<yourserverip>:9090/new/graph?g0.expr=node_memory_MemFree_bytes&g0.tab=1&g0.stacked=0&g0.range_input=1h
```

或者试这个查询来看你所有验证者的余额。

```Powershell
http://<yourserverip>:9090/graph?g0.range_input=1h&g0.expr=validator_balance&g0.tab=1
```



# 第12步：安装Grafana

Prometheus是我们的数据来源，而Grafana则给我们提供报告仪表盘数据的功能。接下来安装Grafana并配置仪表盘。

我们会用一个APT仓库来安装，因为这会使得安装和更新更简单。Grafana可以在官方的Ubuntu软件包仓库中找到，但那个版本可能不是最新的，因此我们将使用Grafana的官方仓库。

用wget下载Grafana GPG的密钥，然后将输出传送到apt-key。这会将密钥添加到你的APT安装的信任密钥列表中。

```Powershell
$ wget -q -O - https://packages.grafana.com/gpg.key | sudo apt-key add -
```

把Grafana仓库加到APT的来源里。

```Powershell
$ sudo add-apt-repository "deb https://packages.grafana.com/oss/deb stable main"
```

刷新apt缓存。

```Powershell
$ sudo apt update
```

确认Grafana是从仓库安装的。

```Powershell
$ apt-cache policy grafana
```

输出应该如下：

```Powershell
grafana:
  Installed: (none)
  Candidate: 7.2.1
  Version table:
     7.2.1 500
        500 https://packages.grafana.com/oss/deb stable/main amd64 Packages
     7.2.0 500
        500 https://packages.grafana.com/oss/deb stable/main amd64 Packages
     7.1.5 500
        500 https://packages.grafana.com/oss/deb stable/main amd64
     ...
```

检查顶部显示的版本是否与[这里](https://grafana.com/grafana/download)显示的最新版本一致。然后继续安装。

```Powershell
$ sudo apt install grafana
```

启动Grafana服务器和检查状态，确保运行正确。

```Powershell
$ sudo systemctl start grafana-server
$ sudo systemctl status grafana-server
```

输出应该如下图：



![p32](https://i.ibb.co/NK3C58Z/32.png)



如果你每一步都做对了，它会用绿色字体显示”active (running)"。如果没有显示，你需要倒回去重复上述步骤，修复问题。按Q退出。

允许Grafana随系统启动而启动。

```Powershell
$ sudo systemctl enable grafana-server
```

## 配置Grafana登录

能做到这一步已经很棒了！现在一切都设置好并开始运行了，你可以在浏览器里前往`http://<yourserverip>:3000/`，会出现Grafana的登录窗口。

> 注意：这不是安全的连接。用于测试网可以，但用于主网的话需要安全的HTTPS连接。

在`admin`输入用户名和密码。系统会让你修改密码，请务必修改。

## 配置Grafana的数据来源

让我们配置数据来源吧。把你的鼠标移至左边菜单栏的齿轮图标处，会弹出一个菜单——选择`Data Sources`。



![p33](https://i.ibb.co/4dMmF8R/33.png)



点击 `Add Data Source`，然后选择`Prometheus`。在URL输入`http://localhost:9090`，然后点击 `Save and Test`。



![p34](https://i.ibb.co/sWsHzQz/34.png)





![p35](https://i.ibb.co/mzL51L5/35.png)



## 导入Grafana仪表盘

移动你的鼠标到左边菜单栏的`+`图标，会有一个菜单弹出，选择 `Import`。

从[这里](https://raw.githubusercontent.com/GuillaumeMiralles/prysm-grafana-dashboard/master/less_10_validators.json)复制粘贴JSON (或者[这里](https://raw.githubusercontent.com/GuillaumeMiralles/prysm-grafana-dashboard/master/more_10_validators.json)，如果你有多于10个验证者)，点击`Load`，然后`Import`。你应该可以看到仪表盘。一开始的时候，你可能不会有很多数据，但在测试网启动和验证者激活一段时间后，你会看到一些数据和警报。



![p36](https://i.ibb.co/XzxVZTC/36.png)



你还可以在Telegram和Discord上获得警报信息。在[这里](https://docs.prylabs.network/docs/prysm-usage/monitoring/grafana-dashboard/)查看指引。



# 写在最后

到这里就完成了！希望这个教程能帮到你。

- 在以后的更新里会有内容更全面的仪表盘 (额外的硬件数据和eth1节点的数据)
- 如果你有任何反馈，你可以在[Twitter](https://www.twitter.com/SomerEsat) 或 [Reddit](https://www.reddit.com/user/SomerEsat)上联系窝
- 如果你喜欢这个教程并希望别人也能学习这个教程，请用[friends link](https://medium.com/@SomerEsat/4d2a86cc637b?source=friends_link&sk=4cb64bfa20247d2b5c7a50ce0a92d33b)把教程分享出去！
- 支持一下：somer.eth



# 附录——Prysm更新

如果由于Git仓库里的改动你需要更新代码，可以按照这些步骤来获取最新的文档和创建自己的二进制文档。

确保你已经安装了下列条件以支持`--config=release`的使用。

```Powershell
$ sudo apt install -y libtinfo5 # Terminal handling
$ sudo apt-get install -y libssl-dev # OpenSSL 
$ sudo apt-get install -y libgmp-dev # GMP source to build BLS
```

前往[这里](https://github.com/prysmaticlabs/prysm/releases)以获取发布标签 (最新的通常是最好的)，比如`v1.0.0-beta.3`。注意`rm -r prysm`会删除prysm目录，以防你想保留其中的内容。

```Powershell
$ cd ~ 
$ rm -r prysm
$ git clone -b v1.0.0-beta.3 https://github.com/prysmaticlabs/prysm.git 
$ cd prysm
$ bazel build //beacon-chain:beacon-chain --config=release
$ bazel build //validator:validator --config=release
```

接下来，我们会停止信标链和验证者服务，并复制粘贴二进制文档到目录`/usr/local/bin`，然后再次启动服务。

```Powershell
$ cd ~
$ sudo systemctl stop prysm-validator
$ sudo systemctl stop prysm-beaconchain
$ sudo cp prysm/bazel-bin/beacon-chain/beacon-chain_/beacon-chain /usr/local/bin
$ sudo cp prysm/bazel-bin/validator/validator_/validator /usr/local/bin
$ sudo systemctl start prysm-beaconchain
$ sudo systemctl status prysm-beaconchain # <-- Check for errors.
$ sudo journalctl -fu prysm-beaconchain # <-- Check for errors.
$ sudo systemctl start prysm-validator
$ sudo systemctl status prysm-validator # <-- Check for errors.
$ sudo journalctl -fu prysm-validator # <-- Check for errors.
```

完成了！服务已经更新好了。