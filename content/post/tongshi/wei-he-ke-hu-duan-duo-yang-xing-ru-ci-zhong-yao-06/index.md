---
path: wei-he-ke-hu-duan-duo-yang-xing-ru-ci-zhong-yao
id: 6
title: Eth2 Staking 系列：为何客户端多样性如此重要
description:  'Medalla测试网事件给我们带来什么启示？' 
date: 2020-06-25T02:15:01.762Z
author: Carl Beekhuizen
---

</br>

来源 | [Ethereum Blog](https://blog.ethereum.org/2020/12/10/validated-perfect-is-the-enemy-of-the-good/)

来源 | [Ethereum Blog](https://blog.ethereum.org/2020/08/21/validated-why-client-diversity-matters/)



</br>

![质押1.png](https://i.ibb.co/WyP26VY/1-8cf3398852.png)



</br>

免责声明：本文对并没有针对哪一个客户端。我们要知道，每个客户端甚至每个规范都可能含有不足以及漏洞。更别说，Eth2是一个十分复杂的协议，而它的实现者也都是凡人而已。写这篇文章的目的是为了强调如何以及为什么要减少风险。

Medalla测试网发布之后，我们鼓励大家使用不同的客户端参与测试网。而测试网创世那天，就给我们展现了多客户端的重要性：Nimbus和Lodestar客户端运行的节点无法处理整个测试网的工作，因而没有跟上同步节点的进度。这造成的结果是，Medalla发布半小时以后才开始进行最终确定工作。

8月14日，Prysm节点出现时间错误，因为他们参照的其中一个时间服务器突然跳到了未来的时间上。结果，这些节点开始提议未来区块、验证未来证明。然而，节点的时钟被校准之后 (通过更新客户端版本的方式，或者由于时间服务器调回正确的时间了)，早前取消了罚没保护的节点却发现其质押资产被罚没了。

这整个过程都发生得有点微妙，我强烈推荐大家阅读[Raul Jordan对该事件的回顾文章](https://medium.com/prysmatic-labs/eth2-medalla-testnet-incident-f7fbc3cc934a)。

##  </br>

# 时钟错误 — 情况恶化

当Prysm节点开启时间旅行的时候，他们约占网络份额的62%。这意味着无法达到最终确定区块的最低标准 (要有>2/3活跃验证者在链上)。更糟糕的是，这些节点无法找到它们所期望的链 (时间轴上出现了4小时的间隔，它们都去到了未来稍微不同的时间)，所以他们在对“丢失”的数据预测时，通过短分叉淹没了整个网络。

</br>


![img](https://i.ibb.co/y0jV1RT/2-b60beb9d87.png)

<center>图示：目前Prysm客户端占Medalla节点总量的82%[来源：ethernodes.org](https://eth2.ethernodes.org/network/Medalla) </center>

那么在这时，网络充斥着对链头的不同的预测，因此所有客户端开始应付越来越多的工作——确定哪个链头是有效的。这导致节点落后、需要同步、内存不足和其他形式的混乱，所有这些都使问题更加恶化。

总的来说，这此事件是好的，因为这不仅让我们修复了与时钟相关的根本问题，还可以在大量节点故障和网络负载的情况下对客户端进行压力测试。也就是说，这次失败告诉我们网络不能太极端，而该次事件的罪魁祸首就是因为Prysm的节点占网络的大部分。

##  </br>

# 助力去中心化—Part 1，有益于eth2

正如本系列的[第二期文章](https://blog.ethereum.org/2020/02/12/validated-staking-on-eth2-2-two-ghosts-in-a-trench-coat/)里所讨论的那样，根据异步拜占庭容错算法，1/3是保证网络安全的一个神奇数字。如果超过1/3的验证者离线了，epochs不能再被最终确定。所以尽管这时链仍在增长，也不再能对区块进行确定，以及保证它是标准链的一部分。

##  </br>

# 助力去中心化—Part 2，有益于验证者

很大程度上，验证者是被激励去做对网络有益的事情，而不是因为大家觉得这是件正确的事情所以才去做。

如果超过1/3的节点离线了，那么对离线节点的惩罚便开始增加，这就是所谓的“不作为”惩罚。

这意味着，一名验证者**想要尝试确保：如果自己的节点被逼下线了，那么不可能同时逼其他节点下线。**

罚没也是一样的。然而，由于规范或软件出现错误/bug，验证者总是有可能被罚没，单个罚没“仅仅”1个ETH。

然而，如果许多验证者同时被罚没，那么惩罚会上升到32个ETH。而又是这个神奇的数字，当超过1/3的验证者被罚没时，便会产生32个ETH的罚没。[[关于发生以上情况的原因可以在这找到答案\]](https://blog.ethereum.org/2020/01/13/validated-staking-on-eth2-1-incentives/)

这些激励方式分别被称为活性反相关和安全反相关，是eth2里有意设计的一个方面。反相关机制通过将个体惩罚和每个验证者对网络的影响程度捆绑在一起，激励验证者做出符合网络最大利益的决定。

##  </br>

# 助力去中心化—Part 3，数据的展示

许多独立的团队正在实现Eth2，每个团队根据主要由Eth2研究团队编写的[规范开发独立的客户端](https://github.com/ethereum/eth2.0-specs/)。这确保了有多个信标节点和验证者客户端实现，每一个团队都对构建eth2客户端所需的技术、语言、优化、权衡等做出不同的决策。这样，任何一层系统中出现bug时，只会影响运行特定客户端的用户，而不会影响整个网络。

如果在这次Medalla Prysm发生的时间bug中，只有20%的eth2节点在客户端Prysm上运行和85%的验证者在线，那么Prysm节点不会遭受“不作为”惩罚，而且只需一点小惩罚以及开发者们的几个不眠夜就可以解决问题了。

相反，由于运行同一个客户端的验证者太多了（其中许多验证者取消了罚没保护），在很短的时间内罚没了3500到5000个验证者。

*高度的相关性意味着这些验证者的罚没惩罚约为16个ETH，因为他们使用的是一个比较普遍的客户端。

*在撰写本文时，罚没还在不断涌现，所以还没有最终的数字。

##  </br>

# 用新的客户端





![质押3.png](https://i.ibb.co/kgSkx5r/3-1b2dbdad64.png)





现在是时候使用不同的客户端参与测试了，找一个少部分验证者在用的客户端（可以点击[此处](https://eth2.ethernodes.org/network/Medalla)查看分布状况）。[Lighthouse](https://eth2.ethernodes.org/network/Medalla)、[Teku](https://status-im.github.io/nim-beacon-chain/medalla.html)、[Nimbus](https://status-im.github.io/nim-beacon-chain/medalla.html)以及[Prysm](https://docs.prylabs.network/docs/)此时都运行得较为稳定，然[Lodestar](https://chainsafe.github.io/lodestar/)正迅速追赶中。

最重要的是，尝试使用新的客户端！我们可以在Medalla上尝试构建更加健康的节点分布，为去中心化主网做好准备。

</br>

</br>

声明：ECN的翻译工作旨在为中国以太坊社区传递优质资讯和学习资源，文章版权归原作者所有，转载须注明原文出处以及ethereum.cn，若需长期转载，请联系ethereumcn@gmail.com进行授权。