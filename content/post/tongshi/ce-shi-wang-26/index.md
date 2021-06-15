---
path: ce-shi-wang-02
id: 26
title: 如何参与Pyrmont测试网质押，Lighthouse篇。
description:  '如何参与Pyrmont测试网质押，Lighthouse篇。' 
date: 2020-06-25T02:15:01.762Z
author: Carl Beekhuizen  
---


作者 | Somer Esat 

来源 | [someresat.medium.com](https://someresat.medium.com/guide-to-staking-on-ethereum-2-0-ubuntu-pyrmont-lighthouse-a634d3b87393)



![lighthouse](https://i.ibb.co/41wW8Rs/1.png)



**提醒**：不要按照这个指南与Eth2主网连接。主网指南在[这里](https://github.com/SomerEsat/ethereum-staking-guide)。请参考《以太坊2.0主网质押教学(Ubuntu/Lighthouse)》。

本文详解如何通过多客户端测试网Pyrmont在以太坊2.0主网质押。主要基于以下几个技术：

- Ubuntu v20.04 (LTS) x64 服务器
- Go Ethereum 节点 ([代码分支](https://github.com/ethereum/go-ethereum))
- Sigma Prime 的以太坊2.0客户端，Lighthouse (代码分支)
- 正式多客户端测试网公网，[Pyrmont](https://github.com/protolambda/pyrmont)
- 浏览器插件加密钱包 [MetaMask](https://metamask.io/)
- [Prometheus](https://prometheus.io/) 参数
- [Grafana](https://grafana.com/) 仪表盘

此篇指南包括以下指令：

- 配置一个新运行的Ubuntu服务器用例
- 配置并运行一个以太坊1.0节点作为服务
- 生成一个Lighthouse客户端并导入Pyrmont验证者账户密钥
- 给以太坊2.0与Pyrmont测试网阶段0编译并配置Lighthouse客户端软件，并把它们作为服务来运行
- 安装和配置Prometheus参数，设置一个Grafana仪表盘



# 提醒

此指南是用于Pyrmont测试网的。切记无论如何不要向测试网发送主网的ETH。你发送了就等于丢失了。

**不要**按照这份指南连接Eth2主网。主网专用指南在[这里](https://github.com/SomerEsat/ethereum-staking-guide)。请参考《以太坊2.0主网质押教学(Ubuntu/Lighthouse)》。



# 致谢与免责声明

本教程参考了网上的各种资料，感谢这些提供资料的贡献者！

感谢[Lighthouse](https://discord.gg/Ba8VWz7nbf)和[EthStaker](https://discord.gg/7z8wzehjrJ)团队的人在discord上提供的帮助与审校。

特别感谢Eth2 客户端团队和以太坊基金会的研究员。他们经过几年的不懈努力，将我们带到这难以置信的时刻——Eth2.0成功创世。

此教程仅作教育用途。我不是本文涉及的任何技术的专家。不保证此教程内容的准确性，因遵循此教程而造成的损失，本人概不负责。



# 支持

这个过程可能有些棘手。除了我之外，以下是两个你可以寻求帮助的好资源 :

- EthStaker社区是一个以太坊2.0 Staking 社区，资源丰富且十分友好。
  - Reddit：https://www.reddit.com/r/ethstaker/
  - Discord：https://discord.gg/7z8wzehjrJ
- Lighthouse 客户端团队，[Discord](https://discord.gg/Ba8VWz7nbf)，他们是客户端软件的工程团队，是使用Lighthouse的专家。



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
- 推荐硬件要求：
  - 处理器：Intel Core i7–4770或AMD FX-8310或更好的
  - 内存：16GB RAM
  - 存储空间：可用空间有100GB的固态硬盘



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

当你用你的用户名 `<yourusername>` 登录时，可以通过在命令行前输入sudo，来以超级用户的权限执行操作。

可选：如果你通过 `root` 账户使用 [SSH 密钥](https://jumpcloud.com/blog/what-are-ssh-keys)来连接你的 Ubuntu 实例，你将需要使用 root 账户的 SSH 密钥数据来连接新账户。

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

Ubuntu 20.04 服务器可以使用默认的 [UFW 防火墙](https://help.ubuntu.com/community/UFW)来限制访问该服务器的流量，不过要先设置其允许来自 SSH、Go Ethereum、Grafana、Lighthouse 的入站流量。

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

**允许 Lighthouse**

允许与 Lighthouse 的对等节点进行点对点连接，以便在信标链节点上 进行操作 (端口 9000/TCP 和 9000/UDP)。

> 注意：如果你在本地托管你的Ubuntu服务器，你需要配置你的网络路由或防火墙以允许来自端口 9000 的入站流量。

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

Output should look something like this.

显示应该是这样的，我使用的SSH端口号是 `1666/tcp` 。



![p4](https://i.ibb.co/3rG4xNT/4.png)





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

当你花较长的时间来找到需要同步的对等节点时，你可以添加一些对等节点。访问[此处](https://gist.github.com/rfikki/77081600ddc8432520d3bb3a9f80a493)以获得最新的清单，并操作下列命令行以修改geth服务：

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
$ sudo journalctl -f -u geth.service
```

启动后显示应该类似下方截图：



![p7](https://i.ibb.co/BNJYmFT/7.png)



在运行信标链之前，你需要等待节点同步完成。点击此处访问最新的区块。

比如，上方截图显示了节点正在处理区块 `number=498880` ，再看看下方截图，显示最新的区块是 `3270051`。也就是说，我们还有一段时间才能完成同步。



![p8](https://i.ibb.co/59rzHv2/8.png)



接下来，我们将克隆并构建Lighthouse软件 (信标链节点和验证者)。考虑在此开启一个新的终端，以便继续观察Eth1节点的同步情况。



# 第4步：安装依赖

创建Lighthouse需要安装Rust，按照下列提示来安装。

```Powershell
$ curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
$ source $HOME/.cargo/env
```

因为Rust修改了路径变量，所以我们要运行 `source $HOME/.cargo/env`以防止你尝试编译时出现 `command not found` 错误，如：

```Powershell
cargo install --path lighthouse --force --locked
make: cargo: Command not found
make: *** [Makefile:20: install] Error 127
```

还需要一些组件如 git、gcc、g++、make、cmake 等。

```Powershell
$ sudo apt install -y git gcc g++ make cmake pkg-config libssl-dev
```



# 第5步：安装和构建 Lighthouse

现在我们准备好构建 Lighthouse 了。Lighthouse生成一个 `lighthouse` 二进制文件。我们用不同的子命令来执行相同的二进制文件以获取我们需要的功能。如：

`lighthouse beacon_node` 将运行一个信标链节点实例。

`lighthouse validator_client` 将运行一个验证者客户端实例。

访问此处以获得最新的版本信息。注意不要克隆了主分支版本，因为这可能不稳定。

使用标签 (在本例中为 `v1.0.0`)



![p9](https://i.ibb.co/vs7zCYn/9.png)



```Powershell
$ cd ~
$ git clone -b v1.0.0 https://github.com/sigp/lighthouse.git
$ cd lighthouse
```

使用 Make 来编译 Lighthouse 二进制文件。

```Powershell
$ make
```

显示应该类似下方截图：



![p10](https://i.ibb.co/YP47hqQ/10.png)



构建时间取决于你的硬件。是时候喝点饮料补充补充水分了。也可以阅读我[其他的文章](https://someresat.medium.com/)。

如果都操作成功了请继续，如果操作失败了请求助 Lighthouse Discord : https://discord.gg/gdq27tnKSM



# 第6步：进入Pyrmont

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



`deposit_data-[timestamp].json`文档包含了验证者的公钥和存款的相关信息。这个文档会在下一步用来完成存款进程。由于我们是在一个服务器上，而没有一个网络浏览器，因此要使用secure FTP (SFTP) 把文档迁移到一部运行MetaMask的计算机上。

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



![p21](https://i.ibb.co/XFhCJpY/21.png)



点击"Initiate All Transactions" (启动所有交易）。会有多个MetaMask实例弹出，每个都对Pyrmont测试网提出一个32个Göerli ETH的交易请求。请确认每一笔交易。



![p23](https://i.ibb.co/sFbLGWt/23.png)



当所有的交易都成功完成时，你的质押也完成了！



![p24](https://i.ibb.co/477pzkH/24.png)



## 查看你的验证者存款状态

新加入的验证者需要等一下 (几个小时到几天不等)才能激活。你可以以下几步来查看你的密钥状态：

1. 复制你的Göerli测试网钱包地址
2. 前往：https://pyrmont.beaconcha.in/
3. 搜索你的钱包地址。你的密钥会显示出来。

点击一个密钥，查看**预期激活**信息



![p25](https://i.ibb.co/wLWnK2H/25.png)



完成了！现在创建验证者钱包吧！



# 第7步：创建验证者钱包

验证者钱包是通过从前一步导入keystore-m的JSON文档来创建。

创建一个目录以存储验证者钱包数据，并授予当前用户访问该目录的权限。在 `<yourusername>` 修改登入用户名。

```Powershell
$ sudo mkdir -p /var/lib/lighthouse
$ sudo chown -R <yourusername>:<yourusername> /var/lib/lighthouse
```

然后，我们会使用我们之前创建的Lighthouse验证者二进制文档来创建一个密钥钱包，并使用我们在上一步生成的密钥。把你生成的验证者密钥路径填到 `<PathToValidatorKeys>`，例如：`-- keys-dir=$HOME/eth2.0-deposit-cli/validator_keys`

```Powershell
$ cd lighthouse
$ lighthouse --network pyrmont account validator import --directory $HOME/<PathToValidatorKeys> --datadir /var/lib/lighthouse
```

flag`--datadir`指定钱包数据输出的位置。此过程会在`--datadir`路径下创建一个`validators` 路径。

接下来，你需要输入你在 [Eth2 Launch Pad](https://pyrmont.launchpad.ethereum.org/)网站上用来创建验证者密钥的密码。你会被要求给每个密钥提供密码，一个个来。确保你每个密钥都提供了密码，因为你需要把验证者客户端当作服务来运行，以及它需要把密码保存在文档里以访问密钥。

输出应该如下：

```Powershell
Running account manager for pyrmont testnet
validator-dir path: "/var/lib/lighthouse/validators"
validator-dir path: "/var/lib/lighthouse/validators"
WARNING: DO NOT USE THE ORIGINAL KEYSTORES TO VALIDATE WITH ANOTHER CLIENT, OR YOU WILL GET SLASHED.Keystore found at "/home/ethstaker/eth2deposit-cli-ed5a6d3-linux-amd64/validator_keys/keystore-m_12381_3600_1_0_0-1605678395.json":- Public key: 0xa79583298ecbd5564fce6ccefe2e69969705aff950235dc59ae303fa210b029b565c08303eb18cf02ecc26c429059d7f
 - UUID: 94079858-57db-4fb2-8272-5dbdfb31e65eIf you enter the password it will be stored as plain-text in validator_definitions.yml so that it is not required each time the validator client starts.Enter the keystore password, or press enter to omit it:Password is correct.Successfully imported keystore.
Successfully updated validator_definitions.yml.
```

当你给每个keystore-m JSON 文档都完成上述步骤，你会得到表示你成功的信息。

```Powershell
Successfully imported 2 validators (0 skipped).WARNING: DO NOT USE THE ORIGINAL KEYSTORES TO VALIDATE WITH ANOTHER CLIENT, OR YOU WILL GET SLASHED.
```

出于安全理由，你需要更新权限以移除`<youruseraccount>`对`var/lib/lighthouse`的访问权限。

```Powershell
sudo chown root:root /var/lib/lighthouse
```

完成了！现在验证者钱包已经配置好，我们将需要设置信标节点和验证者客户端。



# 第8步：配置信标节点

我们将把信标节点作为服务来运行，因此如果系统重启，这个进程将自动重新开始。

## 设置账户和目录

为服务的运行创建一个账户。这种类型的账户不能用来登录进入服务器。

```Powershell
$ sudo useradd --no-create-home --shell /bin/false lighthousebeacon
```

为Lighthouse的信标链数据库创建一个数据目录。

```Powershell
$ sudo mkdir -p /var/lib/lighthouse/beacon
```

设置目录权限。`lighthousebeacon`账户需要修改数据库目录的权限。

```Powershell
$ sudo chown -R lighthousebeacon:lighthousebeacon /var/lib/lighthouse/beacon
```

然后，把编译好的`lighthouse` 二进制文件 (从第5步) 复制粘贴到目录`/usr/local/bin`。我们会从那里开始运行。

> 注意：每一次你拉取或构建一个新版本`*lighthouse*`二进制文件，你都需要做这一步。请看此教程的最后**附录——Lighthouse更新**。

```Powershell
$ sudo cp /$HOME/.cargo/bin/lighthouse /usr/local/bin
```

## 创建和配置服务

创建一个systemd服务文档来储存config文档的服务。

```Powershell
$ sudo nano /etc/systemd/system/lighthousebeacon.service
```

复制粘贴下面这段代码到文档

```Powershell
[Unit]
Description=Lighthouse Beacon Node
Wants=network-online.target
After=network-online.target[Service]
Type=simple
User=lighthousebeacon
Group=lighthousebeacon
Restart=always
RestartSec=5
ExecStart=/usr/local/bin/lighthouse beacon_node --datadir /var/lib/lighthouse --network pyrmont --staking --eth1-endpoint http://127.0.0.1:8545 --metrics[Install]
WantedBy=multi-user.target
```

子命令`beacon_node`告诉`lighthouse` 二进制文档我们想要运行信标节点。

flag`--datadir`是存储信标节点数据库的路径。

flag`--staking`表明我们还将运行一个验证者节点，因此将启动HTTP服务器。验证者和信标节点使用它互相沟通。

flag`--eth1-endpoint`定义Eth1节点的终端。如果你在本地安装，这个值为`http://127.0.0.1:8545`。如果你正在使用一个第三方节点，你使用的是外部终端地址 (例如：Infura等)。

flag`--metrics`在默认端口5054启动数据服务器。输出会被Prometheus通过Grafana捕获。

你的文档需参考下方的截图，保存然后退出。



![p24](https://i.ibb.co/Fg0k6mR/24.png)



重新加载 systemd 以显示上述的更改。

```Powershell
$ sudo systemctl daemon-reload
```

> 注意：如果你运行一个本地的Eth1节点 (参考第3步)，你需要等到数据完全同步完成之后才能启动信标链服务。在这里查看进程：`*sudo journalctl -fu geth.service*`。

启动服务并确保其正常运行。

```Powershell
$ sudo systemctl start lighthousebeacon
$ sudo systemctl status lighthousebeacon
```

输出应如下方截图。



![p25](https://i.ibb.co/W5LVGN9/25.png)



如果你每一步都做对了，它会用绿色字体显示”active (running)"。如果没有显示，你需要倒回去重复上述步骤，修复问题。按Q退出。

允许服务在系统重启时自动启动。

```Powershell
$ sudo systemctl enable lighthousebeacon
```

信标链将开始同步，节点完全同步可能需要几个小时。你可以运行 journal 命令来追踪进程。按Ctrl+C退出。

```Powershell
$ sudo journalctl -fu lighthousebeacon.service
```

出现的代码应该是这样。

```Powershell
Nov 19 09:57:15 ETH-STAKER-001 systemd[1]: Started Lighthouse Beacon Node.
Nov 19 09:57:15 ETH-STAKER-001 lighthouse[158842]: Nov 19 09:57:15.398 WARN Ethereum 2.0 is pre-release. This software is experimental
Nov 19 09:57:15 ETH-STAKER-001 lighthouse[158842]: Nov 19 09:57:15.398 INFO Lighthouse started                      version: Lighthouse/v0.3.5-1a530e5a
Nov 19 09:57:15 ETH-STAKER-001 lighthouse[158842]: Nov 19 09:57:15.398 INFO Configured for testnet                  name: pyrmont
Nov 19 09:57:15 ETH-STAKER-001 lighthouse[158842]: Nov 19 09:57:15.398 INFO Data directory initialised              datadir: /var/lib/lighthouse
Nov 19 09:57:15 ETH-STAKER-001 lighthouse[158842]: Nov 19 09:57:15.398 WARN Running HTTP server on port 5052
Nov 19 09:57:15 ETH-STAKER-001 lighthouse[158842]: Nov 19 09:57:15.456 INFO Starting from known genesis state       service: beacon
Nov 19 09:57:16 ETH-STAKER-001 lighthouse[158842]: Nov 19 09:57:16.564 INFO Block production enabled                method: json rpc via http, endpoint: https://goerli.prylabs.net
```

输出将给出完全同步的时间指示。

```Powershell
Nov 19 09:59:37 ETH-STAKER-001 lighthouse[158842]: Nov 19 09:59:37.001 INFO Syncing                                 est_time: 18 mins, speed: 5.31 slots/sec, distance: 5830 slots (19 hrs 26 mins), peers: 29, service: slot_notifier
```

现在你的信标链正作为服务运行。恭喜！当你的信标节点在同步的时候，我们可以进入下一步。



# 配置验证者客户端

## 设置账户和目录

我们将把验证者客户端作为服务来运行，因此如果系统重启，这个进程会自动重新开始。

为验证者服务的运行创建一个账户。这类型的账户不能登录到服务器。

```Powershell
$ sudo useradd --no-create-home --shell /bin/false lighthousevalidator
```

我们为在创建钱包那步生成的验证者创建数据目录：`/var/lib/lighthouse/validators`。现在设置目录权限，使账户`lighthousevalidator`可以修改验证者账户的数据目录。

```Powershell
$ sudo chown -R lighthousevalidator:lighthousevalidator /var/lib/lighthouse/validators
```

## 创建并配置服务

创建一个systemd服务文档来存储服务配置。

```Powershell
$ sudo nano /etc/systemd/system/lighthousevalidator.service
```

完整复制粘贴下面这段代码，除了：在`<POAPstring>` 填上你个人喜欢的文字，例如： `--graffiti "abcdefg12345"`

```Powershell
[Unit]
Description=Lighthouse Validator
Wants=network-online.target
After=network-online.target[Service]
Type=simple
User=lighthousevalidator
Group=lighthousevalidator
Restart=always
RestartSec=5
ExecStart=/usr/local/bin/lighthouse validator_client --network pyrmont --datadir /var/lib/lighthouse --graffiti "<yourPOAPstring>"[Install]
WantedBy=multi-user.target
```

我们使用在`/usr/local/bin`里的同一个`lighthouse`二进制文档，但这次我们应用子命令`validator_client`来指示它运行验证者客户端。

flag `--network pyrmont`用来表明我们正在Pyrmont测试网上运行。

The `--datadir` flag is where we are going to save our validator database.

flag`--datadir` 表明我们准备保存我们验证者数据库的位置。

参考下方截图。推出并保存。



![p26](https://i.ibb.co/1Z0gRdj/26.png)



重新加载systemd以显示更改。

```Powershell
$ sudo systemctl daemon-reload
```

启动服务并检查，确保正确运行。

```Powershell
$ sudo systemctl start lighthousevalidator
$ sudo systemctl status lighthousevalidator
```

你看到的输出应该如下图所示。



![p27](https://i.ibb.co/F6S7Z0D/27.png)



如果你每一步都做对了，它会用绿色字体显示”active (running)"。如果没有显示，你需要倒回去重复上述步骤，修复问题。按Q退出 。

允许服务随系统重启而自动重启。

```Powershell
$ sudo systemctl enable lighthousevalidator
```

你可以通过运行日志命令来检查进程。按Ctrl+C 退出。

```Powershell
$ sudo journalctl -fu lighthousevalidator.service
```

验证者客户端会在验证者钱包启动验证者密钥，并确认连接到信标节点。

```Powershell
Nov 19 10:13:54 ETH-STAKER-001 lighthouse[159892]: Nov 19 10:13:54.772 INFO Completed validator discovery           new_validators: 0
Nov 19 10:13:55 ETH-STAKER-001 lighthouse[159892]: Nov 19 10:13:55.904 INFO Enabled validator                       voting_pubkey: 0xa79583298ecbd5564fce6ccefe2e69969705aff950235dc59ae303fa210b029b565c08303eb18cf02ecc26c429059d>
Nov 19 10:13:55 ETH-STAKER-001 lighthouse[159892]: Nov 19 10:13:55.904 INFO Enabled validator                       voting_pubkey: 0x8c8b19c544d79bdaf60d7dcc86ebaeeed4d804d2ecb4c66e5b27e19a664a81457a1c02a873a110e1d332abce5800cf>
Nov 19 10:13:55 ETH-STAKER-001 lighthouse[159892]: Nov 19 10:13:55.904 INFO Initialized validators                  enabled: 2, disabled: 0
Nov 19 10:13:55 ETH-STAKER-001 lighthouse[159892]: Nov 19 10:13:55.931 INFO Connected to beacon node                version: Lighthouse/v0.3.5-1a530e5a/x86_64-linux
Nov 19 10:13:55 ETH-STAKER-001 lighthouse[159892]: Nov 19 10:13:55.934 INFO Genesis has already occurred            seconds_ago: 80028
Nov 19 10:13:55 ETH-STAKER-001 lighthouse[159892]: Nov 19 10:13:55.934 INFO Loaded validator keypair store          voting_validators: 2
Nov 19 10:13:55 ETH-STAKER-001 lighthouse[159892]: Nov 19 10:13:55.934 INFO Block production service started        service: block
Nov 19 10:13:55 ETH-STAKER-001 lighthouse[159892]: Nov 19 10:13:55.934 INFO Attestation production service started  next_update_millis: 11065, service: attestation
Nov 19 10:13:55 ETH-STAKER-001 lighthouse[159892]: Nov 19 10:13:55.935 INFO HTTP API server is disabled
```

当信标链真的开始处理数据，在测试网上需要几个小时到几天来激活验证者账户。

```Powershell
Nov 19 10:25:49 ETH-STAKER-001 lighthouse[159892]: Nov 19 10:25:49.004 INFO Awaiting activation                     slot: 6728, epoch: 210, validators: 2, service: notifier
```

你可以通过[beaconcha.in](https://pyrmont.beaconcha.in/)查看你的验证者状态。只需要搜索你的验证者公钥或使用你的MetaMask （或其他）钱包地址进行搜索。你的数据可能要过一段时间才会在网站上显示。

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



![p28](https://i.ibb.co/JFtrLYN/28.png)



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
  Candidate: 7.1.1
  Version table:
     7.1.1 500
        500 https://packages.grafana.com/oss/deb stable/main amd64 Packages
     7.1.0 500
        500 https://packages.grafana.com/oss/deb stable/main amd64 Packages
     7.0.6 500
        500 https://packages.grafana.com/oss/deb stable/main amd6
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

在`admin`输入用户名和密码。系统会让你修改密码，请务必修改。

## 配置Grafana的数据来源

让我们配置数据来源吧。把你的鼠标移至左边菜单栏的齿轮图标处，会弹出一个菜单——选择`Data Sources`。



![p33](https://i.ibb.co/4dMmF8R/33.png)



点击 `Add Data Source`，然后选择`Prometheus`。在URL输入`http://localhost:9090`，然后点击 `Save and Test`。



![p34](https://i.ibb.co/sWsHzQz/34.png)





![p35](https://i.ibb.co/mzL51L5/35.png)



## 导入Grafana仪表盘

移动你的鼠标到左边菜单栏的`+`图标，会有一个菜单弹出，选择 `Import`。

从[这里](https://raw.githubusercontent.com/sigp/lighthouse-metrics/master/dashboards/Summary.json)复制粘贴JSON (或者[这里](https://raw.githubusercontent.com/sigp/lighthouse-metrics/master/dashboards/Summary.json)，如果你有多于10个验证者)，点击`Load`，然后`Import`。

你应该可以看到仪表盘。一开始的时候，你可能不会有很多数据，但在测试网启动和验证者激活一段时间后，你会看到一些数据和警报。



![p34](https://i.ibb.co/rFgRWgv/34.png)





# 写在最后

到这里就完成了！希望这个教程能帮到你。

- 在以后的更新里会有内容更全面的仪表盘 (额外的硬件数据和eth1节点的数据)
- 如果你有任何反馈，你可以在[Twitter](https://www.twitter.com/SomerEsat) 或 [Reddit](https://www.reddit.com/user/SomerEsat)上联系窝
- 如果你喜欢这个教程并希望别人也能学习这个教程，请用[friends link](https://medium.com/@SomerEsat/4d2a86cc637b?source=friends_link&sk=4cb64bfa20247d2b5c7a50ce0a92d33b)把教程分享出去！
- 支持一下：somer.eth



# 附录——Lighthouse更新

如果由于Git仓库里的改动你需要更新代码，可以按照这些步骤来获取最新的文档和创建自己的二进制文档:

查看Rust的更新

```Powershell
$ rustup update
```

拉取最新的Lighthouse代码然后构建。把你在[这里](https://github.com/sigp/lighthouse/releases)想要的版本填在`<release>`，例如：`$ git fetch --tags && git checkout v1.0.0`。

接下来，我们会停止信标链和验证者服务，并复制粘贴二进制文档到目录`/usr/local/bin`，然后再次启动服务。

```Powershell
$ cd ~
$ cd lighthouse
$ git fetch --tags && git checkout <release>
$ make$ sudo systemctl stop lighthousevalidator
$ sudo systemctl stop lighthousebeacon
$ sudo cp /$HOME/.cargo/bin/lighthouse /usr/local/bin$ sudo systemctl start lighthousebeacon
$ sudo systemctl status lighthousebeacon # <-- Check errors.
$ sudo journalctl -fu lighthousebeacon # <-- Check errors.$ sudo systemctl start lighthousevalidator
$ sudo systemctl status lighthousevalidator # <-- Check errors.
$ sudo journalctl -fu lighthousevalidator # <-- Check errors.
```

完成了！服务已经更新好了。