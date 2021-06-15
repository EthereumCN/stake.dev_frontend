---
path: yi-tai-fang-2-shi-li
id: 8
title: Staking 经济激励机制——以太坊2.0实例
description:  '洞悉以太坊2.0 Staking的经济模式' 
date: 2020-06-25T02:15:01.762Z
author: Barnabé Monnot
---

</br>

来源：[hackingresear.ch](http://hackingresear.ch/economic-incentives/)

作者: Barnabé Monnot & Sacha Yves Saint-Léger

本文旨在帮助您探索Staking(权益质押)中的不同可能性，加以权衡之后能够更加洞悉以太坊2.0 Staking的经济模式。本文得以写就，感谢Eth 2.0 Economics（on EthHub）和目前Eth 2.0规范 (ETH 2.0 specs) 的独到视野。



</br>

#   **概述**  

被称为“宁静”(Serenity)的以太坊2.0是以太坊社区多年来一直在谈论、研究和积极建设的产品，它所结合的不同功能，最终将成为一个聚合的整体。



**如Vitalik所言**

*“宁静”(Serenity)可以被称作真正意义上的世界计算机。现阶段的以太坊就如同1999年的智能手机只能玩贪吃蛇一般，每秒只能处理15笔交易。*



这一愿景的关键之一是将共识算法从工作量证明(PoW)转变为权益证明(PoS)，如果不清楚的话我们建议您阅读本文第一部分有关共识算法的内容。



我们为何要关注共识算法的转变呢？事实证明，从PoW到PoS的迁移对与维护以太坊网络紧密相关的经济激励机制具有重大意义。





**Ethhub上的以太坊2.0路线图文件对此是这样解释的：**



*与以太坊宁静(Serenity)升级随之而来的还有从工作量证明(PoW)到权益证明(PoS)的转变。这意味着我们将以激励验证人的方式来维护网络，而不再向矿工付费。厘清权益质押(staking)中的经济学对维持网络健康和安全来说至关重要。*



*如果对进行质押的奖励太低，网络将无法获得维持大量分片(shards)所需的最少验证人。反之，网络就会过度支付并发生通胀，通胀速度足以损害网络整体经济。*



</br>



# **激励措施**



根据最新规范，每个验证人需要质押32个以太币。作为回报，他们会就自己成功提出的每个区块获得奖励。该奖励数量以浮动比例来计算，比例基于质押在网络中的以太币总量。



简单来说：如果以太币质押总量越低，奖励（利息）越高，但随着质押总量增加，每个验证人得到的奖励（利息）会开始降低。



为什么要使用浮动比例计算？虽然我们不会深挖此处细节，但基本的直觉告诉我们需要某个最小数量的验证者（由此得到最低的以太币质押总量）才能使网络正常运行。因此，为了激励更多的验证人加入，重要的是要将利率保持在高位，直到达到这个最小数量。



之后，验证人仍然被鼓励加入（验证人越多，网络越去中心化），但这并非必要之举（因为利率可能会下降）。



</br>

## **我们的假设**



由于规范几乎每天都在更改，最近一次重大更新就在几天前，我们不打算尝试在这个阶段确定最终模型。相反，我们决定建立一个**驱动利率和发行率的重要机制**的模型，其中发行率指以太币供应增长的年化率。



以下是我们做出的假设：



**1.**利息和发行率按年计算。这意味着给定年份的发行率是根据当年年初流通中的以太币总量来计算。



**2.** 所有验证人都诚实地遵循协议并且在线。验证人会因持续离线或进行可削减投票而受到处罚。在这个简单的模型中，我们假设两种惩罚情况都没有发生，这些情况将用于未来的研究以探讨验证人的不同行为。



**3.** 奖励或惩罚不计入押金。以太坊2.0帐户必须抵押一定金额（目前设置为32 以太币）才能成为验证人。但是在每个epoch结束时，验证人收到的奖励和惩罚都会改变押金总额。因为这种改变每个epoch都会发生，押金总额随时间推移会更加复杂化。由于我们不考虑奖励和处罚对初始押金的影响，这种复合效应可以忽略不计。



**4.** 所有验证人的奖励都是等额的。 根据当前规范，验证人在采取不同行动时获得的奖励略有不同。我们不考虑这一点。



**5.** 某些常数不改变。我们假设有1024个分片，每个验证人抵押32个以太币，epoch长度等于64个时隙，并且每个时隙持续6秒。



我们还决定开源我们的JavaScript库（参见本页底部），其中包含我们用来计算发行率和利率的函数。若是对模型进行拓展或者颠覆上面的一些假设时，我们会保持更新。



</br>

## **我们的模型**

|                | **假设**                                           |                     |
| -------------- | -------------------------------------------------- | ------------------- |
| 基本奖励       |                                                    | **200**             |
| 流通中的以太币 |                                                    | **100,000,000 ETH** |
| 每个分片验证人 | **注：每个分片的验证器人数量是关于网络质押的函数** | **305**             |
| 验证人数量     |                                                    | **312,320**         |



![图片](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)



如果网络质押总量是10,000,000 ETH，那么：



- **验证人每年可获得3.28%的利息。**



![1](https://i.ibb.co/8XsqL0s/1.png)

![2](https://i.ibb.co/Gk651qH/2-webp.jpg)



- **网络发行率为每年0.33%。**



![3](https://i.ibb.co/68Lc9B1/3.png)

![4](https://i.ibb.co/n6r6fHD/4-webp.jpg)

![图片](https://mmbiz.qpic.cn/mmbiz_gif/4EL2Q3tnbKibpZwUCPIIV1bzrA9Bj72oAbvhiaPnTwUE7asqqAXwdKtibSRTmMwC8fHaZSENNLLmzZ6RjACyQ1oPQ/640?wx_fmt=gif&tp=webp&wxfrom=5&wx_lazy=1)



![5](https://i.ibb.co/tQGd6Ph/5.png)



<center>不同网络质押总额的利率和发行率</center>



随着更多的代币发行以奖励验证者，导致质押总额上升，因此网络发行率增加。另一方面，验证人利息减少：从经济角度来说，质押总额较高时并不需要比总额较低时更多的验证人。