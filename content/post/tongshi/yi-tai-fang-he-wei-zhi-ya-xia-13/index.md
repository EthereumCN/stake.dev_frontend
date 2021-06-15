---
path: yi-tai-fang-he-wei-zhi-ya-xia
id: 13
title: 以太坊2.0质押池的代币经济 (下)：质押代币的运作方式
description:  '质押池借助什么机制来铸造以及分发质押代币？' 
date: 2020-06-25T02:15:01.762Z
author: StakeWise 
---

</br>

来源 | [StakeWise](https://stakewise.medium.com/the-tokenomics-of-staking-pools-what-are-staked-eth-tokens-and-how-do-they-work-2b4084515711)

[上部分](https://www.ethereum.cn/the-tokenomics-of-staking-pools)介绍了何为 staked ETH 代币 (即质押 ETH 所获得的代币)，本文将讲解它们是如何运作的。

</br>

# 是什么让这些代币得以运行

当谈到 staked ETH 代币如何工作的核心原则时，不同质押池的设计选择之间的差异变得更加难以察觉，但却能带来重大影响。

## 链下预言机

要想有效地解决流动性不足的问题，所持有的 staked ETH 代币必须要准确地映射用户所质押的 ETH 的价值。这要求质押池中的 ETH 总额总是能够为其分发的代币背书。质押池通过追踪他们在信标链上的验证者的余额，并铸造相应的代币。

不幸的是，负责铸造代币的 ERC-20 合约和验证者的余额不在同一条区块链上 (ETH1 vs ETH2)。也就是说，ETH1 链上的代币合约不能直接同步信标链上验证者的余额。质押池通过使用链下预言机来克服这些限制，其工作原理与现在普遍使用的 [Chainlink](http://chain.link/) 类似。

链下预言机以这样的方式允许与信标链通信：首先，一个预言机操作符必须同时运行 ETH1 和 ETH2 节点，以实现同时与两条链通信。一旦两个节点都启动了，预言机将从信标链中收集属于某个特定质押池的验证者的信息，并传输至 ETH1 链的 ERC-20 合约中。一旦信标链的信息提交至 ERC-20 合约中，代币数量 (或者铸造新代币的汇率) 就会根据验证者余额的变化而更新。这种变化可正增长 (如，获得质押奖励)，也可以负增长 (如，产生惩罚)。



![ERC20](https://i.ibb.co/8X8vhFX/erc20.png)

</br>

## StakeWise 的信标链预言机的设置。

然而，链下预言机有一个缺点：控制预言机的实体有效地控制着代币的余额。为了缓解这一问题，质押池运营者要求多个预言机同时提交同样的信息才可以通过共识机制更新验证者的代币余额，并且将预言机分布在不同的独立实体中以实现一定程度的去中心化。

当然，这些解决方案还不够理想，建议用户留意质押池是否以足够去中心化的方式运行其预言机。

</br>

## 余额更新频率

在 ERC-20合约进行的每一次代币余额更新都要花 gas 费，有时可能花一笔不少的钱。为了减少 gas 费消耗，大多数服务提供商倾向于每天更新一次代币余额。大部分人认为这已经足够了，因为质押的日收益率相当低 (每天0.005% 至 0.063% 不等)，因此没有必要频繁更新。

然而，在发生大规模罚没事件的情况下，每天更新一次可能不足以解决问题。只要验证者触犯了罚没规则，就会受到罚没惩罚，这会导致验证者的余额在几分钟之内大规模丢失 (在最极端的情况下，甚至会损失全部余额)。如果许多质押池的验证者同时被罚没，并且还是 24 小时更新一次余额的话，会造成灾难性的后果。

这里的问题是，任何用户都可以按 epochs 来跟踪质押池中验证者的 ETH 数量 (借助信标链浏览器)。也就是说，他们在余额变化被映射至代币之前，就可以知道其余额将大幅度减少。一旦持有 staked ETH 代币的用户意识到池中的 ETH 与代币供应量不匹配，他们将提前运行 ERC-20 合约并在二级市场中抛售代币以止损。从而使得毫无察觉的流动性提供者承受无偿损失，并且要承担过多的罚没损失。

为了避免这种情况的发生，质押池可以调整代币余额更新频率，权衡 gas 费成本和余额不匹配带来的危机。实际上，质押池不太可能准备更加频繁地更新代币余额 (更别说每 epoch 更新一次了)。相反，他们倾向于通过改进安全性程序来降低罚没风险，或者在罚没事件已经发生的情况下才准备提高更新的频率。

因此，建议池子的用户以及流动性提供者监测池中验证者的余额。将来，类似 Beaconcha.in 这样的可能会提供订阅服务以实时监测罚没事件，这能更加快速地散播罚没信息，使得 staked ETH 代币的二级市场更加高效。

</br>

## 收入和损失的社会化

所有池子都按照这样的比例分配其质押收入和损失：用户的质押数额/池中的质押总额。这样做是为了避免某些用户被随机分配到的验证者具有较好或较差的表现，而比其他用户赚得更多或者更少。假设所有池子运营者都没有作恶，那么主要的区别在于，他们被随机分配的验证者提议了更多的区块，这意味着带来更多奖励。因此收益社会化听起来更加公平。

然而，质押奖励社会化仍然可能会给池子的参与者带来一些不公平，尤其是当池子的验证者在排队等候激活时 (截至本文发布，验证者等候队列约18天)。比如，验证者赚得的奖励总额被分给所有代币持有者，然而在新用户存款的同时，池子就会铸造代币并分发给他们。也就是说，不管用户的存款有没有在信标链中激活，只要他们存了 ETH，就会被分得奖励 (因为他们持有代币)。

这意味着池子的收益平均分配给所有参与者，就当所有已质押的 ETH 都在赚取收益中。而实际上并非所有已质押的 ETH 都在产出收益，因为当前的等待激活期约 18 天。因此，代币持有者的年化率将不同于池中验证者的平均年化率，用户应对此有心理准备。



![ETHdeposit](https://i.ibb.co/vHKHWjP/reward.png)



奖励分给池子的所有参与者，即使不是所有已质押的 ETH 都被激活。

某个用户的损失就是另一个用户的收益。这种情况有利有弊 —— 这取决于每个人的看法。

对于刚存款的用户来说，他们可以从这种社会化中获益，因为这允许他们跳过了等候队列，并且从他们质押的那一刻起就开始赚钱了！然而与此同时，这些用户也会更快地开始承担池子的质押损失。

另一方面，其质押存款已经被激活并开始赚取收益的那部分用户，也很乐意让新来的质押者分担一些惩罚，让自己的损失变少。然而，在池子正常盈利的情况下，收益社会化会使得新质押的用户[分割掉原本用户所应有的奖励](https://www.reddit.com/r/ethstaker/comments/kkl74f/what_rewards_have_you_received_from_kraken_so_far/gh5tucj/?utm_source=share&utm_medium=web2x&context=3)from this effect.)。

总的来说，质押池中存款增长得越快且停留时间越长，原本存在的质押用户就会被刮分越多的收益。如果池子被普遍使用，让池子分发的代币拥有更大的流动性可以弥补该缺点。

</br>

## 收取服务费

质押池的服务费通常在他们所赚得的奖励中扣除，范围从 8% 到 23%。分给用户的奖励会立即扣除服务费，因此用户持有的代币余额的增减也会把服务费算在内。当根据代币的增长率来判断不同质押池的性能时，记住这一点很重要。

比如，分析来自两个池的 staked ETH 代币 (这两个池有着相同的机制和验证者表现)：用户使用服务费较低的池子，其代币数量会增长得更快。

对于评估不同代币在二级市场中的价格及其在 DeFi 应用中的使用，此特点至关重要。净收益率的变化会导致不同的 staked ETH 代币存在价格差异，即尽管在流动性一样的情况下，服务费较低的池子铸造的代币扣除更少的价值。

</br>

## 对奖励再质押

人们普遍误以为，质押池会自动对用户获取的奖励进行再质押，因此会产生复合增长。然而这很难办到，根据当前的 ETH2 规范，自动对所得奖励再质押是不可行的，用户应警惕任何声称可以实现自动再质押的池子。只有到阶段 1.5 质押池才可以实现自动再质押和产生复合收益。离阶段 1.5 大概还有 18 个月，所以务必警惕虚假广告。

尽管缺乏本地支持，用户可以通过使用双重代币结构的质押池，从而手动实现再质押。这种质押池的用户可以将质押奖励和存款代币分开出售，以及把收益进行再质押。只要奖励代币可以在二级市场上与 ETH 等值出售，他们甚至可以获得复合回报。



![comparison](https://i.ibb.co/9HXgkSm/comparison.png)



复合收益的效果在长期来看会更加明显，但在短期来看效果也不差。图表假设网络的年化率为 10%。

尽管我们有策略使得 reward ETH 代币的折扣保持在最低，但我们不能保证这行得通。也就是说，除非该概念被证实，否则在阶段 1.5 之前获得质押复合收益对于所有质押池来说都是一个难以克服的难题。

</br>

# 总结

我们希望大家对 staked ETH 代币的设计选择和代币化原则有了普遍的理解之后，能够激发以太坊社区深刻讨论不同质押池的优缺点。

本文中讨论的某些概念值得进一步分析，尤其是验证者余额变化的社会化，以及代币合约的更新频率，因为这些设置对池子的年化率会产生深刻的影响。

ECN的翻译工作旨在为中国以太坊社区传递优质资讯和学习资源，文章版权归原作者所有，转载须注明原文出处以及ethereum.cn，若需长期转载，请联系eth@ecn.co进行授权。流预期 (本金和利息) 中。

比如，当用户获得奖励代币时，他们可以在本息分离债券市场 ([STRIPs](https://www.investopedia.com/terms/s/stripbond.asp) market) 中逐渐出售 reward ETH 代币，有些用户就可以不用亲自质押也可以获得质押红利了。

------