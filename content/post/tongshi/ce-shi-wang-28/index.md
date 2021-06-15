---
path: ce-shi-wang-04
id: 28
title: 如何参与 Pyrmont 测试网质押，Nimbus篇。
description:  '如何参与 Pyrmont 测试网质押，Nimbus篇。' 
date: 2020-06-25T02:15:01.762Z
author: Carl Beekhuizen  
---


作者 | Somer Esat 

来源 | [someresat.medium.com](https://someresat.medium.com/guide-to-staking-on-ethereum-2-0-ubuntu-pyrmont-nimbus-e6592c110843)



![p1](https://i.ibb.co/DVV0TdB/1.png)



**提醒**：不要按照这个指南与Eth2主网连接。主网指南请参考《以太坊2.0主网质押教学(Ubuntu/Nimbus)》。

本文详解如何通过多客户端测试网Pyrmont在以太坊2.0主网质押。主要基于以下几个技术：

- Ubuntu v20.04 (LTS) x64 服务器
- Go Ethereum 节点 ([代码分支](https://github.com/ethereum/go-ethereum))
- Status 的以太坊2.0 客户端，Nimbus (代码分支)
- 正式多客户端测试网公网，[Pyrmont](https://github.com/protolambda/pyrmont)
- 浏览器插件加密钱包 [MetaMask](https://metamask.io/)
- [Prometheus](https://prometheus.io/) 参数
- [Grafana](https://grafana.com/) 仪表盘

此篇指南包括以下指令：

- 配置一个新运行的Ubuntu服务器用例
- 配置一个以太坊1.0节点并将其作为服务运行
- 生成 Pyrmont 验证者账户密钥并存入资产
- 导入 Pyrmont 验证者账户密钥到 Nimbus 客户端里
- 给以太坊2.0与 Pyrmont 测试网阶段0编译并配置 Nimbus 客户端软件，并把它们作为服务来运行
- 安装和配置 Prometheus 参数，设置一个 Grafana 仪表盘



# 提醒

此指南是用于Pyrmont测试网的。切记无论如何不要向测试网发送主网的ETH。你发送了就等于丢失了。

**不要**按照这份指南连接Eth2主网。主网专用指南请参考《以太坊2.0主网质押教学(Ubuntu/Nimbus)》。



# 致谢与免责声明

本教程参考了网上的各种资料，感谢这些提供资料的贡献者！

感谢 [Nimbus Discord](https://discord.gg/PBJBuJKfXs) 提供的帮助与审校。

特别感谢 Nimbus 客户端团队和以太坊基金会的研究员。他们经过几年的不懈努力，将我们带到这难以置信的时刻——Eth2.0成功创世。

此教程仅作教育用途。我不是本文涉及的任何技术的专家。不保证此教程内容的准确性，因遵循此教程而造成的损失，本人概不负责。

欢迎提供反馈！



# 支持

这个过程可能有些棘手。除了我之外，以下是两个你可以寻求帮助的好资源 :

- EthStaker社区是一个以太坊2.0 Staking 社区，资源丰富且十分友好。

  Reddit：https://www.reddit.com/r/ethstaker/

  Discord：https://discord.gg/7z8wzehjrJ

- Nimbus 客户端团队的Discord: https://discord.gg/PBJBuJKfXs，他们是客户端软件的工程团队，是使用 Nimbus 专家。



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
- 配置 Nimbus 客户端并同步Eth1节点数据
- 存入 32 Göerli 测试网 ETH 以激活验证者密钥

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
$ sudo reboot
```



# 第2步：保护服务器

安全性十分重要。但由于本文不是针对安全性的指南，所有只列出了一些基础的设置：一个防火墙和一个不同的 SSH 端口。

## 配置防火墙

Ubuntu 20.04 服务器可以使用默认的 [UFW 防火墙](https://help.ubuntu.com/community/UFW)来限制访问该服务器的流量，不过要先设置其允许来自 SSH、Go Ethereum、Grafana、Nimbus 的入站流量。

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

允许来自Go Ethereum对等节点 (端口30303/TPC 和 30303/UDP) 的入站请求。如果你使用第三方 (如[Infura](https://infura.io/)) 托管的 Eth1 节点，则可以跳过这一步。

> 注意：如果你在本地托管你的Ubuntu服务器，你需要配置你的网络路由以允许来自端口 30303 的入站流量。

```Powershell
$ sudo ufw allow 30303
```

**允许 Nimbus**

允许与 Nimbus 的对等节点进行点对点连接，以便在信标链节点上 (端口9000/TCP 和 9000/UDP) 进行操作。.

> 注意：如果你在本地托管你的Ubuntu服务器，你需要配置你的网络路由和防火墙以允许来自该端口的入站流量。

```Powershell
$ sudo ufw allow 9000
```

**允许 Grafana**

允许访问Grafana web 服务器 (端口3000/TCP) 的入站请求。

```Powershell
$ sudo ufw allow 3000/tcp
```

**允许 Prometheus (可选)**

如果你想直接访问Prometheus数据服务，你也可以打开端口9090/TCP。如果你仅使用Grafana查看数据，则没有必要这样做。我没有打开这个端口。.

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





# 第3步：配置定时器

Ubuntu 内置了时间同步，并默认使用 systemd‘s timesyncd 服务进行激活。验证其是否正确运行。

```Powershell
$ timedatectl
```

激活 `NTP service` ，运行方式：

```Powershell
$ sudo timedatectl set-ntp on
```

参考下方的截图：



![p5](https://i.ibb.co/0tFG81G/5.png)





# 第4步：安装并运行 Go Ethereum 节点

安装并配置Eth1.0的节点，Nimbus 信标链将与该节点相连。如果你选择第三方服务 (如Infura) 的话，可以跳过这一步。

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

为Eth1区块链创建数据目录，用来存储Eth1节点数据。选择 `-p` 选项以创建完整路径。

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
ExecStart=geth --goerli --ws --datadir /var/lib/goethereum[Install]
WantedBy=default.target
```

flag `--goerli` 用于定位 Göerli 测试网，而flag `--ws` 用来公开与信标链节点连接的一个web socket端口 (ws://127.0.0.1:8546) 。

参考下方的截图。保存然后退出。



![p6](https://i.ibb.co/hC454Rn/6.png)



重新加载 systemd 以显示上述的更改。

```Powershell
$ sudo systemctl daemon-reload
```

启动服务，并检查确保其正常运行。

```Powershell
$ sudo systemctl start geth
$ sudo systemctl status geth
```

显示应如下方截图。



![p7](https://i.ibb.co/VW1R2Tk/7.png)



如果你每一步都做对了，它会用绿色字体显示”active (running)"。如果没有显示，你需要倒回去重复上述步骤，修复问题。按Q退出。

允许geth服务在系统重启时自动启动。

```Powershell
$ sudo systemctl enable geth
```

Go Ethereum节点将会开始同步。你可以运行 journal 命令来追踪进程。按“CTRL+c”退出。

```Powershell
$ sudo journalctl -f -u geth.service
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
$ sudo journalctl -f -u geth.service
```

启动后显示应该类似下方截图：



![p8](https://i.ibb.co/hXyhvfg/8.png)



> 在运行信标链之前，你需要等待节点同步完成。点击[此处](https://goerli.etherscan.io/blocks)访问最新的区块。

比如，上方截图显示了节点正在处理区块 `number=43756` ，再看看下方截图 (从[这里](https://goerli.etherscan.io/blocks))，显示最新的区块是 `3196411`。也就是说，我们还有一段时间才能完成同步。



![p9](https://i.ibb.co/n3csqrq/9.png)



接下来，我们将准备验证者存款数据。如果你想查看同步状态，你可以在任意时间运行命令 `sudo journalctl -fu geth.service` 以查看。



# 第5步：生成验证者密钥和存款数据

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

接下来我们要生成存款数据和验证者密钥。Nimbus 验证者客户端支持多个验证者密钥。在Pyrmont测试网上基本上一个验证者密钥代表一个“验证者账户”。存款数据中包含你的质押信息 (如验证者密钥清单等)

> 注意：如果在主网上进行质押，最好是用一台完全没有连接过网络的机器，以防泄漏助记词。

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

它会要求你创建一个钱包密码。我们将使用它来将验证者密钥加载到 Nimbus 客户端的验证者钱包。把它备份到安全的地方。



![p14](https://i.ibb.co/42Mc0cQ/14.png)



它会生成一个种子短语 (助记符)。把它备份到其他地方。这很重要，你将需要它来生成提款密钥或者添加验证者。



![p15](https://i.ibb.co/vXFQxtP/15.png)



一旦你已经确认了你的助记符，你的验证者密钥就会被创建。



![p16](https://i.ibb.co/9Y4Pt1g/16.png)



新创建的验证者密钥和存款数据文档会在一个特定地方被创建。比如：`eth2deposit-cli-ed5a6d3-linux-amd64/validator_keys` 。标记一下，我们待会会用到。

文件夹的内容见下：



![p17](https://i.ibb.co/zZ6Qbr3/17.png)



`deposit_data-[timestamp].json`文档包含了验证者的公钥和存款的相关信息。这个文档会在下一步用来完成存款进程。由于我们是在一个服务器上，而没有一个网络浏览器，因此要使用[secure FTP (SFTP)](https://www.maketecheasier.com/use-sftp-transfer-files-linux-servers/) 把文档迁移到一部运行MetaMask的计算机上。记得先完成这一步再继续。

`keystore-m...json`文档包含加密的签名密钥。每个验证者账户都有一个 keystore-m。这些会被用来创建 Nimbus 客户端验证者钱包。

通过删除下载的tar存档文件进行清理。

```Powershell
$ cd ~
$ rm -rf eth2deposit-cli-ed5a6d3-linux-amd64.tar.gz
```

现在你已经有了存款数据和密钥存储文件，接下来就可以设置 Nimbus 了。我们要先把资产存入密钥中 (存入Göerli ETH以激活验证者)再设置 Nimbus，这样我们就可以首先验证设置了。如果验证者存款被激活了，但系统没准备好的话，我们会受到怠工惩罚。



# 第6步：安装 Nimbus 依赖

构建 Nimbus 客户端需要一些开发依赖工具 (C compiler、Maker、Bash、Git)。

```Powershell
$ sudo apt-get install build-essential git
```



# 第7步：克隆和构建Nimbus

现在我们准备好构建 Nimbus 了。Nimbus 生成一个 `nimbus_beacon_node` 二进制文件。我们通过输入不同的子命令或 flags 来执行该二进制文件以获得我们需要的功能。比如：`nimbus_beacon_node deposits import`可以将验证者密钥导入到客户端钱包中。输入`nimbus_beacon_node --network=pyrmont` 可以运行与 Prymont 网络连接的一个信标节点实例。

```Powershell
$ cd ~
$ git clone https://github.com/status-im/nimbus-eth2
$ cd nimbus-eth2
```

使用 Make 来编译Nimbus 二进制文件。我们在参数功能中包含 flag `-d:insecure` 来进行编译。

```Powershell
$ make NIMFLAGS="-d:insecure" nimbus_beacon_node
```

显示应如下图：



![p15](https://i.ibb.co/LZvBzCv/15.png)



构建时间长短取决于你的硬件设备状况。是时候喝点饮料补充补充水分了。也可以阅读我[其他的文章](https://someresat.medium.com/)。

如果都操作成功了请继续，如果操作失败了请求助 Nimbus Discord : https://discord.gg/PBJBuJKfXs



# 第8步：复制 Nimbus 二进制文件

接下来复制粘贴已编译的二进制文件 `nimbus_beacon_node` 至目录 `/usr/local/bin` 中，Nimbus 服务将在那运行。

> 注意：每一次你拉取或构建一个新版本 `nimbus_beacon_node` 二进制文件，你都需要做这一步。请看此教程的最后**附录 —— Nimbus更新**。

```Powershell
$ sudo cp /$HOME/nimbus-eth2/build/nimbus_beacon_node /usr/local/bin
```



# 第9步：导入验证者密钥

通过导入在上一步创建的`keystore-m` JSON文档创建验证者钱包。

首先，创建一个目录来储存验证者数据，并给当前用户权限来访问数据。当前用户需要权限，因为他们需要执行导入。在 `<yourusername>` 修改登入用户名。

```Powershell
$ sudo mkdir -p /var/lib/nimbus
$ sudo chown -R <yourusername>:<yourusername> /var/lib/nimbus
```

在文件夹设置正确的权限，这一步在钱包创建过程中执行。把权限应用到数据文件夹。

```Powershell
$ sudo chmod 700 /var/lib/nimbus
$ ls -dl /var/lib/nimbus
```

显示内容如下：



![p16](https://i.ibb.co/YTQtjxy/16.png)



接下来，运行验证者密钥导入，使用`nimbus_beacon_node deposits import` 功能。我们需要提供生成的`keystore-m`文档所在位置的目录。例如：`$HOME/eth2deposit-cli-ed5a6d3-linux-amd64/validator_keys`。

```Powershell
$ cd ~
$ cd nimbus-eth2
$ build/nimbus_beacon_node deposits import --data-dir=/var/lib/nimbus $HOME/eth2deposit-cli-ed5a6d3-linux-amd64/validator_keys
```

flag`--data-dir`指定钱包数据输出的位置。

你会被要求提供验证者密钥的密码。这个密码是你在第5步设置的。

输出结果如下：



![p17](https://i.ibb.co/2vK83Q9/17.png)



这一步完成了！现在验证者密钥已经导入，我们将把Nimbus客户端作为服务来设置。



# 第10步：配置信标节点和验证者客户端

我们将把Nimbus客户端作为服务来运行，因此如果系统重启，这个进程将自动重新开始。

## 设置账户和目录

为信标节点与验证者节点的运行创建一个账户。这种类型的账户不能用来登录进入服务器。

```Powershell
$ sudo useradd --no-create-home --shell /bin/false nimbus
```

设置目录权限。我们在前一步创建了一个数据目录(`/var/lib/nimbus`)。 `nimbus` 账户需要修改数目目录的权限。

```Powershell
$ sudo chown -R nimbus:nimbus /var/lib/nimbus
$ ls -dl /var/lib/nimbus
```

你的用户账户不能再访问目录了。显示应如下：



![p18](https://i.ibb.co/Lr4L3ry/18.png)



## 创建和配置服务

创建一个systemd服务文档来储存配置服务。

```Powershell
$ sudo nano /etc/systemd/system/nimbus.service
```

将下面这段代码复制粘贴到文档里

```Powershell
[Unit]
Description=Nimbus Beacon Node
Wants=network-online.target
After=network-online.target[Service]
Type=simple
User=nimbus
Group=nimbus
Restart=always
WorkingDirectory=/var/lib/nimbus
Environment="ClientIP=$(curl -s v4.ident.me)"
ExecStart=/bin/bash -c '/usr/local/bin/nimbus_beacon_node --network=pyrmont --data-dir=/var/lib/nimbus --web3-url=ws://127.0.0.1:8546 --metrics --metrics-port=8008 --rpc --rpc-port=9091 --nat=extip:${ClientIP} --validators-dir=/var/lib/nimbus/validators --secrets-dir=/var/lib/nimbus/secrets --log-level=INFO --log-file=/var/lib/nimbus/beacon_node.log'[Install]
WantedBy=multi-user.target
```

如果你使用的是一个远程的或第三方Eth1节点，你需要修改`--web3-url`。如果你是在本地创建Eth1节点 (从第4步)，你不需要修改这个值。

提供的flag如下：

`--network`——客户端连接的网络。在这里就是Pyrmont。

`--data-dir`——储存信标节点和验证者数据的目录。

`--web3-url`——指向Eth1节点 (本地或远程的)的web socket (ws) 的URL。

`--metrics`——开启数据服务器。

`--metrics-port`——冗余，因为它被设为默认值，但为了方便还是把它包含在内。必须与在Prometheus 的配置文档里的Nimbus数据相匹配。

`--rpc`——开启RPC API

`--rpc-port`——需要避免与Prometheus冲突

`--nat` ——你的服务器的外部IP地址。我们使用环境变量 `Environment="ClientIP=$(curl -s v4.ident.me)"`来获取客户端IP地址，因为 ExecStart不允许内联调用。用`--nat=extip:${ClientIP}`就能解决问题。

`--validators-dir` ——验证者密钥数据所在的目录。

`--secrets-dir`——验证者密钥秘密所在的目录。

`--log-level`——日志记录的详细程度。`INFO`用作表示性能。

`--log-file`——是所需，这样服务才能创建日志文档。路径必须与服务的`WorkingDirectory`匹配。

参看下方截图。你的文档应该如此。退出并保存。



![p19](https://i.ibb.co/S04qyBv/19.png)



重新加载systemd以显示更改。

```Powershell
$ sudo systemctl daemon-reload
```

> 注意：如果你是运行本地的Eth1节点（看第4步），你应该等待至它完全同步完数据再启动Teku服务。在这里查看进程：`*sudo journalctl -fu geth.service*`

启动服务并检查，确保运行正确。

```Powershell
$ sudo systemctl start nimbus
$ sudo systemctl status nimbus
```

显示的结果应该是这样：



![p20](https://i.ibb.co/FDmnKdr/20.png)



如果你每一步都做对了，它会用绿色字体显示”active (running)"。如果没有显示，你需要倒回去重复上述步骤，修复问题。按Q退出。

允许服务随系统重启而自动重启。

```Powershell
$ sudo systemctl enable nimbus
```

信标节点将开始同步数据。它可能要花几个小时才能完全实现同步。你可以通过运行journal命令来追踪进程。按CTRL+c退出。

```Powershell
$ sudo journalctl -fu nimbus.service
```

日志输出类似于这样：

```Powershell
Nov 24 22:25:56 ETH-STAKER-001 bash[65560]: INF 2020-11-24 22:25:31.197+00:00 Slot start                                 topics="beacnde" tid=65560 file=nimbus_beacon_node.nim:473 lastSlot=46326 scheduledSlot=46327 beaconTime=6d10h25m24s197ms907us264ns peers=1 head=1e6df25a:242 headEpoch=7 finalized=542c17b2:128 finalizedEpoch=4
Nov 24 22:25:56 ETH-STAKER-001 bash[65560]: NOT 2020-11-24 22:25:31.203+00:00 Syncing in progress; skipping validator duties for now topics="beacval" tid=65560 file=validator_duties.nim:519 slot=46327 headSlot=242
Nov 24 22:25:56 ETH-STAKER-001 bash[65560]: INF 2020-11-24 22:25:31.203+00:00 Slot end                                   topics="beacnde" tid=65560 file=nimbus_beacon_node.nim:559 slot=46327 nextSlot=46328 head=1e6df25a:242 headEpoch=7 finalizedHead=542c17b2:128 finalizedEpoch=4
Nov 24 22:25:56 ETH-STAKER-001 bash[65560]: NOT 2020-11-24 22:25:34.396+00:00 Reached new finalization checkpoint        topics="chaindag" tid=65560 file=chain_dag.nim:910 finalizedHead=6ad92bbe:189@192 heads=1 newHead=23e933aa:256
```

如果想知道当前epoch与`headEpoch`的距离，你可以在[pyrmont.beaconcha.in](https://pyrmont.beaconcha.in/)查看比较。

例如，上面的日志输出显示现节现在正在处理`headEpoch: 7`，然后看下面截图的地方，你会看到最新一个epoch是`23582`。基于此，我们知道离完成数据同步还需要一些时间。



![p21](https://i.ibb.co/2572Q0V/21.png)



现在你的信标链已经作为服务来运行了。恭喜！

> 注意：当信标节点完全同步之后，验证者客户端会自动开始证明/提议区块。

你可以通过 [pyrmont.beaconcha.in](https://pyrmont.beaconcha.in/)查看你的验证者状态，只需搜索你的验证者公钥或用你的MetaMask钱包地址搜索。可能要过一段时间你的信息才会出现在网站上。



# 第11步：进行验证者存款

现在你的设置已经完成并在运行中了，你需要给Pyrmont测试网存入32个Göerli ETH。

> 注意：如果你已经提交了你的质押存款，你可以跳过这一步。

这一步是关于将所需的Göerli ETH存入Pyrmont测试网的存款合约。这需要在浏览器上通过Pyrmont的Launchpad网站启动你的MetaMask (或其他) 钱包。

> 注意：如果这份教程是用于主网 (它不是)，你需要等到你的Eth1节点和信标节点完全同步完再开存入你的存款。如果你不这样做，当你的Eth1节点或信标链在同步时，你可能要遭遇怠工惩罚。

Pyrmont测试网的Launchpad:https://pyrmont.launchpad.ethereum.org/

一直随着屏幕切换点击这些警告步骤，直到你到达**密钥对生成**的部分。选择你打算运行的验证者数量。选择一个与你在步骤5中生成的验证者文件数量相匹配的值。



![24](https://i.ibb.co/CwKwHzQ/p27.png)



往下滚动，看这些内容你是否同意，然后点击“Continue” (继续)。



![25](https://i.ibb.co/LdJsJwY/p28.png)



你会被要求上传`deposit_data-[timestamp].json`文档。这个文档你是在之气生成的，把它复制到有浏览器的计算机里。浏览/选择或拖拉这个文档，然后点击Continue。



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



# 第12步：安装Prometheus

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
  scrape_interval:     15s 
  evaluation_interval: 15sscrape_configs:
  - job_name: 'nimbus'
    static_configs:      
      - targets: ['localhost:8008']
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
level=info ts=2020-09-12T22:16:21.179Z caller=web.go:524 component=web msg="Start listening for connections" address=0.0.0.0:9090
level=info ts=2020-09-12T22:16:21.181Z caller=main.go:700 fs_type=EXT4_SUPER_MAGIC
level=info ts=2020-09-12T22:16:21.181Z caller=main.go:701 msg="TSDB started"
level=info ts=2020-09-12T22:16:21.182Z caller=main.go:805 msg="Loading configuration file" filename=/etc/prometheus/prometheus.yml
level=info ts=2020-09-12T22:16:21.182Z caller=main.go:833 msg="Completed loading of configuration file" filename=/etc/prometheus/prometheus.yml
level=info ts=2020-09-12T22:16:21.183Z caller=main.go:652 msg="Server is ready to receive web requests."
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



![p36](https://i.ibb.co/WHjnYcQ/36.png)



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



![p37](https://i.ibb.co/YPzv8GV/37.png)



如果你每一步都做对了，它会用绿色字体显示”active (running)"。如果没有显示，你需要倒回去重复上述步骤，修复问题。按Q退出 。

最后，允许Node Exporter随系统启动而启动。

```Powershell
$ sudo systemctl enable node_exporter
```

## 测试Prometheus和Node Exporter (可选)

所有东西都准备就绪了。通过在防火墙打开一个端口 (请参阅步骤2）和浏览`http://<yourserverip>:9090`你可以有选择性地测试它的功能。在那里你可以运行查询以查看不同的数据。例如，你可以试这个查询来看还有多少可用内存：

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



![p38](https://i.ibb.co/hgZtzRH/38.png)



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

现在开始导入仪表盘。移动你的鼠标到左边菜单栏的`+`图标，会有一个菜单弹出，选择 `Import`。

从[这里](https://raw.githubusercontent.com/sigp/lighthouse-metrics/master/dashboards/Summary.json)（从原始数据）复制粘贴JSON，点击`Load`，然后 `Import`。你应该可以看到仪表盘。

> 注意：很明显这是个非常基础的仪表盘。该团队正在努力加入更多的数据 （比如：验证者数、每个验证者的证明量、每个验证者的提议量、每个验证者的余额等)。现在官方的仪表盘还在开发中，请看[这里](https://github.com/status-im/nim-beacon-chain/blob/devel/grafana/beacon_nodes_Grafana_dashboard.json)。



![p42](https://i.ibb.co/rtTnDKG/42.png)



你还可以在Telegram和Discord看到警报信息。[这里](https://docs.prylabs.network/docs/prysm-usage/monitoring/grafana-dashboard/)是有指引。



# 写在最后

到这里就完成了！希望这个教程能帮到你。

- 如果你有任何反馈，你可以在[Twitter](https://www.twitter.com/SomerEsat) 或 [Reddit](https://www.reddit.com/user/SomerEsat)上联系窝
- 如果你喜欢这个教程并希望别人也能学习这个教程，请用[friends link](https://medium.com/@SomerEsat/4d2a86cc637b?source=friends_link&sk=4cb64bfa20247d2b5c7a50ce0a92d33b)把教程分享出去！
- 支持一下：somer.eth



# 附录——Nimbus更新

如果因为Git仓库的修改你需要更新代码，请按这些步骤来获取最新的文档并构建你的二进制文档。

```Powershell
$ cd ~
$ cd nimbus-eth2
$ git pull
$ make update
$ make NIMFLAGS="-d:insecure" nimbus_beacon_node
```

接下来，我们会停止信标链和验证者服务，并复制粘贴二进制文档到目录`/usr/local/bin`，然后再次启动服务。

```Powershell
$ sudo systemctl stop nimbus
$ sudo cp /$HOME/nimbus-eth2/build/nimbus_beacon_node /usr/local/bin
$ sudo systemctl start nimbus
$ sudo systemctl status nimbus # <-- Check for errors
$ sudo journalctl -fu nimbus.service # <-- Monitor
```

完成了！服务已经更新好了。



# 附录——Geth更新

如果你需要更新到最新版本的Geth，请按以下步骤：

```Powershell
$ sudo systemctl stop geth
$ sudo systemctl stop nimbus
$ sudo apt update && upgrade
$ sudo systemctl start geth
$ sudo systemctl status geth # <-- Check for errors
$ sudo journalctl -f -u geth # <-- Monitor
$ sudo systemctl start nimbus
$ sudo systemctl status nimbus # <-- Check for errors
$ sudo journalctl -f -u nimbus.service # <-- Monitor
```