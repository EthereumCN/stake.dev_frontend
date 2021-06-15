---
path: zhu-wang-02
id: 22
title: 手把手教学：以太坊2.0主网质押Lighthouse篇。
description:  '手把手教学：以太坊2.0主网质押Lighthouse篇。' 
date: 2020-06-25T02:15:01.762Z
author: Carl Beekhuizen  
---



作者 | Somer Esat

来源 | [someresat.medium.com](https://someresat.medium.com/guide-to-staking-on-ethereum-2-0-ubuntu-lighthouse-41de20513b12)



![1](https://i.ibb.co/ynYrB8T/1.png)



本文基于Sigma Prime的Lighthouse客户端，详细讲解如何参与以太坊2.0主网质押。主要基于以下几个技术：

- [Ubuntu](https://ubuntu.com/) v20.04 (LTS) x64 服务器
- [Go Ethereum](https://geth.ethereum.org/) 节点 ([代码分支](https://github.com/ethereum/go-ethereum))
- [Sigma Prime’s](https://sigmaprime.io/) ETH 2.0 客户端 —— Lighthouse（ ([代码分支](https://github.com/sigp/lighthouse))
- 浏览器插件加密钱包 [MetaMask](https://metamask.io/)

提示：参与质押至少需要32 ETH 以及额外的gas费。 在搞清楚之前切记不要向任意地址发送ETH。本教程介绍了如何安全地将你的ETH存入存款合约。请牢记不要将ETH发送给任何人。



# 致谢

本教程参考了网上的各种资料，感谢这些提供资料的贡献者！

感谢[EthStaker](https://discord.gg/7z8wzehjrJ)管理团队和提供教程的社区成员、Eth2 客户端团队、以及质押社区的帮助和校对。

特别感谢Eth2 客户端团队和以太坊基金会的研究员。他们经过几年的不懈努力，将我们带到这难以置信的时刻——Eth2.0成功创世。



# 免责声明

本文仅供参考，不构成专业建议。作为本教程的作者。我本人不保证文中信息的准确性，对于那些参考了本文进行操作而产生的任何损失概不负责。文末有更加完整的免责声明，请阅读之后再进行操作。



# 支持

如需技术支持，请联系：

- EthStaker社区是一个以太坊2.0 Staking 社区，资源丰富且十分友好。

 Reddit：https://www.reddit.com/r/ethstaker/

 Discord：https://discord.gg/7z8wzehjrJ

- Lighthouse 客户端团队，Discord: https://discord.gg/gdq27tnKSM



# 条件

使用本教程需要对以太坊、ETH、Staking、Linux、MetaMask (Portis或Fortmatic) 有一定的背景知识。

还需要准备：

- [Ubuntu 服务器 v20.04 (LTS) amd64](https://ubuntu.com/tutorials/install-ubuntu-server#1-overview) 或者一个较新的，在本地计算机或云端安装和运行的Ubuntu服务器。

运行本地电脑有助于去中心化，因为如果云服务商崩溃了，那么托管在此服务商的所有节点都会随之崩溃。

- 已安装或已配置的浏览器插件加密钱包[MetaMask](https://metamask.zendesk.com/hc/en-us/articles/360015489531-Getting-Started-With-MetaMask-Part-1-) (或Portis、Fortmatic)。一台装有操作系统 (Mac、Windows、Linux等) 和浏览器 (Brave、Safari、FireFox等) 的计算机。



# 从测试网到主网

如果你从测试网设置转到主网设置，那么我强烈建议你在一个全新的 (新安装的) 服务器实例上开始。本教程没有对迁移场景进行测试，所以如果你使用的是此前安装过的测试网软件，那么无法保证你的操作能成功。



# 要求

- 硬件要求是一个比较大的话题。总的来说：一个相对较新的CPU、8GB内存的RAM (16GB更佳)、一个内存至少500GB的SSD (1TB更佳)、稳定的网络（足够快的下载速度以及月度数据额度），这些性能都会让质押过程更加安全顺畅。

**注意：检查你的可用磁盘空间。尽管你有一个容量较大的SSD，Ubuntu也会出现仅剩200GB可用空间的状况。如果你遇到这种情况，请查看附录C —— 扩展逻辑卷。**



# 概览

下面这个简化图表标明了本篇教程所涉及的范围，标黄的即是本文会覆盖到的部分：



![2](https://i.ibb.co/GTy57kG/p2.png)



整个流程可以概念化表述为：

- 生成验证者密钥对和存款数据
- 准备Ubuntu服务器 (防火墙、安全设置等)
- 设置一个Eth1 节点并同步Eth1 区块链的数据
- 配置Lighthouse客户端并同步Eth1 节点数据
- 存款并激活验证者密钥对

那我们现在就开始吧！



# 第1步：生成质押数据

参与质押首先要决定你想要运行的验证者节点的数量，并基于此生成一些数据文件。

> 注意：如果你的存款数据和验证者密钥对已经生成，可以跳过这一步。

一个验证者节点需要存32 ETH，你的MetaMask钱包里要有相应足够的ETH。比如，如果你计划运行5个验证者节点，你将需要准备160 ETH (32*5) 并且预留一些gas费。存款过程会稍后再讲解，下面教大家怎么把设备运行起来。

## 下载存款工具 (存款CLI)

点击[此处](https://github.com/ethereum/eth2.0-deposit-cli/releases/)下载最新发布的存款命令行界面app (CLI app)。

下载链接：https://github.com/ethereum/eth2.0-deposit-cli/releases/



![3](https://i.ibb.co/Hgfx578/p3.png)



在“Assets”那一栏选择与你的设备 (如Windows、Mac、Linux Desktop等) 匹配的版本并下载。

## 运行存款工具 (Eth2 存款CLI)

解压文件，里面应该有一个二进制文件 (可执行文件)。存款工具生成用于质押的文件和一组助记词。这组助记词需要安全地保存。下面有两种选择：

**建议方案**：将这份二进制文件复制粘贴到USB驱动器里。连接到一台此前从未连接过网络的计算机，将文件复制到计算机里并开始运行。

**不建议方案**：在当前使用的计算机上运行。但是网络连接可能会导致你的助记词密钥泄漏。如果没有未联网的计算机，那就在开始运行之前断开网络。

准备好之后，在终端窗口 (或windows的命令提示符CMD) 中运行这份文件以继续使用下面列出的命令。确定好你要运行的验证者节点的数量之后，用该数字替换 `<NumberOfValidators>`。比如： `--num_validators 2`

Linux/Mac:

```Powershell
./deposit new-mnemonic --num_validators <NumberOfValidators> --chain mainnet
```

Windows:

```Powershell
deposit.exe new-mnemonic --num_validators <NumberOfValidators> --chain mainnet
```

在你选择的计算机执行上面的步骤之后，你将被要求创建一个**验证者密钥存储库** (validator keystore) 密码，并保存在一个安全的地方。在后面的步骤中，你将需要这个keystore来上传验证者密钥到Lighthouse的验证者钱包里。



![4](https://i.ibb.co/2gKWKW7/4.png)



随后会生成一组**助记词**，请保存在一个安全的地方，**这至关重要**。因为最终你需要助记词来生成提款密钥以提出质押的ETH，并且增加验证者节点时也需要使用助记词。如果你丢失了助记词，就无法将你的资产提出了。



![5](https://i.ibb.co/LRH1pw4/5.png)



一旦你点击确认已经记好助记词之后，你的验证者密钥对便会生成。



![6](https://i.ibb.co/1GjWJdx/6.png)



新创建的验证者密钥对和存款数据文件会放置在指定位置。文件夹的内容如下所示：



![7](https://i.ibb.co/cQsh0nx/p7.png)



关于这些文件：

· 文件 `deposit_data-[timestamp].json` 包含验证者公钥和质押存款信息。该文件将用于完成随后的ETH存款过程。

· 文件 `keystore-m...json` 包含经过加密的验证者签名密钥。每一个验证者节点对应一个“keystore-m”。该文件将被导入到Lighthouse验证者钱包中以备质押时使用。随后需要将这些文件复制粘贴到Ubuntu服务器中。

## 最后的步骤

现在你已经有了存款数据和密钥存储库文件，接下来就可以设置Ubuntu服务器了。

**注意：此时还不能进行存款。**

首先完成并验证你的质押设置非常重要。如果你的ETH存款激活了，但是质押设置还没准备好的话，你将会受到怠工惩罚。



# 第2步：连接至服务器

使用一个SSH端口，连接至你的Ubuntu服务器。如果你用`root`登录，最好是重新创建一个拥有管理权限的用户账户，因为使用root用户登录存在很大的风险。

> 注意：如果你不是用`root`登录的便可以直接跳到第三步。

创建一个新账户。在 `<yourusername>` 中填入你的用户名，然后设置一个安全系数较高的密码，并输入其他可选信息。

```Powershell
# adduser <yourusername>
```

通过把新的用户加入`sudo`群组中，来授予其管理权限。这样用户在命令行前输入`sudo`，便会以超级用户的权限来执行操作。

```Powershell
# usermod -aG sudo <yourusername>
```

可选项：如果你使用SSH密钥通过`root`用户连接你的Ubuntu系统，你需要将新创建的账户和root用户的SSH密钥数据组合起来。

```Powershell
# rsync --archive --chown=<yourusername>:<yourusername> ~/.ssh /home/<yourusername>
```

最后，退出登录你的`root`账户，然后使用你新创建的用户名`<yourusername>`登入Ubuntu服务器。



# 第3步：升级服务器

确保系统更新至最新的软件和安全设置。

```Powershell
$ sudo apt update && sudo apt upgrade
$ sudo apt dist-upgrade && sudo apt autoremove
$ sudo reboot
```



# 第4步：保护服务器

安全性十分重要。但由于本文不是针对安全性的指南，所有只列出了一些基础的设置。

## 修改SSH默认端口

SSH默认端口是端口22，也是易受攻击的矢量，因此可以修改SSH端口来防止攻击。

在1024 — 49151之间选择一个端口号，然后运行以下命令以检索尚未使用的端口号。没有其他显示便意味着该端口号未被使用；显示红色便意味着已被使用，请尝试其他端口号。比如：`sudo ss -tulpn | grep ':6673'`

```Powershell
$ sudo ss -tulpn | grep ':<YourSSHPortNumber>'
```

确定端口号可用之后，通过升级SSH设置来修改默认端口。

```Powershell
$ sudo nano /etc/ssh/sshd_config
```

在文件中检索或者添加 (如果没有的话) `Port 22` 命令行。删掉`#` (如果有的话) 并在下面的命令行中输入端口号。

```Powershell
Port <YourSSHPortNumber>
```

参考下方的截图。按CTRL+x 然后选 ‘y’ ，按回车保存并退出。



![8](https://i.ibb.co/pzy7wfL/p8.png)



重新启动 SSH 服务以显示上述所作的修改。

```Powershell
$ sudo systemctl restart ssh
```

登出并使用你的SSH端口号`<YourSSHPortNumber>`重新登入。

## 配置防火墙

Ubuntu 20.04 服务器可以使用默认的 UFW 防火墙来限制访问该服务器的流量，不过要先设置其允许来自 SSH、Go Ethereum、Lighthouse 的入站流量。

**安装 UFW 防火墙**

按照下面的命令行输入以保证在默认情况下安装 UFW。

```Powershell
$ sudo apt install ufw
```

**应用 UFW 默认值**

明确地应用默认值，拒绝入站流量，允许出站流量。

```Powershell
$ sudo ufw default deny incoming
$ sudo ufw default allow outgoing
```

**允许 SSH**

允许你此前设置的端口号 `<YourSSHPortNumber>` 的入站流量。SSH 要求 TCP 协议。比如：`sudo ufw allow 6673/tcp`

```Powershell
$ sudo ufw allow <yourSSHportnumber>/tcp
```

**拒绝 SSH 端口号22** 拒绝端口 22/TCP 的入站流量。

> 注意：当你完成了修改 SSH 默认端口之后再做这一步。

```Powershell
$ sudo ufw deny 22/tcp
```

**允许 Go Ethereum**

允许与 Go Ethereum 的对等节点 (端口 30303) 进行点对点 (P2P) 连接。如果你使用第三方托管的 Eth1 节点，则可以跳过这一步。

> 注意：如果你在本地托管你的Ubuntu服务器，你需要配置你的网络路由以允许来自端口 30303 的入站流量。

```Powershell
$ sudo ufw allow 30303
```

**允许 Lighthouse 客户端**

允许与 Lighthouse 的对等节点进行点对点连接，以便在信标链节点上 (Lighthouse 的默认端口为 9000) 进行操作。

> 注意：如果你在本地托管你的Ubuntu服务器，你需要配置你的网络路由以允许来自端口9000 的入站流量。

```Powershell
$ sudo ufw allow 9000
```

开启防火墙并检查是否已按上述步骤正确地配置。

```Powershell
$ sudo ufw enable
$ sudo ufw status numbered
```

参考下方的截图。



![9](https://i.ibb.co/bPqGH2J/p9.png)





# 第5步：配置定时器

Ubuntu 内置了时间同步，并默认使用 systemd‘s timesyncd 服务进行激活。验证其是否正确运行。

```Powershell
$ timedatectl
```

激活 `NTP service` ，运行方式：

```Powershell
$ sudo timedatectl set-ntp on
```

参考下方的截图：



![10](https://i.ibb.co/ftXCM1Q/p10.png)



只能使用单个定时器服务。如果你此前安装过 NTPD，你需要检查此文件是否还存在，如果存在请操作下面的命令行以删除。

```Powershell
$ ntpq -p
$ sudo apt-get remove ntp
```



# 第6步：设置一个 Eth1 节点

参与质押需要一个 Eth1 节点。你可以选择运行一个本地 Eth1 节点，也可以使用第三方提供的节点。本教程会详细讲解如何运行 Go Ethereum，如果你选择第三方服务的话，可以跳过这一步。

> 注意：检查你的可用磁盘空间。一个Eth1节点需要大概400GB的存储空间。尽管你有一个容量较大的固态硬盘，Ubuntu也可能显示仅剩200GB的可用空间。如果你遇到这种情况，请查看附录C —— 扩展逻辑卷。

## 安装 Go Ethereum

使用PPA (Personal Package Archives，个人安装包存档) 安装Go Ethereum客户端。

```Powershell
$ sudo add-apt-repository -y ppa:ethereum/ethereum
$ sudo apt update
$ sudo apt install geth
```

将Go Ethereum作为后台服务来运行，运行该服务需要创建一个账户。此种类型的账户无法登录服务器。

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

创建一个systemd服务配置文件来对该服务进行配置。

```Powershell
$ sudo nano /etc/systemd/system/geth.service
```

将下列的服务配置复制粘贴到文档中。

```Powershell
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

需要注意的 [flags](https://geth.ethereum.org/docs/interface/command-line-options)：

`--http` 用来公开与Lighthouse信标链节点连接的一个HTTP端口 ([http://localhost:8545](http://localhost:8545/))。

`--cache` 指的是内部缓存的大小，以GB为单位。数值的增减取决于你的可用系统内存。设置 `2048` 将大概需要使用 4-5 GB的内存。

`--maxpeers` 指的是所连接节点的最大数值。节点数量越多，意味着越多的网络数据可用空间。所以记得不要将该数值设置得太低，否则你的Eth1节点将难以保持同步。

参考下方的截图。按CTRL+x 然后选 ‘y’ ，按回车保存并退出。



![11](https://i.ibb.co/JBmb1PL/p11.png)



重新加载 systemd 以显示上述的更改并启动服务。检查状态以确保其正确运行。

```Powershell
$ sudo systemctl daemon-reload
$ sudo systemctl start geth
$ sudo systemctl status geth
```

参考下方的截图：



![12](https://i.ibb.co/vxr3pNh/p12.png)



如果你每一步都做对了，它会用绿色字体显示”active (running)"。如果没有显示，你需要倒回去重复上述步骤，修复问题。按Q退出 (此操作不会影响geth服务)。

允许geth服务在系统重启时自动启动。

```Powershell
$ sudo systemctl enable geth
```

Go Ethereum节点将会开始同步。你可以运行下列命令来追踪进程或检查错误。按“CTRL+c”退出 (此操作不会影响geth服务)。

```Powershell
$ sudo journalctl -fu geth.service
```

参考下方的截图：



![13](https://i.ibb.co/qDvJ767/p13.png)



## 查看同步状态

要检查Eth1节点同步状态，请使用下列命令访问控制台。

```Powershell
geth attach http://127.0.0.1:8545
> eth.syncing
```

如果显示结果是 `false` ，表明你的同步已完成。如果显示结果是同步数据，表明你仍在同步。作为参考，大概有7-8亿个已知状态 `knownStates`.

参考下方的截图:



![14](https://i.ibb.co/MZjyqnH/p14.png)



完成时按“CTRL+d”以退出。

## 检查连接的对等节点

要检查你的Eth1节点所连接的对等节点，请使用下列命令访问控制台。

```Powershell
geth attach http://127.0.0.1:8545
> net.peerCount
```

对等节点总数 `peerCount` 不会超过你所设置的最大对等节点总数 `--maxpeers` 。如果无法找到需要同步的对等节点，参阅下一部分。

完成后按“CTRL+d”以退出。

## 添加 bootnodes (可选)

有时可能要花点时间才能找到要同步的对等节点，可以添加bootnodes以改善这种情况。访问https://gist.github.com/rfikki/a2ccdc1a31ff24884106da7b9e6a7453 获得最新的清单并根据下列操作修改geth服务：

```Powershell
$ sudo systemctl stop geth
$ sudo nano /etc/systemd/system/geth.service
```

修改 `ExecStart` 行，添加 `--bootnodes` flag：在下方罗列出最新的对等节点，并以逗号分割。

```Powershell
ExecStart=geth --http --datadir /var/lib/goethereum --cache 2048 --maxpeers 30 --bootnodes "enode://d0b4a09d072b3f021e233fe55d43dc404a77eeaed32da9860cc72a5523c90d31ef9fab7f3da87967bc52c1118ca3241c0eced50290a87e0a91a271b5fac8d0a6@157.230.142.236:30303,enode://5070366042daaf15752fea340e7ffce3fd8fc576ac846034bd551c3eebac76db122a73fe8418804c5070a5e6d690fae133d9953f85d7aa00375d9a4a06741dbc@116.202.231.71:30303"
```

保存文件之后退出。然后重启服务并观察。

```Powershell
$ sudo systemctl daemon-reload
$ sudo systemctl start geth
$ sudo journalctl -fu geth.service
```

> 注意：需要按照一系列特定的步骤来更新Geth。更多信息请参见“附录A：更新Geth”。



# 第7步：下载Lighthouse

Lighthouse客户端由两份二进制文件组成：信标链节点和验证者客户端。本步骤将讲解如何下载Lighthouse二进制文件。

首先，访问https://github.com/sigp/lighthouse/releases并找到最新发布的Lighthouse版本。通常在页面的最顶部，比如：



![15](https://i.ibb.co/mtCf7jd/15.png)



在“Assets”那一栏（如果需要的话点击展开) 将下载链接复制粘贴至文档**lighthouse-v…-x86_64-unknown-linux-gnu.tar.gz**中。请确保复制的链接是正确的。

> 注意：那里有两种类型的二进制文件 (可移植/不可移植)，他们的区别[这里](https://lighthouse-book.sigmaprime.io/installation-binaries.html)有解释。可移植二进制文件可以在更广泛的硬件中运行，但是需要花费20%的性能成本。



![16](https://i.ibb.co/JmjS4Ss/16.png)



操作下列命令来下载这些文件。将下方指令部分的URL改为最新版本的下载链接。

```Powershell
$ cd ~
$ sudo apt install curl
$ curl -LO https://github.com/sigp/lighthouse/releases/download/v1.0.2/lighthouse-v1.0.2-x86_64-unknown-linux-gnu.tar.gz
```

从归档文件中提取二进制文件并复制到 `/usr/local/bin` 目录，Lighthouse客户端会在该处运行这些文件。根据需求修改文档名。

```Powershell
$ tar xvf lighthouse-v1.0.2-x86_64-unknown-linux-gnu.tar.gz
$ sudo cp lighthouse /usr/local/bin
```

输入下列命令以确认这些二进制文件是否能在你的服务器CPU上运行，如果不可以，返回并下载可移植版本，重新操作。

```Powershell
$ cd /usr/local/bin/
$ ./lighthouse --version # <-- should display version information
```

> 注意：有时会遇到这样的情况——版本信息已显示，但后续命令仍操作失败。如果你在运行`account validator import` 命令时遇到错误 `Illegal instruction (core dumped)` ，那么你需要换成可移植版本。

清理所提取的文档。

```Powershell
$ cd ~
$ sudo rm lighthouse
$ sudo rm lighthouse-v1.0.2-x86_64-unknown-linux-gnu.tar.gz
```

> 注意：需要按照一系列特定的步骤来更新Lighthouse。更多信息请参见“附录B：更新Lighthouse”。



# 第8步：导入验证者密钥对

导入验证者密钥对以配置Lighthouse，然后创建运行其所需要的服务以及服务配置。

## 复制验证者密钥存储文件

如果你的验证者存储文件 `keystore-m…json` 不是在你的Ubuntu服务器上生成的，那么你就需要将这些文件复制粘贴到你的本地目录中。你可以用 USB 把文件拷过去 (如果你的服务器是本地的)，也可以使用安全的FTP (SFTP)。

将文件放置在： `$HOME/eth2deposit-cli/validator_keys`。如果需要的话创建文件目录。

## 将密钥存储文件导入验证者客户端

创建一个目录以存储验证者钱包数据，并授予当前用户访问该目录的权限。当前用户需要访问权限来执行导入。在 `<yourusername>` 修改登入用户名。

```Powershell
$ sudo mkdir -p /var/lib/lighthouse
$ sudo chown -R <yourusername>:<yourusername> /var/lib/lighthouse
```

运行验证者密钥导入进程。你需要提供放置已生成的密钥存储文件的路径。比如： `$HOME/eth2deposit-cli/validator_keys`

```Powershell
$ cd /usr/local/bin
$ lighthouse --network mainnet account validator import --directory $HOME/eth2deposit-cli/validator_keys --datadir /var/lib/lighthouse
```

你将需要输入密码以访问验证者密钥对，该密码你在第一步设置过。

访问每一个密钥都需要输入密码，逐个输入。确保密码输入正确，因为验证器将作为服务运行时需要将密码保存到文件中以访问密钥。

> 注意验证者数据被保存在下列路径`/var/lib/lighthouse/validators`，该路径在密钥存储文件导入进程中创建。

参考下方截图。



![17](https://i.ibb.co/1KtLhTx/17.png)



将默认权限恢复到 `lighthouse` 目录。

```Powershell
sudo chown -R root:root /var/lib/lighthouse
```

导入完成，钱包已设置好。



# 第9步：配置信标节点服务

在这一步，你要把Lighthouse的信标节点作为服务来配置并运行，因此如果系统重启，这个过程将自动重新开始。

## 设置信标节点账户和目录

为信标节点的运行创建一个账户。这种账户不能用来登录进入服务器。

```Powershell
$ sudo useradd --no-create-home --shell /bin/false lighthousebeacon
```

为Lighthouse信标节点的数据库创建数据目录和设置权限。

```Powershell
$ sudo mkdir -p /var/lib/lighthouse/beacon
$ sudo chown -R lighthousebeacon:lighthousebeacon /var/lib/lighthouse/beacon
$ sudo chmod 700 /var/lib/lighthouse/beacon
$ ls -dl /var/lib/lighthouse/beacon
```

参考下方的截图



![18](https://i.ibb.co/SfZKZLw/18.png)



## 创建和配置服务

Create a systemd service config file to configure the service.

创建一个systemd服务的config文档来配置服务

```Powershell
$ sudo nano /etc/systemd/system/lighthousebeacon.service
```

将下面这段代码复制粘贴到文档里

```Powershell
[Unit]
Description=Lighthouse Eth2 Client Beacon Node
Wants=network-online.target
After=network-online.target[Service]
User=lighthousebeacon
Group=lighthousebeacon
Type=simple
Restart=always
RestartSec=5
ExecStart=/usr/local/bin/lighthouse bn --network mainnet --datadir /var/lib/lighthouse --staking --eth1-endpoints http://127.0.0.1:8545[Install]
WantedBy=multi-user.target
```

需要注意的 [flags](https://lighthouse-book.sigmaprime.io/api-bn.html).

`bn`子命令指示Lighthouse二进制文件运行信标节点。

`--eth1-endpoints` 一个或多个逗号分隔的服务器终端，用于Web3连接。如果给定多个端点，则按照给定的顺序将端点作为回退。 同时启动 `-- eth1` flag. E.g. `--eth1-endpoints http://127.0.0.1:8545,https://yourinfuranode,https://your3rdpartynode`.

参考下方的截图。按 CTRL+x然后'y'，按回车保存然后退出。



![19](https://i.ibb.co/0ym0xp1/19.png)



重新加载systemd以显示更改，并启动服务。

```Powershell
$ sudo systemctl daemon-reload
```

> 注意：如果你正在运行一个本地Eth1节点 （查看第6步），你应该等它完全同步完再启动lighthousebeacon的服务。

启动服务并查看，确保其正确运行。

```Powershell
$ sudo systemctl start lighthousebeacon
$ sudo systemctl status lighthousebeacon
```

参考下方的截图:



![20](https://i.ibb.co/cNd4CQS/20.png)



如果你每一步都做对了，它会用绿色字体显示”active (running)"。如果没有显示，你需要倒回去重复上述步骤，修复问题。按Q退出 (不会影响 lighthousebeacon的服务)。

允许服务随系统重启而自动重启。

```Powershell
$ sudo systemctl enable lighthousebeacon
```

如果Eth2 链处于创世后的状态，Lighthouse信标链会开始同步数据。它可能要花几个小时才能完全实现同步。你可以通过运行`journalctl` 命令来追踪进程或检查错误。按CTRL+c退出 (将不会影响lighthousebeacon的服务)

```Powershell
$ sudo journalctl -fu lighthousebeacon.service
```

日志的截位视图会显示以下状态信息。

[注意: 目前出现了一个[问题](https://github.com/sigp/lighthouse/issues/1965)导致出现错误信息]

```Powershell
INFO Waiting for genesis                     
wait_time: 5 days 5 hrs, peers: 50, service: slot_notifier
```

当Eth2主网启动，信标链和验证者将自动开始处理数据。输出数据会给出与Eth1节点完全同步的指示。



# 第10步：配置验证者服务

在这一步，你需要将你的验证者客户端作为一项后台服务来配置和运行，因此系统重启时这个进程会自动重启。

## 创建验证者节点的账户和目录

为验证者客户端的运行创建一个账户。这类账户无法登录服务器。

```Powershell
$ sudo useradd --no-create-home --shell /bin/false lighthousevalidator
```

在第8步创建验证者钱包时已经创建了这个目录：`/var/lib/lighthouse/validators`。现在设置权限，使得只有`lighthousevalidator` 可以修改这个目录。

```Powershell
$ sudo chown -R lighthousevalidator:lighthousevalidator /var/lib/lighthouse/validators
$ sudo chmod 700 /var/lib/lighthouse/validators
$ ls -dl /var/lib/lighthouse/validators
```

参考下方的截图



![21](https://i.ibb.co/S38L03j/21.png)



## 创建并配置服务

创建一个systemd服务文件来存储配置服务

```Powershell
$ sudo nano /etc/systemd/system/lighthousevalidator.service
```

将下面这段代码复制粘贴到文档里

```Powershell
[Unit]
Description=Lighthouse Eth2 Client Validator Node
Wants=network-online.target
After=network-online.target[Service]
User=lighthousevalidator
Group=lighthousevalidator
Type=simple
Restart=always
RestartSec=5
ExecStart=/usr/local/bin/lighthouse vc --network mainnet --datadir /var/lib/lighthouse --graffiti "<yourgraffiti>"[Install]
WantedBy=multi-user.target
```

需要注意的 [flags](https://lighthouse-book.sigmaprime.io/validator-management.html).

`vc` 子命令指示Lighthouse二进制文件运行信标节点。

`--graffiti "<yourgraffiti>"` 填上你的涂鸦字串符。出于安全和隐私，应避免使用能唯一辨识你的信息。比如`--graffiti "Hello Eth2! From Dominator"`。

参考下方的截图。按CTRL+x 然后选 ‘y’ ，按回车保存并退出。



![22](https://i.ibb.co/cw7Kwfq/22.png)



重新加载systemd以显示更改,开启服务并检查，确保运行正确。

```Powershell
$ sudo systemctl daemon-reload
$ sudo systemctl start lighthousevalidator
$ sudo systemctl status lighthousevalidator
```

参考下方的截图:



![23](https://i.ibb.co/ynfrCsd/23.png)



如果你每一步都做对了，它会用绿色字体显示”active (running)"。如果没有显示，你需要倒回去重复上述步骤，修复问题。按Q退出 (不会影响 lighthousevalidator的服务)。

允许服务随系统重启而自动重启。

```Powershell
$ sudo systemctl enable lighthousevalidator
```

你可以通过运行`journalctl`命令来追踪进程或检查错误。按CTRL+c退出(将不会影响lighthousevalidator的服务)

```Powershell
$ sudo journalctl -fu lighthousevalidator.service
```

日志的截位视图会显示以下状态信息。

```Powershell
INFO Lighthouse started version: Lighthouse/v1.0.2-c6baa0e
INFO Configured for testnet name: mainnet
WARN The mainnet specification is being used. This not recommended (yet).
INFO Starting validator client validator_dir: "/var/lib/lighthouse/validators", beacon_node: http://localhost:5052/
INFO Completed validator discovery new_validators: 0
INFO Enabled validator voting_pubkey: 0xaa...
INFO Enabled validator voting_pubkey: 0x90...
INFO Initialized validators enabled: 2, disabled: 0
INFO Connected to beacon node version: Lighthouse/v1.0.2-c6baa0e/x86_64-linux
INFO Starting node prior to genesis seconds_to_wait: 444946
INFO Waiting for genesis seconds_to_wait: 444946, bn_staking_enabled: true
```

创世后 (即信标链已经开始处理数据后)存入的存款可能需要等几个小时到几天的时间才能激活。

Eth2主网启动后，信标链和验证者将会自动开始处理数据。

你可以在 [beaconcha.in](https://beaconcha.in/)查看你的验证者状态。只需要搜索你的验证者公钥或使用你的MetaMask （或其他）钱包地址进行搜索。你的数据可能要过一段时间才会在网站上显示。



# 第11步：进行验证者存款

现在你的节点已经设置好并开始运行，你将需要将ETH存入你的验证者节点。

> 注意：如果你已经提交了你的质押存款，你可以跳过这一步

这一步是关于将所需的ETH存入Eth2.0的存款合约。不要把ETH发送到存款合约。这需要在浏览器上通过Eth2.0的Launchpad网站启动你的MetaMask (或其他) 钱包。

> 注意：如果是在创世后进行的话，你需要在你的Eth1节点和信标链都完全同步完之前存入你的存款。如果你不这样做，当你的Eth1节点或信标链在同步时，Lighthouse会处于怠工状态，而你可能要遭遇怠工惩罚。

以太坊2.0 Launchpad: https://launchpad.ethereum.org/

. 一直随着屏幕切换点击这些警告步骤，直到你到达**密钥对生成**的部分。选择你打算运行的验证者数量。选择一个与你在步骤1中生成的验证者文件数量相匹配的值。



![24](https://i.ibb.co/CwKwHzQ/p27.png)



往下滚动，看这些内容你是否同意，然后点击“Continue” (继续)。



![25](https://i.ibb.co/LdJsJwY/p28.png)



你会被要求上传`deposit_data-[timestamp].json`文档。这个文档你是在步骤1生成的。浏览/选择或拖拉这个文档，然后点击Continue。



![26](https://i.ibb.co/PTkh7gD/p29.png)



连接你的钱包。选择MetaMask (或者是其他支持的钱包)，登录，选择存有你的ETH的钱包，然后点击Continue。

你的MetaMask余额就会显示出来。如果你选择了主网且你有充足的ETH余额，网站会允许你继续下一步。



![27](https://i.ibb.co/tqrFPLV/p30.png)



然后会出现一个Summary (总结)，显示验证者数和所需的ETH数量。如果你同意的话就给那些方框打勾，然后点击Continue。



![28](https://i.ibb.co/jktcfzz/p31.png)



如果你准备好去存款了，点击"Initiate All Transactions" (启动所有交易）。



![29](https://i.ibb.co/NFbJXL5/p32.png)



当你到了可以确认每笔交易那一步时，MetaMask (或其他钱包)的窗口会自动弹出。

当所有的交易都成功完成时，你的质押也完成了！



![30](https://i.ibb.co/kq7Cn7v/p33.png)



恭喜你已经成功存入你的质押存款了！

## 查看你的验证者存款状态

新加入的验证者需要等一下 (几个小时到几天不等)才能激活。你可以以下几步来查看你的密钥状态：

1. 复制你的MetaMask (或其他）钱包地址。
2. 前往这里: [beaconcha.in/](https://beaconcha.in/)
3. 用你的钱包地址搜索你的密钥



![31](https://i.ibb.co/JQYHLPH/p34.png)



点进某个验证者详情，每个验证者激活后你会看到在Status那一栏有预估时间。



![32](https://i.ibb.co/nbPs42c/p35.png)



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
- J 加入 [Ethstaker](https://discord.gg/7z8wzehjrJ)和 [Lighthouse](https://discord.com/invite/gdq27tnKSM)的Discord，留意重要通知。
- 请在[Discord](https://discord.gg/7z8wzehjrJ)、 [Twitter](https://www.twitter.com/SomerEsat)、或[Reddit](https://www.reddit.com/user/SomerEsat)分享对这份教程的反馈。
- 在 [Ethstaker](https://discord.gg/7z8wzehjrJ) 的discord上帮助其他人设置。
- 用[friend link](https://someresat.medium.com/41de20513b12?source=friends_link&sk=ac7477fd99b6648a5745a3e327f2701c)分享这份教程
- 支持一下：somer.eth



# 延伸阅读

强烈建议大家从尽可能多的来源获取信息，还有很多其他资源可以帮助你熟悉如何在Eth2上质押。

如果作者对这些资源还没测试或验证过，而你采用了的话，是要自己承担风险的。

- 客户端团队的官方文档 [Prysm](https://docs.prylabs.network/docs/getting-started) | [Lighthouse](https://lighthouse-book.sigmaprime.io/) | [Teku](https://docs.teku.consensys.net/en/latest/) | [Nimbus](https://status-im.github.io/nimbus-eth2/intro.html)
- [/r/EthStaker Sticky](https://www.reddit.com/r/ethstaker/comments/jjdxvw/welcome_to_rethstaker_the_home_for_ethereum/)
- [以太坊2.0客户端的非官方docker环境](https://github.com/eth2-educators/eth2-docker)
- [如何在Ubuntu上设置Eth2主网验证者系统](https://github.com/metanull-operator/eth2-ubuntu)
- [指南 | 如何在ETH2主网设置验证者](https://www.coincashew.com/coins/overview-eth/guide-or-how-to-setup-a-validator-on-eth2-mainnet)
- [指南 | ETH2验证者信标链节点的安全最佳实践](https://www.coincashew.com/coins/overview-eth/guide-or-security-best-practices-for-a-eth2-validator-beaconchain-node)
- [ETH2质押节点的额外监察](https://moody-salem.medium.com/additional-monitoring-for-eth2-staking-nodes-aea05b2f9a86)
- [以太坊2.0质押的Telegram服务](https://9elements.com/blog/ethereum-2-0-2/)



# 附录A — Geth更新

如果你需要更新到Geth的最新版本，请按下列步骤：

```Powershell
$ sudo systemctl stop lighthousevalidator
$ sudo systemctl stop lighthousebeacon$ sudo systemctl stop geth
$ sudo apt update && sudo apt upgrade
$ sudo systemctl start geth
$ sudo systemctl status geth # <-- Check for errors
$ sudo journalctl -fu geth # <-- Monitor$ sudo systemctl start lighthousebeacon
$ sudo systemctl status lighthousebeacon # <-- Check for errors
$ sudo journalctl -fu lighthousebeacon # <-- Monitor$ sudo systemctl start lighthousevalidator
$ sudo systemctl status lighthousevalidator # <-- Check for errors
$ sudo journalctl -fu lighthousevalidator # <-- Monitor
```

# 



# 附录B — 更新Lighthouse

如果你需要更新到Lighthouse的最新版本，请按下列步骤进行：

首先，前往[这里](https://github.com/sigp/lighthouse/releases)找出最新的Linux发布。

> 注意：会有两种类型的二进制文件——可移植的不可移植的。[这里](https://lighthouse-book.sigmaprime.io/installation-binaries.html)解释了两者的区别。确认你选的是正确的类型。

```Powershell
$ cd ~
$ sudo apt install curl
$ curl -LO https://github.com/sigp/lighthouse/releases/download/v1.0.2/lighthouse-v1.0.2-x86_64-unknown-linux-gnu.tar.gz
```

停止Lighthouse客户端服务。

```Powershell
$ sudo systemctl stop lighthousevalidator
$ sudo systemctl stop lighthousebeacon
```

从存档里提出二进制文档，并复制 `/usr/local/bin`到目录。如果需要的话，修改URL名。

```Powershell
$ tar xvf lighthouse-v1.0.2-x86_64-unknown-linux-gnu.tar.gz
$ sudo cp lighthouse /usr/local/bin
```

重新启动服务并检查错误。

```Powershell
$ sudo systemctl start lighthousebeacon
$ sudo systemctl status lighthousebeacon # <-- Check for errors
$ sudo journalctl -fu lighthousebeacon # <-- Monitor$ sudo systemctl start lighthousevalidator
$ sudo systemctl status lighthousevalidator # <-- Check for errors
$ sudo journalctl -fu lighthousevalidator # <-- Monitor
```

清理提出的文档。

```Powershell
$ cd ~
$ sudo rm lighthouse
$ sudo rm lighthouse-v1.0.2-x86_64-unknown-linux-gnu.tar.gz
```



# 附录 C — 扩展逻辑卷

很多时候Ubuntu只预配200GB的较大固态硬盘，导致用户在同步他们的Eth1节点时就耗尽存储空间了。报错信息近似于：

```Powershell
Fatal: Failed to register the Ethereum service: write /var/lib/goethereum/geth/chaindata/383234.ldb: no space left on device
```

为了解决这个问题，假设你有一个大于200GB的固态硬盘，你可以通过下列步骤为 [LVM](https://wiki.ubuntu.com/Lvm) (逻辑卷管理) 扩大容量：

```Powershell
$ sudo lvdisplay # <-- Check your logical volume size
$ sudo lvm 
> lvextend -l +100%FREE /dev/ubuntu-vg/ubuntu-lv
> lvextend -l +100%FREE -r /dev/ubuntu-vg/ubuntu-lv
> exit
$ sudo resize2fs /dev/ubuntu-vg/ubuntu-lv
$ df -h # <-- Check results
```

这会重新调整你的硬盘至它的最大可用空间。

如果你在这方面需要支持，请在 [EthStaker](https://discord.gg/7z8wzehjrJ) 的Discord上寻求帮助。