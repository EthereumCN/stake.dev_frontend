---
path: jie-du-yi-tai-fang-2-mi-shi
id: 3
title: 解读以太坊2.0密钥
description:  '了解ETH2.0密钥的运作机制，以及与ETH1.0的区别。' 
date: 2020-06-25T02:15:01.762Z
author: beaconcha.in
---

</br>

来源 | [beaconcha.in](https://kb.beaconcha.in/ethereum-2-keys)

# </br>



# 以太坊2.0密钥概述

![img](https://i.ibb.co/9qLhj3P/p1-938fe8e0e5.png)

#  </br>

# 总述

以太坊1.0和2.0的密钥是基于相同的思路并使用[椭圆曲线密码学](https://en.wikipedia.org/wiki/Elliptic-curve_cryptography)创造出来的。但是，以太坊2.0的功能性有所增强，在创造密钥时需要不同的参数，并使用[BLS (Boneh-Lynn-Shacham)](https://en.wikipedia.org/wiki/Boneh–Lynn–Shacham) 签名方案。

#  </br>

# 以太坊2.0密钥有哪些？

在以太坊1.0，用户访问他们的资金只需要**一个私钥**，而在以太坊2.0中则需要两个不同的密钥——**验证者私钥**和**提款私钥**。

## </br>

## 验证者密钥

如下图所示，验证者密钥由两个元素组成：

- 验证者**私钥**
- 验证者**公钥**

由于**验证者私钥**需要**随时**对ETH2进行链上签名，比如区块提议和证明。因此这些密钥必须保存在热钱包里。

这种灵活性使得验证者签名密钥可以快速地在设备间进行迁移。但是，如果密钥丢失了或被盗了，盗窃者可以**通过以下两种方式作恶**：

- 通过以下的做法使验证者被罚没：
  - 作为[区块提议者](https://news.ethereum.cn/ethereum-2-keys/#block-proposer)时，对同一个时隙(slot) 的两个不同信标区块进行签名投票
  - 作为[区块证明人](https://news.ethereum.cn/ethereum-2-keys/#attestations)时，对另外一个区块进行环绕证明投票
  - 作为[区块证明人](https://news.ethereum.cn/ethereum-2-keys/#attestations)时，对同一个目标检查点进行两次不同的证明投票
- 强行[主动退出](https://news.ethereum.cn/ethereum-2-keys/#validator-lifecycle)，阻止验证者质押，并给提款密钥所有者提供ETH余额的访问权限。

**验证者公钥**包含在**存款数据**里，作用是使得ETH2能够识别验证者身份。

![img](https://i.ibb.co/g7XyhJT/p2-416ecf39d8.png)

## </br>

## 提款密钥

如果在[阶段1和阶段2](https://notes.ethereum.org/@serenity/handbook)能够实现ETH转移的话，那么转移验证者的余额则需要用到提款密钥。如同验证者密钥，提款密钥也由两部分组成：

- 提款私钥
- 提款公钥

丢失了这个密钥意味着无法访问验证者余额。但是，验证者仍然可以对证明投票和区块进行签名，因为这些操作只需要验证者的私钥，只是如果密钥丢失了的话验证者这样做基本没法取得奖励。

要提款的话，验证者状态必须是[“已退出”](https://news.ethereum.cn/ethereum-2-keys/#validator-lifecycle)。

![img](https://i.ibb.co/Ns4zTzj/p3-38c89175a1.png)

# 

#  </br>

# 单个ETH1钱包中有多笔存款（即有多个验证者）的情况

每个验证者都有他们自己**唯一的存款数据**，而[信标链](https://news.ethereum.cn/ethereum-2-keys/#beaconchain)通过存款数据来识别验证者。一**个验证者有四个密钥。**

问：我要如何重新将存款存进验证者余额里？（例如[有效余额](https://news.ethereum.cn/ethereum-2-keys/#current-balance-and-effective-balance)已被清空）

答：发送另一笔大于等于1 ETH的交易到存款合约，以验证者的特定存款数据作为交易输入。在第一笔存款交易后，这个唯一的存款数据会储存在区块链上，并可以在多个浏览器上查询到。

注：存款合约要花费大概**360,000 gas**，但鉴于退款操作需要一定成本，建议将交易费定在**400,000到500,000 gas之间**。

![img](https://i.ibb.co/SvdQSBS/p4-89ac86dc47.png)

</br>

# ETH2.0验证者的助记词

在过去的几年里，我们已习惯于[12到24个单词的助记词系统](https://en.bitcoin.it/wiki/Seed_phrase)。我们为什么要倒退回本地保存密钥呢？这方式显然更复杂、更不安全。

在BLS密码库的审计完成之前，目前已知的硬件钱包将不支持ETH2.0密钥的产生。[EIP-2333](https://eips.ethereum.org/EIPS/eip-2333)和[EIP-2334](https://eips.ethereum.org/EIPS/eip-2334)提供了解决方案，但仍有待实现。基于这些认知，我们可以预见在阶段0启动的时候，**助\****记****词**系统是不可用的。

## </br>

## 它是怎么运作的？

[助记词](https://en.bitcoinwiki.org/wiki/Mnemonic_phrase)和路径都是为大家所熟知的功能了，[用户在访问他们的硬件钱包时](https://ethereum.stackexchange.com/questions/19055/what-is-the-difference-between-m-44-60-0-0-and-m-44-60-0)也经常会碰到。

## </br>

## “旧的ETH1.0”的路径结构和示例

m/44’/60’/0’/0

[m / purpose’ / coin_type’ / account’ / change / address_index](https://ethereum.stackexchange.com/questions/19055/what-is-the-difference-between-m-44-60-0-0-and-m-44-60-0)

![img](https://i.ibb.co/SvdQSBS/p4-89ac86dc47.png)

同样的逻辑也适用于ETH2.0密钥，只是有一些**不同的参数**。会有一个**“父密钥”**（助记词）使得用户可以将尽可能多的验证者连结到一个**提款密钥**里。如此一来，用户可以通过助记词**导出所有的密钥**。下图对此做出了简要概述：

![img](https://i.ibb.co/ygy94TY/p5-574509f05e.png)

来源：[Carl Beekhuizen](https://blog.ethereum.org/2020/05/21/keys/)

Cr: Nishant Das 负责事实核查

</br>

</br>

声明：ECN的翻译工作旨在为中国以太坊社区传递优质资讯和学习资源，文章版权归原作者所有，转载须注明原文出处以及ethereum.cn，若需长期转载，请联系ethereumcn@gmail.com进行授权。