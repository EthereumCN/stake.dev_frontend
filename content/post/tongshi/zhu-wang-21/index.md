---
path: zhu-wang-01
id: 21
title: 手把手教学：以太坊2.0主网质押Prysm篇。
description:  '手把手教学：以太坊2.0主网质押Prysm篇。' 
date: 2020-06-25T02:15:01.762Z
author: Carl Beekhuizen  
---






作者 | Somer Esat 

来源 | [someresat.medium.com](https://someresat.medium.com/guide-to-staking-on-ethereum-2-0-ubuntu-prysm-56f681646f74)





![p1](https://i.ibb.co/d743gVK/p1.png)





本文基于Prysmatic Labs的Prysm客户端，详细讲解如何参与以太坊2.0主网质押。主要基于以下几个技术：

- [Ubuntu](https://ubuntu.com/) Ubuntu v20.04 (LTS) x64 服务器
- [Go Ethereum](https://geth.ethereum.org/) 节点 ([代码分支](https://github.com/ethereum/go-ethereum))
- Prysmatic Labs ETH 2.0 客户端 —— Prysm ([代码分支](https://github.com/prysmaticlabs/prysm))
- 浏览器插件加密钱包 MetaMask[MetaMask](https://metamask.io/)

**提示：参与质押至少需要32 ETH 以及额外的gas费。 在搞清楚之前切记不要向任意地址发送ETH。本教程介绍了如何安全地将你的ETH存入存款合约。请牢记不要将ETH发送给任何人。**



# 致谢

本教程参考了网上的各种资料，感谢这些提供资料的贡献者！

感谢[EthStaker](https://discord.gg/7z8wzehjrJ)管理团队和提供教程的社区成员、Eth2 客户端团队、以及质押社区的帮助和校对。

特别感谢Eth2 客户端团队和以太坊基金会的研究员。他们经过几年的不懈努力，将我们带到这难以置信的时刻——Eth2.0成功创世。



# 免责声明

本文仅供参考，不构成专业建议。作为本教程的作者。我本人不保证文中信息的准确性，对于那些参考了本文进行操作而产生的任何损失概不负责。文末有更加完整的免责声明，请阅读之后再进行操作。



# 支持

如需技术支持，请联系：

- EthStaker社区是一个以太坊2.0 Staking 社区，资源丰富且十分友好。
- Reddit：https://www.reddit.com/r/ethstaker/
- Discord：https://discord.gg/7z8wzehjrJ
- Prysm 客户端团队，Discord：https://discord.gg/GVM5TJwzkU



# 条件

使用本教程需要对以太坊、ETH、Staking、Linux、MetaMask (Portis或Fortmatic) 有一定的背景知识。

还需要准备：

- [Ubuntu 服务器 v20.04 (LTS) amd64](https://ubuntu.com/tutorials/install-ubuntu-server#1-overview) 或者一个较新的，在本地计算机或云端安装和运行的Ubuntu服务器。
- 已安装或已配置的浏览器插件加密钱包[MetaMask](https://metamask.zendesk.com/hc/en-us/articles/360015489531-Getting-Started-With-MetaMask-Part-1-) (或Portis、Fortmatic)。一台装有操作系统 (Mac、Windows、Linux等) 和浏览器 (Brave、Safari、FireFox等) 的计算机。



# 从测试网到主网

如果你从测试网设置转到主网设置，那么我强烈建议你在一个全新的 (新安装的) 服务器实例上开始。本教程没有对迁移场景进行测试，所以如果你使用的是此前安装过的测试网软件，那么无法保证你的操作能成功。



# 要求

· 硬件要求是一个比较大的话题。总的来说：一个相对较新的CPU、8GB内存的RAM (16GB更佳)、一个内存至少500GB的SSD (1TB更佳)、稳定的网络（足够快的下载速度以及月度数据额度），这些性能都会让质押过程更加安全顺畅。

**注意：检查你的可用磁盘空间。尽管你有一个容量较大的SSD，Ubuntu也会出现仅剩200GB可用空间的状况。如果你遇到这种情况，请查看附录C —— 扩展逻辑卷。**



# 概览

下面这个简化图表标明了本篇教程所涉及的范围，标黄的即是本文会覆盖到的部分：

![img](https://i.ibb.co/GTy57kG/p2.png)

整个流程可以概念化表述为：

· 生成验证者密钥对和存款数据

· 准备Ubuntu服务器 (防火墙、安全设置等)

· 设置一个Eth1 节点并同步Eth1 区块链的数据

· 配置Prysm客户端并同步Eth1 节点数据

· 存款并激活验证者密钥对

那我们现在就开始吧！



# 第1步：生成质押数据

参与质押首先要决定你想要运行的验证者节点的数量，并基于此生成一些数据文件。

**注意：如果你的存款数据和验证者密钥对已经生成，可以跳过这一步。**

一个验证者节点需要存32 ETH，你的MetaMask钱包里要有相应足够的ETH。比如，如果你计划运行5个验证者节点，你将需要准备160 ETH (32*5) 并且预留一些gas费。存款过程会稍后再讲解，下面教大家怎么把设备运行起来。

## 下载存款工具 (存款CLI)

点击[此处](https://github.com/ethereum/eth2.0-deposit-cli/releases/)下载最新发布的存款命令行界面app (CLI app)。

下载链接：https://github.com/ethereum/eth2.0-deposit-cli/releases/

![img](https://i.ibb.co/Hgfx578/p3.png)

在“Assets”那一栏选择与你的设备 (如Windows、Mac、Linux Desktop等) 匹配的版本并下载。

## 运行存款工具 (Eth2 存款CLI)

解压文件，里面应该有一个二进制文件 (可执行文件)。存款工具生成用于质押的文件和一组助记词。这组助记词需要安全地保存。下面有两种选择：

**建议方案**：将这份二进制文件复制粘贴到USB驱动器里。连接到一台此前从未连接过网络的计算机，将文件复制到计算机里并开始运行。

**不建议方案**：在当前使用的计算机上运行。但是网络连接可能会导致你的助记词密钥泄漏。如果没有未联网的计算机，那就在开始运行之前断开网络。

准备好之后，在终端窗口 (或windows的命令提示符CMD) 中运行这份文件以继续使用下面列出的命令。确定好你要运行的验证者节点的数量之后，用该数字替换 。例如：-num_validators 2

Linux/Mac:

```powershell
./deposit new-mnemonic --num_validators <NumberOfValidators> --chain mainnet
```

Windows:

```powershell
deposit.exe new-mnemonic --num_validators <NumberOfValidators> --chain mainnet
```

在你选择的计算机执行上面的步骤之后，你将被要求创建一个验证者密钥存储库 (validator keystore) 密码，并保存在一个安全的地方。在后面的步骤中，你将需要这个keystore来上传验证者密钥到Prysm的验证者钱包里。

![img](https://i.ibb.co/XYZjj7q/p4.png)

随后会生成一组**助记词**，请保存在一个安全的地方，**这至关重要**。因为最终你需要助记词来生成提款密钥以提出质押的ETH，并且增加验证者节点时也需要使用助记词。如果你丢失了助记词，就无法将你的资产提出了。

![img](https://i.ibb.co/K9ncHt8/p5.png)

一旦你点击确认已经记好助记词之后，你的验证者密钥对便会生成。

![img](https://i.ibb.co/jTVR96R/p6.png)

新创建的验证者密钥对和存款数据文件会放置在指定位置。文件夹的内容如下所示：

![img](https://i.ibb.co/cQsh0nx/p7.png)

关于这些文件：

· 文件 `deposit_data-[timestamp].json` 包含验证者公钥和质押存款信息。该文件将用于完成随后的ETH存款过程。

· 文件 `keystore-m...json` 包含经过加密的验证者签名密钥。每一个验证者节点对应一个“keystore-m”。该文件将被导入到Prysm验证者钱包中以备质押时使用。随后需要将这些文件复制粘贴到Ubuntu服务器中。

## 最后的步骤

现在你已经有了存款数据和密钥存储库文件，接下来就可以设置Ubuntu服务器了。

**注意：此时还不能进行存款。**

首先完成并验证你的质押设置非常重要。如果你的ETH存款激活了，但是质押设置还没准备好的话，你将会受到怠工惩罚。



# 第2步：连接至服务器

使用一个SSH端口，连接至你的Ubuntu服务器。如果你用`root`登录，最好是重新创建一个拥有管理权限的用户账户，因为使用root用户登录存在很大的[风险](https://askubuntu.com/questions/16178/why-is-it-bad-to-log-in-as-root)。

> 注意：如果你不是用`root`登录的便可以直接跳到第三步。

创建一个新账户。在 `<yourusername>` 中填入你的用户名，然后设置一个安全系数较高的密码，并输入其他可选信息。

```powershell
# adduser <yourusername>
```

通过把新的用户加入`sudo`群组中，来授予其管理权限。这样用户在命令行前输入`sudo`，便会以超级用户的权限来执行操作。

```powershell
# usermod -aG sudo <yourusername>
```

可选项：如果你使用SSH密钥通过`root`用户连接你的Ubuntu系统，你需要将新创建的账户和root用户的[SSH密钥数据](https://jumpcloud.com/blog/what-are-ssh-keys)组合起来。

```powershell
# rsync --archive --chown=<yourusername>:<yourusername> ~/.ssh /home/<yourusername>
```

最后，退出登录你的`root`账户，然后使用你新创建的用户名`<yourusername>`登入Ubuntu服务器。



# 第3步：升级服务器

确保系统更新至最新的软件和安全设置。

```powershell
$ sudo apt update && sudo apt upgrade
$ sudo apt dist-upgrade && sudo apt autoremove
$ sudo reboot
```



# 第4步：保护服务器

安全性十分重要。但由于本文不是针对安全性的指南，所有只列出了一些基础的设置。

## 修改SSH默认端口

SSH默认端口是端口22，也是易受攻击的矢量，因此可以修改SSH端口来防止攻击。

在1024 — 49151之间选择一个端口号，然后运行以下命令以检索尚未使用的端口号。没有其他显示便意味着该端口号未被使用；显示红色便意味着已被使用，请尝试其他端口号。比如：`sudo ss -tulpn | grep ':6673'`

```powershell
$ sudo ss -tulpn | grep ':<YourSSHPortNumber>'
```

确定端口号可用之后，通过升级SSH设置来修改默认端口。

```powershell
$ sudo nano /etc/ssh/sshd_config
```

在文件中检索或者添加 (如果没有的话) `Port 22` 命令行。删掉`#` (如果有的话) 并在下面的命令行中输入端口号。

```powershell
Port <YourSSHPortNumber>
```

参考下方的截图。按CTRL+x 然后选 ‘y’ ，按回车保存并退出。

![img](https://i.ibb.co/pzy7wfL/p8.png)

重新启动 SSH 服务以显示上述所作的修改。

```powershell
$ sudo systemctl restart ssh
```

登出并使用你的SSH端口号`<YourSSHPortNumber>`重新登入。

## 配置防火墙

Ubuntu 20.04 服务器可以使用默认的 [UFW 防火墙](https://help.ubuntu.com/community/UFW) 来限制访问该服务器的流量，不过要先设置其允许来自 SSH、Go Ethereum、Prysm 的入站流量。

**安装 UFW 防火墙**

按照下面的命令行输入以保证在默认情况下安装 UFW。

```powershell
$ sudo apt install ufw
```

**应用 UFW 默认值**

明确地应用默认值，拒绝入站流量，允许出站流量。

```powershell
$ sudo ufw default deny incoming
$ sudo ufw default allow outgoing
```

**允许 SSH**

允许你此前设置的端口号 `<YourSSHPortNumber>` 的入站流量。SSH 要求 TCP 协议。比如：`sudo ufw allow 6673/tcp`

```powershell
$ sudo ufw allow <yourSSHportnumber>/tcp
```

**拒绝 SSH 端口号22**

拒绝端口 22/TCP 的入站流量。

> NOTE: Only do this after you SSH in using `*<YourSSHPortNumber>*`.
>
> 注意：当你完成了修改 SSH 默认端口之后再做这一步。

```powershell
$ sudo ufw deny 22/tcp
```

**允许 Go Ethereum**

允许与 Go Ethereum 的对等节点 (端口 30303) 进行点对点 (P2P) 连接。如果你使用[第三方托管](https://ethereumnodes.com/)的 Eth1 节点，则可以跳过这一步。

> 注意：如果你在本地托管你的Ubuntu服务器，你需要[配置](https://www.howtogeek.com/66214/how-to-forward-ports-on-your-router/)你的网络路由以允许来自端口 30303 的入站流量。

```powershell
$ sudo ufw allow 30303
```

**允许 Prysm 客户端**

允许与 Prysm 的对等节点进行点对点连接，以便在信标链节点上 (Prysmatic Labs 的默认端口为 13000/TCP 和 12000/UDP) 进行操作。

> 注意：如果你在本地托管你的Ubuntu服务器，你需要[配置](https://www.howtogeek.com/66214/how-to-forward-ports-on-your-router/)你的网络路由以允许来自端口 13000 和12000 的入站流量。

```powershell
$ sudo ufw allow 13000/tcp
$ sudo ufw allow 12000/udp
```

开启防火墙并检查是否已按上述步骤正确地配置。

```powershell
$ sudo ufw enable
$ sudo ufw status numbered
```

查看下面截图以供参考。

![img](https://i.ibb.co/bPqGH2J/p9.png)

# 第5步：配置定时器

Ubuntu 内置了时间同步，并默认使用 systemd‘s timesyncd 服务进行激活。验证其是否正确运行。

```powershell
$ timedatectl
```

激活 `NTP service` ，运行方式：

```powershell
$ sudo timedatectl set-ntp on
```

参考下方的截图：

![img](https://i.ibb.co/ftXCM1Q/p10.png)

只能使用单个定时器服务。如果你此前安装过 NTPD，你需要检查此文件是否还存在，如果存在请操作下面的命令行以删除。

```powershell
$ ntpq -p
$ sudo apt-get remove ntp
```



# 第6步：设置一个 Eth1 节点

参与质押需要一个 Eth1 节点。你可以选择运行一个本地 Eth1 节点，也可以使用[第三方提供的节点](https://ethereumnodes.com/)。本教程会详细讲解如何运行 Go Ethereum，如果你选择[第三方服务](https://ethereumnodes.com/)的话，可以跳过这一步。

> 注意：检查你的可用磁盘空间。一个Eth1节点需要大概400GB的存储空间。尽管你有一个容量较大的固态硬盘，Ubuntu也可能显示仅剩200GB的可用空间。如果你遇到这种情况，请查看附录C —— 扩展逻辑卷。

## 安装 Go Ethereum

使用PPA (Personal Package Archives，个人安装包存档) 安装Go Ethereum客户端。

```powershell
$ sudo add-apt-repository -y ppa:ethereum/ethereum
$ sudo apt update
$ sudo apt install geth
```

将Go Ethereum作为后台服务来运行，运行该服务需要创建一个账户。此种类型的账户无法登录服务器。

```powershell
$ sudo useradd --no-create-home --shell /bin/false goeth
```

为Eth1区块链创建数据目录，用来存储Eth1节点数据。

```powershell
$ sudo mkdir -p /var/lib/goethereum
```

设置目录的权限。 `goeth` 账户需要权限来修改该数据目录。

```powershell
$ sudo chown -R goeth:goeth /var/lib/goethereum
```

创建一个systemd服务配置文件来对该服务进行配置。

```powershell
$ sudo nano /etc/systemd/system/geth.service
```

将下列的服务配置复制粘贴到文档中。

```powershell
[Unit]
Description=Go Ethereum Client
After=network.target
Wants=network.target[Service]
User=goeth
Group=goeth
Type=simple
Restart=always
RestartSec=5
ExecStart=geth --http --datadir /var/lib/goethereum --cache 2048 --maxpeers 30[Install]
WantedBy=default.target
```

需要注意的 [flags](https://geth.ethereum.org/docs/interface/command-line-options):

`--http` 用来公开与Prysm信标链节点连接的一个HTTP端口 ([http://localhost:8545](http://localhost:8545/))。

`--cache` 指的是内部缓存的大小，以GB为单位。数值的增减取决于你的可用系统内存。设置 `2048` 将大概需要使用 4-5 GB的内存。

`--maxpeers` 指的是所连接节点的最大数值。节点数量越多，意味着越多的网络数据可用空间。所以记得不要将该数值设置得太低，否则你的Eth1节点将难以保持同步。

参考下方的截图。按CTRL+x 然后选 ‘y’ ，按回车保存并退出。

![img](https://i.ibb.co/JBmb1PL/p11.png)

重新加载 systemd 以显示上述的更改并启动服务。检查状态以确保其正确运行。

```powershell
$ sudo systemctl daemon-reload
$ sudo systemctl start geth
$ sudo systemctl status geth
```

参考下方的截图：

![img](https://i.ibb.co/vxr3pNh/p12.png)

如果你每一步都做对了，它会用绿色字体显示”active (running)"。如果没有显示，你需要倒回去重复上述步骤，修复问题。按Q退出 (此操作不会影响geth服务)。

允许geth服务在系统重启时自动启动。

```powershell
$ sudo systemctl enable geth
```

Go Ethereum节点将会开始同步。你可以运行下列命令来追踪进程或检查错误。按“CTRL+c”退出 (此操作不会影响geth服务)。

```powershell
$ sudo journalctl -fu geth.service
```

参考下方的截图：

![img](https://i.ibb.co/qDvJ767/p13.png)

## 查看同步状态

要检查Eth1节点[同步状态](https://www.ipaddressguide.org/how-long-time-does-it-take-to-synchronize-an-ethereum-node/)，请使用下列命令访问控制台。

```powershell
geth attach http://127.0.0.1:8545
> eth.syncing
```

如果显示结果是 `false` ，表明你的同步已完成。如果显示结果是同步数据，表明你仍在同步。作为参考，大概有7亿个已知状态 `knownStates`.

参考下方的截图

![img](https://i.ibb.co/MZjyqnH/p14.png)

完成时按“CTRL+d”以退出。

## 检查连接的对等节点

要检查你的Eth1节点所连接的对等节点，请使用下列命令访问控制台。

```powershell
geth attach http://127.0.0.1:8545
> net.peerCount
```

对等节点总数 `peerCount` 不会超过你所设置的最大对等节点总数 `--maxpeers` 。如果无法找到需要同步的对等节点，参阅下一部分。

完成后按“CTRL+d”以退出。

## 添加 bootnodes (可选)

有时可能要花点时间才能找到要同步的对等节点，可以添加bootnodes以改善这种情况。访问[这里](https://www.ethereum.cn/guide-to-staking-on-ethereum-2-0-ubuntu-prysm)https://gist.github.com/rfikki/a2ccdc1a31ff24884106da7b9e6a7453 获得最新的清单并根据下列操作修改geth服务：

```powershell
$ sudo systemctl stop geth
$ sudo nano /etc/systemd/system/geth.service
```

修改 `ExecStart` 行，添加 `--bootnodes` flag：在下方罗列出最新的对等点，并以逗号分割。

```powershell
ExecStart=geth --http --datadir /var/lib/goethereum --cache 2048 --maxpeers 30 --bootnodes "enode://d0b4a09d072b3f021e233fe55d43dc404a77eeaed32da9860cc72a5523c90d31ef9fab7f3da87967bc52c1118ca3241c0eced50290a87e0a91a271b5fac8d0a6@157.230.142.236:30303,enode://5070366042daaf15752fea340e7ffce3fd8fc576ac846034bd551c3eebac76db122a73fe8418804c5070a5e6d690fae133d9953f85d7aa00375d9a4a06741dbc@116.202.231.71:30303"
```

保存文件之后退出。然后重启服务并观察。

```powershell
$ sudo systemctl daemon-reload
$ sudo systemctl start geth
$ sudo journalctl -fu geth.service
```

> 注意：需要按照一系列特定的步骤来更新Geth。更多信息请参见“附录A：更新Geth”。



# 第7步：下载Prysm

Prysm客户端由两份二进制文件组成：信标链节点和验证者客户端。本步骤将讲解如何下载Prysm和那两份二进制文件。

首先，访问[这里](https://www.ethereum.cn/guide-to-staking-on-ethereum-2-0-ubuntu-prysm)https://github.com/prysmaticlabs/prysm/releases并找到最新发布的Prysm版本。通常在页面的最顶部，比如：

![img](https://i.ibb.co/GdP0KHk/p15.png)

在“Assets”那一栏（如果需要的话点击展开) 将下载链接复制粘贴至文档**beacon-chain-v…-linux-amd64**以及文档**validator-v…-linux-amd64**中。请确保复制的链接是正确的。

![img](https://i.ibb.co/jhRwqvV/p16.png)

操作下列命令来下载这些文件。将下方指令部分的URL改为最新版本的下载链接。

```powershell
$ cd ~
$ sudo apt install curl$ curl -LO https://github.com/prysmaticlabs/prysm/releases/download/v1.0.0/beacon-chain-v1.0.0-linux-amd64$ curl -LO https://github.com/prysmaticlabs/prysm/releases/download/v1.0.0/validator-v1.0.0-linux-amd64
```

重命名文档并使它们可执行。将他们复制到目录 `/usr/local/bin` 中，Prysm会在该处运行这些文件。根据需求修改文档名。

```powershell
$ mv beacon-chain-v1.0.0-linux-amd64 beacon-chain
$ mv validator-v1.0.0-linux-amd64 validator$ chmod +x beacon-chain
$ chmod +x validator$ sudo cp beacon-chain /usr/local/bin
$ sudo cp validator /usr/local/bin
```

清理下载的文档。

```powershell
$ cd ~
$ sudo rm beacon-chain && sudo rm validator
```

注意：需要按照一系列特定的步骤来更新Prysm。更多信息请参见“附录B：更新Prysm”。



# 第8步：导入验证者密钥对

导入你在第1步生成的密钥对，以配置Prysm验证者钱包。

## 复制验证者密钥存储文件

如果你的验证者存储文件 `keystore-m…json` 不是在你的Ubuntu服务器上生成的，那么你就需要将这些文件复制粘贴到你的本地目录中。你可以用 USB 把文件拷过去 (如果你的服务器是本地的)，也可以使用[安全的FTP (SFTP)](https://www.maketecheasier.com/use-sftp-transfer-files-linux-servers/)。

将文件放置在： `$HOME/eth2deposit-cli/validator_keys`。如果需要的话创建文件目录。

## 将密钥存储文件导入验证者客户端

创建一个目录以存储验证者钱包数据，并授予当前用户访问该目录的权限。当前用户需要访问权限来执行导入。在 `<yourusername>` 修改登入用户名。

```powershell
$ sudo mkdir -p /var/lib/prysm/validator
$ sudo chown -R <yourusername>:<yourusername> /var/lib/prysm/validator
```

运行验证者密钥导入进程。你需要提供放置已生成的密钥存储库文件的路径。比如： `$HOME/eth2deposit-cli/validator_keys`

```powershell
$ cd /usr/local/bin
$ validator accounts import --keys-dir=$HOME/eth2deposit-cli/validator_keys
```

然后会出现一些[使用条款](https://github.com/prysmaticlabs/prysm/blob/master/TERMS_OF_SERVICE.md)，你需要输入接受 `accept` 才能继续下一步。

你将需要提供一个**钱包目录**，在这里你可以创建新的钱包。输入：`/var/lib/prysm/validator`

![img](https://i.ibb.co/6Wyz7jq/p16-5.png)![img](https://i.ibb.co/wz4krDB/p17.png)

然后创建一个钱包密码并保存在一个安全的地方。稍后你配置验证者时将需要使用这个密码。

![img](https://i.ibb.co/wz4krDB/p17.png)

接下来你需要提供你在第1步生成的验证者密钥对。

![img](https://i.ibb.co/7SN92nQ/p18.png)

如果输入正确，密钥将被导入。

![img](https://i.ibb.co/rvMw28R/p19.png)

## 创建一个钱包密码文件

创建一个文件来保存钱包密码，这样Prysm验证者服务就可以在不知道密码的情况下访问该钱包了。文件命名为：password.txt

```powershell
$ sudo nano /var/lib/prysm/validator/password.txt
```

将你的新钱包密码导入文件中，用你的密码替换掉 `YourNewWalletPassword` 。

Check the screen shot below for reference. Press CTRL+x then ‘y’ then to save and exit.

参考下方的截图。按CTRL+x 然后选 ‘y’ ，按回车保存并退出。

![img](https://i.ibb.co/3rhMY57/p20.png)

接下来会讲如何设置验证者目录以及密码文件的访问权限。

现在已经导入成功并且设置好钱包了。



# 第9步：配置Prysm信标节点

在这一步，你要把节点作为服务那样来配置并运行，因此如果系统重启，这个过程将自动重新开始。

## 设置账户和目录

为信标节点的运行创建一个账户。这种账户不能用来登录进入服务器。

```powershell
$ sudo useradd --no-create-home --shell /bin/false prysmbeacon
```

为信标节点的数据库创建数据目录和设置权限。

```powershell
$ sudo mkdir -p /var/lib/prysm/beacon
$ sudo chown -R prysmbeacon:prysmbeacon /var/lib/prysm/beacon
$ sudo chmod 700 /var/lib/prysm/beacon
$ ls -dl /var/lib/prysm/beacon
```

参考下方的截图。

![img](https://i.ibb.co/wMy1Wj5/p21.png)

## 创建和配置服务

创建一个systemd服务的config文档来配置服务

```powershell
$ sudo nano /etc/systemd/system/prysmbeacon.service
```

将下面这段代码复制粘贴到文档里

```powershell
[Unit]
Description=Prysm Eth2 Client Beacon Node
Wants=network-online.target
After=network-online.target[Service]
User=prysmbeacon
Group=prysmbeacon
Type=simple
Restart=always
RestartSec=5
ExecStart=/usr/local/bin/beacon-chain --datadir=/var/lib/prysm/beacon --http-web3provider=http://127.0.0.1:8545 --accept-terms-of-use[Install]
WantedBy=multi-user.target
```

需要注意的[flags](https://docs.prylabs.network/docs/prysm-usage/parameters):

`--http-web3provider` 如果你正在使用一个远程或第三方的Eth1节点，你需要改变这个值。如果你是在本地创建Eth1节点的，这里不需要改动。

`--accept-terms-of-use` 需要自动启动服务。使用这个flag表示接受Prysm的[使用条款](https://github.com/prysmaticlabs/prysm/blob/master/TERMS_OF_SERVICE.md)。

.参考下方的截图。按 CTRL+x然后'y'，按回车保存然后退出。(译者注：此处作者没有提供截图）

重新加载systemd以显示更改。

```powershell
$ sudo systemctl daemon-reload
```

Start the service and check to make sure it’s running correctly. 启动服务并检查，确保正确运行。

```powershell
$ sudo systemctl start prysmbeacon
$ sudo systemctl status prysmbeacon
```

参考下方的截图

![img](https://i.ibb.co/86XMtkF/p22.png)

如果你每一步都做对了，它会用绿色字体显示”active (running)"。如果没有显示，你需要倒回去重复上述步骤，修复问题。按Q退出 (不会影响prysmbeacon的服务)。

允许服务随系统重启而自动重启。

```powershell
$ sudo systemctl enable prysmbeacon
```

如果Eth2 链处于创世后的状态，Prysm的信标链会开始同步数据。它可能要花几个小时才能完全实现同步。你可以通过运行`journalctl` 命令来追踪进程或检查错误。按CTRL+c退出 (将不会影响prysmbeacon的服务)

```powershell
$ sudo journalctl -fu prysmbeacon.service
```

日志的截位视图会显示以下状态信息。

```powershell
Nov 27 06:20:48 ETH-STAKER-001 bash[44829]: time="2020-11-27 06:20:48" level=info msg="Processing deposits from Ethereum 1 chain" deposits=1024 genesisValidators=1019 prefix=powchain
```

当Eth2主网启动，信标链和验证者将自动开始处理数据。

> 注意：如果你的Eth1节点仍在同步，你将会出现以下报错信息。当同步完成了，它会自动消失。

```powershell
Nov 27 06:16:29 ETH-STAKER-001 bash[44747]: time="2020-11-27 06:16:29" level=error msg="Could not connect to powchain endpoint" error="could not dial eth1 nodes: eth1 node using incorrect chain id, 0 != 1" prefix=powchain
```



# 第10步：配置Prysm验证者客户端

在这一步，你需要将你的验证者客户端作为一项后台服务来配置和运行，因此系统重启时这个进程会自动重启。

## 创建账户和目录

为验证者客户端的运行创建一个账户。这类账户无法登录服务器。

```powershell
$ sudo useradd --no-create-home --shell /bin/false prysmvalidator
```

这个验证者数据目录已经在第8步创建了。现在设置权限，使得这个`prysmvalidator`账户可以修改这个数据目录。

```powershell
$ sudo chown -R prysmvalidator:prysmvalidator /var/lib/prysm/validator
$ sudo chmod 700 /var/lib/prysm/validator
$ ls -dl /var/lib/prysm/validator
```

参考下方的截图。

![img](https://i.ibb.co/9yRKsfm/p23.png)

验证者钱包的password.txt文档在第8步已经创建了。现在设置权限，使得只有`prysmvalidator`的账户可以读取这个文档。

```powershell
$ sudo chmod -R 700 /var/lib/prysm/validator/password.txt
$ sudo ls -lh /var/lib/prysm/validator/
```

![img](https://i.ibb.co/wz109tf/p24.png)

## 创建并配置服务

创建一个systemd服务文件来配置服务

```powershell
$ sudo nano /etc/systemd/system/prysmvalidator.service
```

将下面这段代码复制粘贴到文档里

```powershell
[Unit]
Description=Prysm Eth2 Validator Client
Wants=network-online.target
After=network-online.target[Service]
User=prysmvalidator
Group=prysmvalidator
Type=simple
Restart=always
RestartSec=5
ExecStart=/usr/local/bin/validator --datadir=/var/lib/prysm/validator --wallet-dir=/var/lib/prysm/validator --wallet-password-file=/var/lib/prysm/validator/password.txt --graffiti="<yourgraffiti>" --accept-terms-of-use[Install]
WantedBy=multi-user.target
```

需要注意的[flag](https://docs.prylabs.network/docs/prysm-usage/parameters):

`--graffiti="<yourgraffiti>"` 填上你的涂鸦字串符。出于安全和隐私，应避免使用能唯一辨识你的信息。比如`--graffiti "Hello Eth2! From Dominator"`。

参考下方的截图。按CTRL+x 然后选 ‘y’ ，按回车保存并退出。

![img](https://i.ibb.co/qnwySDN/p25.png)

重新加载systemd以显示更改。

```powershell
$ sudo systemctl daemon-reload
```

开启服务并检查，确保运行正确。

```powershell
$ sudo systemctl start prysmvalidator
$ sudo systemctl status prysmvalidator
```

参考下方的截图

![img](https://i.ibb.co/7gJN8Nw/p26.png)

如果你每一步都做对了，它会用绿色字体显示”active (running)"。如果没有显示，你需要倒回去重复上述步骤，修复问题。按Q退出 (不会影响prysmvalidator的服务)。

允许服务随系统重启而自动重启。

```powershell
$ sudo systemctl enable prysmvalidator
```

你可以通过运行`journalctl`命令来追踪进程或检查错误。按CTRL+c来退出(将不会影响prysmvalidator的服务)

```powershell
$ sudo journalctl -fu prysmvalidator.service
```

日志的截位视图会显示以下状态信息。

```powershell
ETH-STAKER-001 systemd[1]: Started Prysm Eth2 Validator Client.
level=warning msg="Running on ETH2 Mainnet" prefix=flags
level=info msg="Opened validator wallet" keymanager-kind=direct level=info msg="Checking DB" databasePath="/var/lib/prysm/validator" level=info msg="Starting validator node" prefix=node 
...
level=info msg="Validating for public key" prefix=validator publicKey=0x9072a8f02c18
level=info msg="Validating for public key" prefix=validator publicKey=0xaa5ff8b63560
level=info msg="Waiting for beacon chain start log from the ETH 1.0 deposit contract" prefix=validator
level=info msg="Beacon chain started" genesisTime=2020-12-01 12:00:23 +0000 UTC prefix=validator
level=info msg="Waiting for deposit to be observed by beacon node" prefix=validator pubKey=0x9072a8f02c18 status="UNKNOWN_STATUS"
```

你可以在 [beaconcha.in](https://beaconcha.in/)查看你的验证者状态。只需要搜索你的验证者公钥或使用你的MetaMask （或其他）钱包地址进行搜索。你的数据可能要过一段时间才会在网站上显示。



# 第11步：进行验证者存款

现在你的节点已经设置好并开始运行，你将需要将ETH存入你的验证者节点。

> 注意：如果你已经提交了你的质押存款，你可以跳过这一步

这一步是关于将所需的ETH存入Eth2.0的存款合约。不要把ETH发送到存款合约。这需要在浏览器上通过Eth2.0的Launchpad网站启动你的MetaMask (或其他) 钱包。

> 注意：如果是在创世后进行的话，你需要在你的Eth1节点和信标链都完全同步完之前存入你的存款。如果你不这样做，当你的Eth1节点或信标链在同步时，Prysm会处于怠工状态，而你可能要遭遇怠工惩罚。

以太坊2.0 Launchpad: https://launchpad.ethereum.org/

一直随着屏幕切换点击这些警告步骤，直到你到达**密钥对生成**的部分。选择你打算运行的验证者数量。选择一个与你在步骤1中生成的验证者文件数量相匹配的值。

![img](https://i.ibb.co/CwKwHzQ/p27.png)

往下滚动，看这些内容你是否同意，然后点击“Continue” (继续)。

![img](https://i.ibb.co/LdJsJwY/p28.png)

你会被要求上传`deposit_data-[timestamp].json`文档。这个文档你是在步骤1生成的。浏览/选择或拖拉这个文档，然后点击Continue。

![img](https://i.ibb.co/PTkh7gD/p29.png)

连接你的钱包。选择MetaMask (或者是其他支持的钱包)，登录，选择存有你的ETH的钱包，然后点击Continue。

你的MetaMask余额就会显示出来。如果你选择了主网且你有充足的ETH余额，网站会允许你继续下一步。

![img](https://i.ibb.co/tqrFPLV/p30.png)

然后会出现一个Summary (总结)，显示验证者数和所需的ETH数量。如果你同意的话就给那些方框打勾，然后点击Continue。

![img](https://i.ibb.co/jktcfzz/p31.png)

如果你准备好去存款了，点击"Initiate All Transactions" (启动所有交易）。

![img](https://i.ibb.co/NFbJXL5/p32.png)

当你到了可以确认每笔交易那一步时，MetaMask (或其他钱包)的窗口会自动弹出。

当所有的交易都成功完成时，你的质押也完成了！

![img](https://i.ibb.co/kq7Cn7v/p33.png)

恭喜你已经成功存入你的质押存款了！

## 查看你的验证者存款状态

新加入的验证者需要等一下 (几个小时到几天不等)才能激活。你可以以下几步来查看你的密钥状态：

1. 复制你的MetaMask (或其他）钱包地址。
2. 前往这里: [beaconcha.in/](https://beaconcha.in/)
3. 用你的钱包地址搜索你的密钥

![img](https://i.ibb.co/JQYHLPH/p34.png)

点进某个验证者详情，每个验证者激活后你会看到在Status那一栏有预估时间。

![img](https://i.ibb.co/nbPs42c/p35.png)

现在你面前有一个条正在运作的信标链、一个验证者节点以及你的主网存款。如果以太坊2.0主网处于运行中，一旦你的存款被激活，你将开始工作并赚取收益。

**恭喜你：你终于正式成为了一名以太坊质押者**

是时候来一顿肥宅水狂欢了。



# 第12步：监测

因为一些还没被解决的安全问题，监测这一部分将在未来补充到这份教程。



# 结束语及后续建议

感谢大家给我这个机会。希望这份教程能帮到大家。

**后续步骤:**

- 检查三次所有密钥与密码备份。
- 重启你的电脑并确保服务都能自动启动。
- 了解如何升级客户端与服务器软件。
- 使用`htop`来监测本地电脑的资源
- 熟悉[beaconcha.in](https://beaconcha.in/) ，这样你就能监测你的验证者情况，其提供警报功能 （通过邮件发送，需要注册）和最多[3个POAP](https://beaconcha.in/poap)。
- J 加入 [Ethstaker](https://discord.gg/7z8wzehjrJ)和 [Prysm](https://discord.gg/VaQcHq76yJ)的Discord，留意重要通知。
- 请在[Discord](https://discord.gg/7z8wzehjrJ)、 [Twitter](https://www.twitter.com/SomerEsat)、或[Reddit](https://www.reddit.com/user/SomerEsat)分享对这份教程的反馈。
- 在 [Ethstaker](https://discord.gg/7z8wzehjrJ) 的discord上帮助其他人设置。
- 用[friend link](https://someresat.medium.com/guide-to-staking-on-ethereum-2-0-ubuntu-prysm-56f681646f74?sk=b61691b713d37802b8345855dc356b02)分享这份教程
- 支持一下：somer.eth



# 延伸阅读

强烈建议大家从尽可能多的来源获取信息，还有很多其他资源可以帮助你熟悉如何在Eth2上质押。

如果作者对这些资源还没测试或验证过，而你采用了的话，是要自己承担风险的。

- C客户端团队的官方文档 [Prysm](https://docs.prylabs.network/docs/getting-started) | [Lighthouse](https://lighthouse-book.sigmaprime.io/) | [Teku](https://docs.teku.consensys.net/en/latest/) | [Nimbus](https://status-im.github.io/nimbus-eth2/intro.html)
- [/r/EthStaker Sticky](https://www.reddit.com/r/ethstaker/comments/jjdxvw/welcome_to_rethstaker_the_home_for_ethereum/)
- [以太坊2.0客户端的非官方docker环境](https://github.com/eth2-educators/eth2-docker)
- [如何在Ubuntu上设置Eth2主网验证者系统](https://github.com/metanull-operator/eth2-ubuntu)
- [指南 | 如何在ETH2主网设置验证者](https://www.coincashew.com/coins/overview-eth/guide-or-how-to-setup-a-validator-on-eth2-mainnet)
- [指南 | ETH2验证者信标链节点的安全最佳实践](https://www.coincashew.com/coins/overview-eth/guide-or-security-best-practices-for-a-eth2-validator-beaconchain-node)
- [ETH2质押节点的额外监察](https://moody-salem.medium.com/additional-monitoring-for-eth2-staking-nodes-aea05b2f9a86)
- [以太坊2.0质押的Telegram服务](https://9elements.com/blog/ethereum-2-0-2/)



# 附录A — Geth更新

如果你需要更新到Geth的最新版本，请按下列步骤：

```powershell
$ sudo systemctl stop prysmvalidator
$ sudo systemctl stop prysmbeacon
$ sudo systemctl stop geth
$ sudo apt update && sudo apt upgrade
$ sudo systemctl start geth
$ sudo systemctl status geth # <-- Check for errors
$ sudo journalctl -fu geth # <-- Monitor
$ sudo systemctl start prysmbeacon
$ sudo systemctl status prysmbeacon# <-- Check for errors
$ sudo journalctl -fu prysmbeacon.service # <-- Monitor
$ sudo systemctl start prysmvalidator
$ sudo systemctl status prysmvalidator# <-- Check for errors
$ sudo journalctl -fu prysmvalidator.service # <-- Monitor
```



# 附录B — 更新Prysm

如果你需要更新到Prysm的最新版本，请按下列步骤进行：

首先，前往[这里](https://github.com/prysmaticlabs/prysm/releases)找出最新的Linux发布。在asset部分 (如果需要的话点击展开)复制下载连接到**beacon-chain-v…-linux-amd64** 和 **validator-v…-linux-amd64**文档。注意要复制正确的链接。

将下方指令部分的URL改为最新版本的下载链接。

```powershell
$ cd ~
$ sudo apt install curl$ curl -LO https://github.com/prysmaticlabs/prysm/releases/download/v1.0.0/beacon-chain-v1.0.0-linux-amd64$ curl -LO https://github.com/prysmaticlabs/prysm/releases/download/v1.0.0/validator-v1.0.0-linux-amd64
```

停止Prysm的服务。

```powershell
$ sudo systemctl stop prysmvalidator
$ sudo systemctl stop prysmbeacon
```

重命名文档使其可执行。复制它们到`/usr/local/bin` 目录。需要的话修改下方的文档名。

```powershell
$ mv beacon-chain-v1.0.0-linux-amd64 beacon-chain
$ mv validator-v1.0.0-linux-amd64 validator$ chmod +x beacon-chain
$ chmod +x validator$ sudo cp beacon-chain /usr/local/bin
$ sudo cp validator /usr/local/bin
```

重启服务并检查错误。

```powershell
$ sudo systemctl daemon-reload
$ sudo systemctl start prysmbeacon
$ sudo systemctl status prysmbeacon# <-- Check for errors
$ sudo journalctl -fu prysmbeacon.service # <-- Monitor
$ sudo systemctl start prysmvalidator
$ sudo systemctl status prysmvalidator# <-- Check for errors
$ sudo journalctl -fu prysmvalidator.service # <-- Monitor
```

清理已下载的文档。

```powershell
$ cd ~
$ sudo rm beacon-chain && sudo rm validator
```



# 附录 C — 扩展逻辑卷

很多时候Ubuntu只预配200GB的较大固态硬盘，导致用户在同步他们的Eth1节点时就耗尽存储空间了。报错信息近似于：

```powershell
Fatal: Failed to register the Ethereum service: write /var/lib/goethereum/geth/chaindata/383234.ldb: no space left on device
```

为了解决这个问题，假设你有一个大于200GB的固态硬盘，你可以通过下列步骤为 [LVM](https://wiki.ubuntu.com/Lvm) (逻辑卷管理) 扩大容量：

```powershell
$ sudo lvdisplay # <-- Check your logical volume size
$ sudo lvm 
> lvextend -l +100%FREE /dev/ubuntu-vg/ubuntu-lv
> exit
$ sudo resize2fs /dev/ubuntu-vg/ubuntu-lv
$ df -h # <-- Check results
```

这会重新调整你的硬盘至它的最大可用空间。

如果你在这方面需要支持，请在 [EthStaker](https://discord.gg/7z8wzehjrJ) 的Discord上寻求帮助。