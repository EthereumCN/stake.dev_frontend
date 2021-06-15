---
path: ce-shi-wang-03
id: 27
title: 如何参与Pyrmont测试网质押，Teku篇。
description:  '如何参与Pyrmont测试网质押，Teku篇。' 
date: 2020-06-25T02:15:01.762Z
author: Carl Beekhuizen  
---


作者 | Somer Esat 

来源 | [someresat.medium.com](https://someresat.medium.com/guide-to-staking-on-ethereum-2-0-testnet-ubuntu-pyrmont-teku-3da74372910)



![1](https://i.ibb.co/h9fQdRv/1.png)



**提醒**：不要按照这个指南与Eth2主网连接。主网指南请参考《以太坊2.0主网质押教学(Ubuntu/Teku)》。

本文详解如何通过多客户端测试网Pyrmont在以太坊2.0主网质押。主要基于以下几个技术：

- Ubuntu v20.04 (LTS) x64 服务器
- Go Ethereum 节点 ([代码分支](https://github.com/ethereum/go-ethereum))
- ConsenSys的以太坊2.0客户端，Teku ([代码分支](https://github.com/PegaSysEng/teku))
- 正式多客户端测试网公网，[Pyrmont](https://github.com/protolambda/pyrmont)
- 浏览器插件加密钱包 [MetaMask](https://metamask.io/)
- [Prometheus](https://prometheus.io/) 参数
- [Grafana](https://grafana.com/) 仪表盘

此篇指南包括以下指令：

- 连接并安全配置一个新运行的Ubuntu服务器用例
- 配置一个以太坊1.0节点并将其作为服务运行
- 生成Pyrmont验证者账户密钥并存入资产
- 导入Pyrmont验证者账户密钥到Teku客户端里
- 给以太坊2.0与Pyrmont测试网阶段0编译并配置Teku客户端软件，并把它们作为服务来运行
- 安装和配置Prometheus参数，设置一个Grafana仪表盘



# 提醒

此指南是用于Pyrmont测试网的。切记无论如何不要向测试网发送主网的ETH。你发送了就等于丢失了。

**不要**按照这份指南连接Eth2主网。主网专用指南请参考《以太坊2.0主网质押教学(Ubuntu/Teku)》。



# 致谢与免责声明

本教程参考了网上的各种资料，感谢这些提供资料的贡献者！

感谢 [ConsenSys Discord](https://discord.gg/trQ378WCp4) 中#teku 频道以及[EthStaker](https://discord.gg/7z8wzehjrJ)团队的人在discord上提供的帮助与审校。

特别感谢Eth2 客户端团队和以太坊基金会的研究员。他们经过几年的不懈努力，将我们带到这难以置信的时刻——Eth2.0成功创世。

此教程仅作教育用途。我不是本文涉及的任何技术的专家。不保证此教程内容的准确性，因遵循此教程而造成的损失，本人概不负责。



# 支持

- 这个过程可能有些棘手。除了我之外，以下是两个你可以寻求帮助的好资源 :

- EthStaker社区是一个以太坊2.0 Staking 社区，资源丰富且十分友好。
  - Reddit：https://www.reddit.com/r/ethstaker/
  - Discord：https://discord.gg/7z8wzehjrJ
- Teku 客户端团队的Discord: https://discord.gg/trQ378WCp4，他们是客户端软件的工程团队，是使用Teku专家。



# 条件

使用本教程需要对以太坊、ETH、Staking、测试网、Linux 和 MetaMask 有一定的背景知识。

此教程还需要在开始前安装并运行：

- [Ubuntu 服务器 v20.04 (LTS) amd64](https://ubuntu.com/tutorials/install-ubuntu-server#1-overview) 或者一个较新的，在本地计算机、你的网络、或云端 (AWS、Digital Ocean、Microsoft Azure等)安装和运行的Ubuntu服务器。推荐使用本地计算机，以提高网络的去中心化程度——如果云端供应商掉线了，那么托管在这个供应商的节点都会离线。
- 已安装或已配置的浏览器插件加密钱包[MetaMask](https://metamask.zendesk.com/hc/en-us/articles/360015489531-Getting-Started-With-MetaMask-Part-1-)。一台装有操作系统 (Mac、Windows、Linux等) 和浏览器 (Brave、Safari、FireFox等) 的计算机。



# 树莓Pi用户注意

我没有在树莓Pi上测试过这份教程。如果你想尝试的话，只需要把下面列出的软件换成ARM版本。不保证可行。



# 要求

- Ubuntu服务器用例。我用过v20.04 (LTS) amd64服务器 VM
- 浏览器插件加密钱包MetaMask，安装并配置好
- 硬件要求是一个比较大的话题。总的来说：一个相对较新的CPU、8GB内存的RAM (16GB更佳)、一个内存至少 1TB 的SSD 、稳定的网络（足够快的下载速度以及月度数据额度），这些性能都会让质押过程更加安全顺畅。



# 概览

本教程篇幅较长，下面这个图表简要说明了质押的步骤，标黄的即是本文会覆盖到的部分：



![p2](https://i.ibb.co/gSFPstC/2.png)



整个流程可以概念化表述为：

- 设置一个Eth1 节点并同步Eth1 Göerli 测试网的数据；
- 生成验证者密钥和存款数据；
- 配置Teku客户端并同步Eth1节点数据
- 存入 32 Göerli 测试网 ETH 以激活验证者密钥

那我们现在就开始吧！



# 第0步：连接至服务器

使用一个SSH端口，连接至你的Ubuntu服务器。在默认情况下，Ubuntu上的root账户通常都是禁用的，然而有些云提供商可以启动root账户。如果你用`root`登录，最好是重新创建一个拥有管理权限的用户账户，因为使用root用户登录存在很大的[风险](https://askubuntu.com/questions/16178/why-is-it-bad-to-log-in-as-root)。

> 注意：如果你不是用`root`登录的便可以直接跳到第1步。

```
# adduser <yourusername>
```

设置一个密码并填写其他信息。

通过把新的用户加入`sudo`群组中，来授予其管理权限。

```
# usermod -aG sudo <yourusername>
```

当你用你的用户名 `<yourusername>` 登录时，可以通过在命令行前输入sudo，来以超级用户的权限执行操作。

可选：如果你通过 `root` 账户使用 [SSH 密钥](https://jumpcloud.com/blog/what-are-ssh-keys)来连接你的 Ubuntu 实例，你将需要使用 root 账户的 SSH 密钥数据来连接新账户。

```
# rsync --archive --chown=<yourusername>:<yourusername> ~/.ssh /home/<yourusername>
```

最后，退出登录你的`root`账户，然后使用你新创建的用户名`<yourusername>`登入Ubuntu服务器。



# 第1步：升级服务器

确保系统更新至最新的软件和安全设置。

```Powershell
$ sudo apt update && sudo apt upgrade
$ sudo apt dist-upgrade && sudo apt autoremove
$ sudo reboot
```



# 第2步：保护服务器

安全性十分重要。但由于本文不是针对安全性的指南，所有只列出了一些基础的设置。

## 配置防火墙

Ubuntu 20.04 服务器可以使用默认的 [UFW 防火墙](https://help.ubuntu.com/community/UFW)来限制访问该服务器的流量，不过要先设置其允许来自 SSH、Go Ethereum、Grafana、Teku 的入站流量。

**允许 SSH**

允许通过SSH连接到服务器。为了安全，接下来我们要修改默认端口22 (因为这是一个普遍的攻击矢量)。

> 注意：如果你选择不修改默认SSH端口 (不建议)，那就要加一项操作——允许默认SSH端口 `*$ sudo ufw allow 22/tcp*` ，然后跳到允许“Go Ethereum”这一步。

在1024 — 49151之间选择一个端口号，然后运行以下命令以检索尚未使用的端口号。如果显示红色 (被使用了)，就选择另一个端口。比如： `sudo ss -tulpn | grep ':6673'`

```Powershell
$ sudo ss -tulpn | grep ':<yourSSHportnumber>'
```

更新防火墙，允许`<yourSSHportnumber>` 的入站流量。SSH要求TCP协议。比如：`sudo ufw allow 6673/tcp`

```Powershell
$ sudo ufw allow <yourSSHportnumber>/tcp
```

下一步，修改默认SSH端口。

```Powershell
$ sudo nano /etc/ssh/sshd_config
```

找到默认端口`# Port 22` 或`Port 22`，然后修改你自己的端口号 `Port <yourSSHportnumber>`。删掉 `#` (如果有的话)。参考下方的截图，你的文档应该和下图展示的类似 (除了端口号不一样)。保存然后退出。



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

允许来自Go Ethereum对等节点 (端口30303/TPC 和 30303/UDP) 的入站请求。如果你使用第三方 (如([Infura](https://infura.io/)) 托管的 Eth1 节点，则可以跳过这一步。

> 注意：如果你在本地托管你的Ubuntu服务器，你需要配置你的网络路由以允许来自端口 30303 的入站流量。

```Powershell
$ sudo ufw allow 30303
```

**允许 Teku**

允许与 Teku 的对等节点进行点对点连接，以便在信标链节点上 (Consensys[提供](https://docs.teku.consensys.net/en/latest/HowTo/Find-and-Connect/Improve-Connectivity/#configuring-ports)的默认端口9000/TCP和9000/UDP) 进行操作。.

> 注意：如果你在本地托管你的Ubuntu服务器，你需要配置你的网络路由和防火墙以允许来自端口9000 的入站流量。

```Powershell
$ sudo ufw allow 9000
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

显示应该是这样的



![p4](https://i.ibb.co/6wQdG6Q/4.png)





# 第3步：安装并运行 Go Ethereum 节点

安装并配置Eth1.0的节点，信标链将与该节点相连。如果你选择第三方服务 (如[Infura](https://infura.io/)) 的话，可以跳过这一步。

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

为Eth1区块链创建数据目录，用来存储Eth1节点数据。

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



![p5](https://i.ibb.co/tKMxJKv/5.png)



重新加载 systemd 以显示上述的更改

```Powershell
$ sudo systemctl daemon-reload
```

启动服务，并检查确保其正常运行。

```Powershell
$ sudo systemctl start geth
$ sudo systemctl status geth
```

显示应如下方截图。



![p6](https://i.ibb.co/7zXFcJ2/6.png)



如果你每一步都做对了，它会用绿色字体显示”active (running)"。如果没有显示，你需要倒回去重复上述步骤，修复问题。按Q退出。

允许geth服务在系统重启时自动启动。

```Powershell
$ sudo systemctl enable geth
```

Go Ethereum节点将会开始同步。你可以运行 journal 命令来追踪进程。按“CTRL+c”退出。

> NOTE: Issuing Ctrl+C to quit out of journal doesn’t impact the service. Journal is simply a real-time view of the service logs.
>
> 注意：使用 Ctrl+C 退出 journal 不会影响该服务，Journal 只是服务日志的实时视图。

```Powershell
$ sudo journalctl -fu geth.service
```

当你花较长的时间 (>10分钟) 来找到需要同步的对等节点时，你可以添加一些对等节点。访问[此处](https://gist.github.com/rfikki/77081600ddc8432520d3bb3a9f80a493)以获得最新的清单，并操作下列命令行以修改geth服务：

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



![p7](https://i.ibb.co/RSMn6zc/7.png)



在运行信标链之前，你需要等待节点同步完成。点击[此处](https://goerli.etherscan.io/blocks)访问最新的区块。

比如，上方截图显示了节点正在处理区块 `number=43756` ，再看看下方截图，显示最新的区块是 `3196411`。也就是说，我们还有一段时间才能完成同步。



![p8](https://i.ibb.co/9WbCVmb/8.png)



接下来，我们将准备验证者存款数据。如果你想查看同步状态，你可以在任意时间运行命令 `sudo journalctl -fu geth.service` 以查看。



# 第4步：生成验证者密钥和存款数据

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

接下来我们要生成存款数据和验证者密钥。Teku验证者客户端支持多个验证者密钥。在Pyrmont测试网上基本上一个验证者密钥代表一个“验证者账户”。存款数据中包含你的质押信息 (如验证者密钥清单等)

前往[这里](https://github.com/ethereum/eth2.0-deposit-cli/releases/)获取存款命令行接口应用的“最新发布”。



![p13](https://i.ibb.co/9wt6NsR/13.png)



在“asset"一栏复制这个链接到Linux版本。我们将使用该链接来下载它，如下所示。修改指令里的URL名为最新版本的下载链接。

```Powershell
$ cd ~
$ sudo apt install curl
$ curl -LO https://github.com/ethereum/eth2.0-deposit-cli/releases/download/v1.1.0/eth2deposit-cli-ed5a6d3-linux-amd64.tar.gz
```

打开tar存档并去到其创建的目录。

```Powershell
$ sudo tar xvf eth2deposit-cli-ed5a6d3-linux-amd64.tar.gz
$ cd eth2deposit-cli-ed5a6d3-linux-amd64
```

运行应用来生成存款数据和验证者密钥。

将`<numberofvalidators>`修改为你想要创建的验证者密钥数。例如：`--num_validators 5`

```Powershell
$ sudo ./deposit new-mnemonic --num_validators <numberofvalidators> --mnemonic_language=english --chain pyrmont
```

它会要求你创建一个钱包密码。我们将使用它来将验证者密钥加载到 Teku 客户端的验证者钱包。把它备份到安全的地方。



![p14](https://i.ibb.co/42Mc0cQ/14.png)



它会生成一个种子短语 (助记符)。把它备份到其他地方。这很重要，你将需要它来生成提款密钥或者添加验证者。



![p15](https://i.ibb.co/vXFQxtP/15.png)



一旦你已经确认了你的助记符，你的验证者密钥就会被创建。



![p16](https://i.ibb.co/9Y4Pt1g/16.png)



新创建的验证者密钥和存款数据文档会在一个特定地方被创建。比如：`eth2deposit-cli-ed5a6d3-linux-amd64/validator_keys` 。标记一下，我们待会会用到。

文件夹的内容见下：



![p17](https://i.ibb.co/zZ6Qbr3/17.png)



`deposit_data-[timestamp].json`文档包含了验证者的公钥和存款的相关信息。这个文档会在下一步用来完成存款进程。由于我们是在一个服务器上，而没有一个网络浏览器，因此要使用[secure FTP (SFTP)](https://www.maketecheasier.com/use-sftp-transfer-files-linux-servers/) 把文档迁移到一部运行MetaMask的计算机上。记得先完成这一步再继续。

`keystore-m...json`文档包含加密的签名密钥。每个验证者账户都有一个 keystore-m。这些会被用来创建 Teku 客户端验证者钱包。

通过删除下载的tar存档文件进行清理。

```Powershell
$ cd ~
$ rm -rf eth2deposit-cli-ed5a6d3-linux-amd64.tar.gz
```

现在你已经有了存款数据和密钥存储文件，接下来就可以设置 Teku 了。我们要先把资产存入密钥中 (存入Göerli ETH以激活验证者)再设置Teku，这样我们就可以首先验证设置了。如果验证者存款被激活了，但系统没准备好的话，我们会受到怠工惩罚。



# 第5步：安装条件

Teku基于 Java 语言构建，因此它需要 Java 运行时环境 (JRE) 来运行，并需要 Java 开发工具包 (JDK) 进行编译。

.安装这两种工具。

```Powershell
$ sudo apt install default-jre default-jdk
$ java --version
$ javac --version
```

显示应类似下图。

```Powershell
ethstaker@ETH-STAKER-001:~$ java --version
openjdk 11.0.9.1 2020-11-04
OpenJDK Runtime Environment (build 11.0.9.1+1-Ubuntu-0ubuntu1.20.04)
OpenJDK 64-Bit Server VM (build 11.0.9.1+1-Ubuntu-0ubuntu1.20.04, mixed mode, sharing)
ethstaker@ETH-STAKER-001:~$ javac --version
javac 11.0.9.1
```



# 第6步：克隆和构建Teku

现在我们准备好构建 Teku 了。Teku 生成一个 `teku` 二进制文件。该二进制文件提供信标链以及验证者客户端的功能。

访问[这里](https://github.com/ConsenSys/teku/releases)以获取 Teku 的最新版本。注意不要克隆了主分支版本，因为这可能不稳定。



![p14](https://i.ibb.co/K9PssGW/14.png)



使用标签 (在本例中为 `20.11.0-RC2`)

```Powershell
$ cd ~
$ git clone --b 20.11.0-RC2 https://github.com/Consensys/teku.git
$ cd teku
```

使用[Gradle](https://gradle.org/) 来编译代码

```Powershell
$ sudo ./gradlew installDist
```

构建时间大概需要3-6分钟。是时候喝点饮料补充补充水分了。也可以阅读我[其他的文章](https://someresat.medium.com/)。

如果都操作成功了请继续，如果操作失败了请求助 ConsenSys Discord 的 #teku 频道 : https://discord.gg/trQ378WCp4



# 第7步：复制 Teku 二进制文件

接下来复制粘贴已编译的 Teku 文件至目录 `/usr/local/bin` 中，我们随后将创建一个systemd服务，并在那运行该文件。

```Powershell
$ cd ~
$ sudo cp -a teku/build/install/teku/. /usr/local/bin/teku
```

> 注意：每一次你拉取或构建一个新版本`*teku*` 二进制文件，你都需要做这一步。请看此教程的最后**附录——Teku更新**。



# 第8步：配置信标节点和验证者客户端

我们将把Teku客户端作为服务来运行，因此如果系统重启，这个进程将自动重新开始。

## 设置账户和目录

为信标节点与验证者节点的运行创建一个账户。这种类型的账户不能用来登录进入服务器。

```Powershell
$ sudo useradd --no-create-home --shell /bin/false teku
```

为Teku客户端的数据文档创建数据目录，并为Teku的配置文档创建config目录。

```Powershell
$ sudo mkdir -p /var/lib/teku
$ sudo mkdir -p /etc/teku
```

这样我们可以把文档集中在一个位置，复制`keystore-m...json`的文档到我们之前创建的数据目录。

```Powershell
$ sudo cp -a /$HOME/<ValidatorKeysPath> /var/lib/teku
```

把你生成的验证者密钥的路径填到`<ValidatorKeysPath>`，例如：`eth2deposit-cli-ed5a6d3-linux-amd64/validator_keys`。值得注意的是我们只复制keystore-m文档。不要复制deposit_data文档。如果你复制了，只需要通过以下代码进行删除。

```Powershell
$ cd /var/lib/teku/validator_keys
$ ls
$ sudo rm <DepositDataFileName>
```

你应该会得到以下结果 (取决于你有多少个验证者文档)



![p15](https://i.ibb.co/b32mww1/15.png)



## 创建验证者密码文档

Teku客户端要求验证者有一个密码文档，以在运行和自动重启服务时访问每个验证者账户。

每个验证者`keystore-m...json`密钥文档都需要一个对应的密码txt文档。即使所有验证者的密码是一样，这一步也是必须的。密码文档的命名需要于对应的keystore-m文档相一致。

```Powershell
$ ls /var/lib/teku/validator_keys
```

给每个`keystore_m*.json`文档创建一个命名相同的密码文档。

```Powershell
$ sudo nano /var/lib/teku/validator_keys/<jsonfilename>.txt
```

在`<jsonfilename>`填入json文档的名字。不要忘了在最后加上 `.txt`。在txt文档里，把密码储存的密码 (你在第4步创建验证者文档时提供的密码)填到`YourKeystorePasswordForThisValidator`。保存并推出。给每个`*.json`文档重复以上步骤。



![p16](https://i.ibb.co/gM6hJpn/16.png)



你应该会得到以下结果，这一步就完成了。



![p17](https://i.ibb.co/61qyqPB/17.png)



> 注意：不应该有`*deposit_data-\*.json*`文档的出现。如果有，把它删了。它会导致错误配对，因为Teku客户端会预期它有一个对应的密码文档。

## 设置权限

设置目录权限。 `teku`账户需要修改数目目录的权限。确认正确设置了目录权限。

```Powershell
$ sudo chown -R teku:teku /var/lib/teku
$ sudo chown -R teku:teku /etc/teku
$ ls -dl /var/lib/teku; ls -dl /etc/teku
```

应该像这样：



![p18](https://i.ibb.co/dDBVKV8/18.png)



把文档权限应用到验证者密钥以提供额外的安全层，并防止意外的删除。给(teku)用户读取/写入/执行的权限。确认正确设置了文档权限。

```Powershell
$ sudo chmod -R 700 /var/lib/teku/validator_keys
$ sudo ls -lh /var/lib/teku/validator_keys
```

结果应该像这样



![p19](https://i.ibb.co/zSwj7VS/19.png)



现在我们设好了验证者密钥于密码，现在开始配置服务。

## 创建Teku配置文档

Teku客户端可以通过配置文档读取命令行选项。现在创建。

```Powershell
$ sudo nano /etc/teku/teku.yaml
```

粘贴下面的代码到文档里。

```Powershell
data-base-path: "/var/lib/teku"network: "pyrmont"eth1-endpoint: "http://127.0.0.1:8545/"validator-keys: "/var/lib/teku/validator_keys:/var/lib/teku/validator_keys"validators-graffiti: "<yourPOAPstring>"p2p-port: 9000log-destination: CONSOLEmetrics-enabled: true
metrics-port: 8008rest-api-enabled: true
rest-api-docs-enabled: true
```

flag`data-base-path`定义服务存储数据的位置。

flag`eth1-endpoint`定义了ETH1 节点的终端。如果你在本地安装，这个值为`http://127.0.0.1:8545`。如果你正在使用一个第三方节点 (例如：Infura等)，你需要把这个值改为指向外部终端的地址。

flag `validators-keys`指示密钥文档于密码文档的位置。这样，它们都处在同一个目录。

在 `<yourPOAPstring>`输入你想要的文字。例如：`validators-graffiti: "abcdefg12345"`。

在使用systemd中推荐 `log-destination: CONSOLE` 设置

参考下方的截图。你的文档应该跟它差不多。退出并保存。



![p20](https://i.ibb.co/9q3cZry/20.png)



## 创建和配置Teku服务

创建一个systemd服务文档来储存配置服务。

```Powershell
$ sudo nano /etc/systemd/system/teku.service
```

将下面这段代码复制粘贴到文档里

```Powershell
[Unit]
Description=Teku Client
Wants=network-online.target
After=network-online.target[Service]
Type=simple
User=teku
Group=teku
Restart=always
RestartSec=5
Environment="JAVA_OPTS=-Xmx2g"
ExecStart=/usr/local/bin/teku/bin/teku --config-file=/etc/teku/teku.yaml[Install]
WantedBy=multi-user.target
```

Java (Teku使用的编程语言)执行运行时在设计上就需要占用大量RAM。flag`Environment=”JAVA_OPTS=-Xmx2g”`限制了堆积大小为2GB，因此Teku的运行可用总内存约为 3–3.5GB。

参考下方的截图。你的文档应该跟它差不多。退出并保存。



![p21](https://i.ibb.co/C7JMx02/21.png)



重新加载systemd以显示更改。

```Powershell
$ sudo systemctl daemon-reload
```

> 注意：如果你是运行本地的Eth1节点（看第3步），你应该等待至它完全同步完数据再启动Teku服务。在这里查看进程：`*sudo journalctl -fu geth.service*`

启动服务并检查，确保运行正确。

```Powershell
$ sudo systemctl start teku
$ sudo systemctl status teku
```

显示的结果应该是这样：



![p22](https://i.ibb.co/ZfdRYMb/22.png)



如果你每一步都做对了，它会用绿色字体显示”active (running)"。如果没有显示，你需要倒回去重复上述步骤，修复问题。按Q退出。

允许服务随系统重启而自动重启。

```Powershell
$ sudo systemctl enable teku
```

信标节点将开始同步数据。它可能要花几个小时才能完全实现同步。你可以通过运行journal命令来追踪进程。按CTRL+c退出。

> 注意：按Ctrl+C退出journal不会影响服务。journal指示服务日志的实时视图。

```Powershell
$ sudo journalctl -fu teku.service
```

它会开始处理验证者密钥，然后同步数据到Eth1的链头。当`Head slot` 同步到`Current slot`，信标节点的同步就完成了。

```Powershell
Started Teku Client.
...
INFO  - Loading 2 validator keys...
INFO  - BLS: loaded BLST library
INFO  - Loaded 2 Validators: 96a349b, b7f51b6
...
INFO  - Sync Event  *** Current slot: 30174, Head slot: 54, Connected peers: 1
INFO  - Sync Event  *** Current slot: 30175, Head slot: 92, Connected peers: 6
INFO  - Sync Event  *** Current slot: 30176, Head slot: 128, Connected peers: 8
INFO  - Sync Event  *** Current slot: 30177, Head slot: 160, Connected peers: 10
```

这一步结束了。我们现在有一条运行中的信标链和一个验证者节点。恭喜你！你棒棒的！



# 第9步：进行验证者存款

现在你的设置已经完成并在运行中了，你需要给Pyrmont测试网存入32个Göerli ETH。

> 注意：如果你已经提交了你的质押存款，你可以跳过这一步。

这一步是关于将所需的Göerli ETH存入Pyrmont测试网的存款合约。这需要在浏览器上通过Pyrmont的Launchpad网站启动你的MetaMask (或其他) 钱包。

> 注意：如果这份教程是用于主网 (它不是)，你需要等到你的Eth1节点和信标节点完全同步完再开存入你的存款。如果你不这样做，当你的Eth1节点或信标链在同步时，你可能要遭遇怠工惩罚。

Pyrmont测试网的Launchpad:https://pyrmont.launchpad.ethereum.org/

一直随着屏幕切换点击这些警告步骤，直到你到达**密钥对生成**的部分。选择你打算运行的验证者数量。选择一个与你在步骤4中生成的验证者文件数量相匹配的值。



![24](https://i.ibb.co/CwKwHzQ/p27.png)



往下滚动，看这些内容你是否同意，然后点击“Continue” (继续)。



![25](https://i.ibb.co/LdJsJwY/p28.png)



你会被要求上传`deposit_data-[timestamp].json`文档。这个文档你是在之前生成的，把它复制到有浏览器的计算机里。浏览/选择或拖拉这个文档，然后点击Continue。



![26](https://i.ibb.co/PTkh7gD/p29.png)



连接你的钱包。选择MetaMask (或者是其他支持的钱包)，登录，选择存有你的Göerli ETH的Göerli测试网络，然后点击Continue。



![p26](https://i.ibb.co/zSdPcb2/26.png)



> 注意：请100%确定你在MetaMask上选的是Göerli测试网络。不要把真的ETH发送到 Pyrmont测试网。

你的MetaMask余额就会显示出来。如果你选择了Göerli测试网络且你有充足的Göerli ETH余额，网站会允许你继续下一步。



![p27](https://i.ibb.co/6X385KS/27.png)



然后会出现一个Summary (总结)，显示验证者数和所需的Göerli ETH数量。如果你同意的话就给那些方框打勾，然后点击Continue。



![p28](https://i.ibb.co/qkDGzwb/28.png)



点击"Initiate All Transactions" (启动所有交易）。



![p29](https://i.ibb.co/DwZ7BRq/29.png)



会有多个MetaMask实例弹出，每个都对Pyrmont测试网提出一个32个Göerli ETH的交易请求。请确认每一笔交易。



![p30](https://i.ibb.co/WBSj0g5/30.png)



当所有的交易都成功完成时，你的质押也完成了！



![p31](https://i.ibb.co/HH6P2yn/31.png)



恭喜！



![p32](https://i.ibb.co/hswDNF4/32.png)



在最后会有一个清单。里面有非常多有用信息。可以看一下



![p33](https://i.ibb.co/M8H67Wg/33.png)



## 查看你的验证者存款状态

新加入的验证者需要等一下 (几个小时到几天不等)才能激活。你可以以下几步来查看你的密钥状态：



![p34](https://i.ibb.co/b2jbxfD/34.png)



1. 复制你的Göerli测试网钱包地址
2. 前往：https://pyrmont.beaconcha.in/
3. 搜索你的钱包地址。你的密钥会显示出来。



![p35](https://i.ibb.co/d7qX8m4/35.png)



点进某个验证者详情，每个验证者激活后你会看到在Status那一栏有预估时间。



![p36](https://i.ibb.co/09S06pd/36.png)



现在你面前有一个条正在运作的信标链、一个验证者节点以及你的测试网存款。一旦你的存款被激活，你将开始工作并赚取收益。恭喜你！



# 第10步：安装Prometheus

Prometheus是一个提供监测功能和警报工具箱的开源系统。它在你的Ubuntu服务器上作为一个服务来运行，而它的职责就是去抓取数据。更多信息请看[这里](https://prometheus.io/docs/introduction/overview/)。

我们会使用Prometheus公开信标链、验证者的运行时数据和特定实例数据。

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
$ curl -LO https://github.com/prometheus/prometheus/releases/download/v2.22.2/prometheus-2.22.2.linux-amd64.tar.gz
```

打开tar存档。它包含两个二进制文档和一些内容文档。

```Powershell
$ tar xvf prometheus-2.22.2.linux-amd64.tar.gz
```

复制二进制文档到下列位置。

```Powershell
$ sudo cp prometheus-2.22.2.linux-amd64/prometheus /usr/local/bin/
$ sudo cp prometheus-2.22.2.linux-amd64/promtool /usr/local/bin/
```

设置目录的所有权。`prometheus`账户会管理这些。

```Powershell
$ sudo chown -R prometheus:prometheus /usr/local/bin/prometheus
$ sudo chown -R prometheus:prometheus /usr/local/bin/promtool
```

复制这些内容文档到下列位置。

```Powershell
$ sudo cp -r prometheus-2.22.2.linux-amd64/consoles /etc/prometheus
$ sudo cp -r prometheus-2.22.2.linux-amd64/console_libraries /etc/prometheus
```

设置目录和文档 (-R) 的所有权。`prometheus`账户会管理这些。

```Powershell
$ sudo chown -R prometheus:prometheus /etc/prometheus/consoles
$ sudo chown -R prometheus:prometheus /etc/prometheus/console_libraries
```

移除下载存档。

```Powershell
$ rm -rf prometheus-2.22.2.linux-amd64.tar.gz prometheus-2.22.2.linux-amd64
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
  scrape_interval: 15s
scrape_configs:
  - job_name: "prometheus"
    static_configs:
    - targets: ["localhost:9090"]
  - job_name: "teku"
    scrape_timeout: 10s
    metrics_path: /metrics
    scheme: http
    static_configs:
    - targets: ["localhost:8008"]
```

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
level=info ts=2020-11-22T17:24:35.396Z caller=main.go:684 msg="Server is ready to receive web requests."
```

## 把Prometheus设置为自动启动的服务

创建一个systemd服务文档来储存服务config文档，它会告诉systemd把 Prometheus作为prometheus用户来运行，把配置文档放在目录/etc/prometheus/prometheus.yml，并保存在目录/var/lib/prometheus。

```Powershell
$ sudo nano /etc/systemd/system/prometheus.service
```

复制下列代码到文档。退出并保存。

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

然后按下面的命令启动服务并检查状态，确保运行正确。

```Powershell
$ sudo systemctl start prometheus
$ sudo systemctl status prometheus
```

输出应该如下图。



![p37](https://i.ibb.co/CWJbH28/37.png)



如果你每一步都做对了，它会用绿色字体显示”active (running)"。如果没有显示，你需要倒回去重复上述步骤，修复问题。按Q退出 。

最后，允许Prometheus随系统启动而启动。

```Powershell
$ sudo systemctl enable prometheus
```



# 第11步：安装Node Exporter

Prometheus会提供关于信标链和验证者的数据。如果我们想要我们Ubuntu实例的数据，我们需要一个叫[Node_Exporter](https://github.com/prometheus/node_exporter)的extension。如果你在下面指定其他版本，你可以在[这里](https://prometheus.io/download/)找到最新的稳定版本。Rpi用户记得要获取ARM二进制文档。

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



![p38](https://i.ibb.co/LSMkXfy/38.png)



如果你每一步都做对了，它会用绿色字体显示”active (running)"。如果没有显示，你需要倒回去重复上述步骤，修复问题。按Q退出 。

最后，允许Node Exporter随系统启动而启动。

```Powershell
$ sudo systemctl enable node_exporter
```

## 测试Prometheus和Node Exporter (可选)

所有东西都准备就绪了。通过在防火墙打开一个端口 (请参阅步骤1）和浏览`http://<yourserverip>:9090`你可以有选择性地测试它的功能。在那里你可以运行查询以查看不同的数据。例如，你可以试这个查询来看还有多少可用内存：

```Powershell
http://<yourserverip>:9090/new/graph?g0.expr=node_memory_MemFree_bytes&g0.tab=1&g0.stacked=0&g0.range_input=1h
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
  Candidate: 7.3.3
  Version table:
     7.3.3 500
        500 https://packages.grafana.com/oss/deb stable/main amd64 Packages
     7.3.2 500
        500 https://packages.grafana.com/oss/deb stable/main amd64 Packages
     7.3.1 500
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



![p39](https://i.ibb.co/ZW49s3L/39.png)



如果你每一步都做对了，它会用绿色字体显示”active (running)"。如果没有显示，你需要倒回去重复上述步骤，修复问题。按Q退出。

允许Grafana随系统启动而启动。

```Powershell
$ sudo systemctl enable grafana-server
```

## 配置Grafana登录

能做到这一步已经很棒了！现在一切都设置好并开始运行了，你可以在浏览器里前往`http://<yourserverip>:3000/`，会出现Grafana的登录窗口。

在`admin`输入用户名和密码。系统会让你修改密码，请务必修改。

## 配置Grafana的数据来源

让我们配置数据来源吧。把你的鼠标移至左边菜单栏的齿轮图标处，会弹出一个菜单——选择`Data Sources`。



![p33](https://i.ibb.co/4dMmF8R/33.png)



点击 `Add Data Source`，然后选择`Prometheus`。在URL输入`http://localhost:9090`，然后点击 `Save and Test`。



![p34](https://i.ibb.co/sWsHzQz/34.png)





![p35](https://i.ibb.co/mzL51L5/35.png)



## 导入Grafana仪表盘

移动你的鼠标到左边菜单栏的`+`图标，会有一个菜单弹出，选择 `Import`。

用代码 `13457`来导入官方Teku的单个验证者[仪表盘](https://grafana.com/grafana/dashboards/13457)或用代码`12522`导入Ben Edgington的[仪表盘](https://grafana.com/grafana/dashboards/12522)



![p43](https://i.ibb.co/J2d3Jtm/43.png)



你可能还需要选择数据来源 (Prometheus)。



![p44](https://i.ibb.co/rvXCYxp/44.png)



此时你应该可以看到仪表盘了。一开始，你可能看到的数据比较少，但随着所有东西的运行起来，数据会变得丰富。



![p45](https://i.ibb.co/ssNFm7c/45.png)





# 写在最后

到这里就完成了！希望这个教程能帮到你。

- 如果你有任何反馈，你可以在[Twitter](https://www.twitter.com/SomerEsat) 或 [Reddit](https://www.reddit.com/user/SomerEsat)上联系我
- 如果你喜欢这个教程并希望别人也能学习这个教程，请用[friends link](https://medium.com/@SomerEsat/4d2a86cc637b?source=friends_link&sk=4cb64bfa20247d2b5c7a50ce0a92d33b)把教程分享出去！
- 支持一下：somer.eth



# 附录——Teku更新

如果Teku客户端团队在Teku代码库里更新了代码，你可以通过使用下面的命令来更新服务。

在[这里](https://github.com/ConsenSys/teku/releases)找到你想要的版本，并输入到 `<release>`。例如：`$ git fetch --tags && git checkout 20.11.0-RC2`.

```Powershell
$ cd ~
$ cd teku
$ sudo git fetch --tags && git checkout <release>
$ sudo ./gradlew installDist 
$ sudo systemctl stop teku 
$ sudo rm -r /usr/local/bin/teku # <-- Delete old build
$ sudo cp -a ~/teku/build/install/teku/. /usr/local/bin/teku 
$ sudo systemctl start teku 
$ sudo systemctl status teku # <-- Check status
$ sudo journalctl -fu teku # <-- Check status
```