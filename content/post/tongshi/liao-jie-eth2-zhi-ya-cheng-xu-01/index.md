---
path: liao-jie-eth2-zhi-ya-cheng-xu
id: 1
title: 了解Eth2质押程序
description:  '如何成为Eth2验证者？了解质押程序很重要！ ' 
date: 2020-06-25T02:15:01.762Z
author: Jim McDonald
---

</br>

来源 | [attestant.io](https://www.attestant.io/posts/understanding-ethereum-staking-deposits/)

</br>

Eth2将使用Proof of Stake（权益证明）来维护网络安全，**但实行PoS需要每个活跃的参与者（“验证者”）拥有一定资产来进行质押**。如果持有资产的是eth1账户，那么这些资产需要转移到eth2的验证者处才能进行质押。

验证者的职责主要是提议区块并证明（attest）其他区块，而质押者（staker）则提供资金进行质押。验证者和质押者的角色可以是相同或不同的实体，最佳实践建议将这两者区分开以最大程度保证资金的安全性。

**将资金从eth1转移到eth2以及定义质押者和验证者的过程称为Staking**，第一步是在eth1上发送质押存款交易（staking deposit transaction）。质押存款交易包含的细节信息有质押者身份、验证者身份等等，并被统称为存款协议（deposit agreement）。本文将详细探析抵押存款，并阐释在eth1上提交ETH给eth2验证者的过程。

</br>

# 创建存款协议

存款协议将对质押者和验证者进行定义，并构成存款程序所需交易的基础。

![img](https://i.ibb.co/ZGvzbK8/1-2.png)

​                                                           <center>  图1：存款协议与其参与者</center>

</br>

# 验证者身份证明

要确保将存款交给了正确的验证者，就需要验证者身份证明。验证者通过将其公钥添加到协议中来证明自己的身份：

![img](https://i.ibb.co/yB9tjzc/2-2.png)

​                                                                    <center>图2：验证者身份证明</center>

**注意，由于是在eth2中对验证者进行身份证明，因此使用的是eth2公钥而非eth1公钥。**

</br>

# 质押金额

其次，存款协议中需要包含质押金额，以确保双方（以及双方网络）就质押金额达成一致。质押者可以将其期望质押的金额添加到协议中：

![img](https://i.ibb.co/nP0j1Gn/3-2.png)

​                                                                    <center>图3：质押金额</center>

</br>

# 提款身份证明

提款身份证明用于提供验证者提出存款的账户。质押者可以通过向协议中添加可操纵的公钥来识别提款账户身份：

1.公钥经由哈希以压缩其大小；

2.哈希字符串的首字节由类型标识符代替（目前标识符为“0”）

![img](https://i.ibb.co/d2Rd6Hr/4-2.png)

​                                                                     <center>图4：提款身份证明</center>

**注意，提款身份证明使用的也是eth2的公钥。因此，其必须直接由质押者提供，而无法像eth1智能合约通常那样从交易签名中恢复。**

**还要注意的是，如果验证者和质押者是同一实体，则应使用不同的密钥进行验证者身份识别和提款身份识别**。如此以来提款密钥可以安全地离线保存，直到质押者做好提款准备。

###  </br>

# 验证者授权

要表明验证者同意遵守协议条款进行验证，则需要验证者授权。**验证者要使用与验证者身份证明相同的密钥对协议条款进行签名来进行授权，并将该签名添加到协议中**：

![img](https://i.ibb.co/T2gxPwX/5-2.png)

​                                                                     <center>图5：验证者授权</center>

</br>

# 提交存款协议

此时，存款协议中包含四条信息：验证者身份证明、质押金额、提款身份证明和验证者授权。如果质押者想继续完成存款，还需要将包含该协议和资金的交易发送给eth1存款合约（deposit contract）：

![img](https://i.ibb.co/0DPhfCT/6-2.png)

​                                                              <center>图6：提交存款协议</center>

此处有两点需要注意：

**1. 质押者没有在存款协议中明确授权，而是在交易广播之前将其签名添加到交易中提供所需授权；**

**2. 交易必须附带存款协议中所涉及的ETH确切金额，任何其他金额都将导致交易被存款合约拒绝。**

接着由以太坊存款合约（deposit contract）接收并处理交易，如果一切正常进行，则存款合约将创建一个存款收据事件，收据包含存款协议中的所有数据，并且表示存款合约已经接收存款协议和所质押的ETH。

### </br> 

# 激活存款协议

与前序步骤不同，**激活合约主要进行在eth2中**。

Eth2会跟踪eth1的更新以获取存款收据。每个eth2节点在其提议的区块中都包含有最新的存款收据。随着这些区块的最终确认，存款就会成为eth2整体状态的一部分。存款收据将作为验证者状态存储在eth2中。

同样，验证者也会跟踪eth2中的更新以获知验证者状态的变化。**当观察到带有公钥的验证者状态条目时，说明该存款已在eth1上完成，且已经得到了eth2的识别，剩下的就是证明工作了。**

![img](https://i.ibb.co/yFMx2Yj/7-2.png)

​                                                                 <center>图7：激活存款协议</center>

</br>

# 全程

结束提交和激活步骤之后，就完成了在eth2中质押eth1资产的全部过程：

![img](https://i.ibb.co/SKN1wnk/8-2.png)

​                                                               <center>图8：质押存款过程</center>

注：尽管在理论过程中没有说明，但随着安全性的提升，Staking的过程会存在许多延迟。譬如在eth2中，在获取到存款收据事件和将该信息添加到验证者状态之间会存在一定的延迟，这样做是为了确保eth1网络中不会发生区块链重组而导致存款无效。

</br>

</br>

声明：ECN的翻译工作旨在为中国以太坊社区传递优质资讯和学习资源，文章版权归原作者所有，转载须注明原文出处以及ethereum.cn，若需长期转载，请联系ethereumcn@gmail.com进行授权。