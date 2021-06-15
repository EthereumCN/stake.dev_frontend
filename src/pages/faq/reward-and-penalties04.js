import React from "react"
import Layout from "../../components/layout"
import {
  Box,
  Text,
  Image,
  Flex,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react"
import MyAccordionItem from "../../components/myAccordionItem"
import { Link as ReachLink } from "gatsby"

const Reward04 = () => {
  return (
    <Layout>
      <Flex justifyContent="space-around" mt="1.5rem">
        {/* left side nav bar  */}
        <Box as="ul" color="#999" fontWeight="600">
          <Box
            as="li"
            style={{ listStyle: "none" }}
            fontSize="24px"
            _hover={{ color: "#333" }}
           
          >
            <ReachLink to="/faq/">验证者</ReachLink>
          </Box>
          <Box
            as="li"
            style={{ listStyle: "none" }}
            fontSize="24px"
            _hover={{ color: "#333" }}
            mt="1.5rem"
          >
            <ReachLink to="/faq/client02">客户端</ReachLink>
          </Box>
          <Box
            as="li"
            style={{ listStyle: "none" }}
            fontSize="24px"
            _hover={{ color: "#333" }}
            mt="1.5rem"
          >
            <ReachLink to="/faq/key03">密钥</ReachLink>
          </Box>
          <Box
            as="li"
            style={{ listStyle: "none" }}
            fontSize="24px"
            _hover={{ color: "#333" }}
            mt="1.5rem"
            color="#333"
          >
            {" "}
            <Box as="span" color="#2E71FF">
              →{" "}
            </Box>{" "}
            <ReachLink to="/faq/reward-and-penalties04">奖惩</ReachLink>
          </Box>
          <Box
            as="li"
            style={{ listStyle: "none" }}
            fontSize="24px"
            _hover={{ color: "#333" }}
            mt="1.5rem"
          >
            <ReachLink to="/faq/staking-pool05">质押池服务</ReachLink>
          </Box>
        </Box>

        {/* right side faq   */}
        <Box w="940px" borderRadius="20px" background="#fff">
          <Accordion allowMultiple borderRadius="20px">
            {/* lin1  */}
            <MyAccordionItem
              index="top"
              title=" 奖励/惩罚是如何发放的？"
              info="每个验证者都有自己的余额——初始余额会在存款合约里显示。以太坊网络规则会基于验证者的履职情况定期更新其余额。换言之，奖励与惩罚会随着时间反映在验证者的余额中。"
            />
            <MyAccordionItem
              index="2"
              title="奖励/惩罚多久更新一次？"
              info="大约每6.5分钟 (即一个epoch) 更新一次。在每个epoch里，网络都会评估每个验证者的表现，并相应给予奖励或惩罚。"
            />
            <MyAccordionItem
              index="3"
              title="罚没是什么？"
              info="罚没有两个作用：1) 大幅提高攻击 ETH 2.0 的成本，使攻击无利可图；2) 通过检查验证者是否履行其职责来防止他们偷懒。对验证者进行罚没，指的就是如果有验证者被证明作恶，他们的部分或全部权益就会被销毁。遭到罚没的验证者无法继续参与网络的共识机制，会被强制退出。"
            />{" "}
            <MyAccordionItem
              index="4"
              title="如果我错误地设置了我的节点，我会有罚没风险吗？"
              info=" 是的，会有一些风险。用户遭遇罚没的最常见操作是用一个验证者密钥同时运行两个不同的验证者客户端。你需要确保你的设置不会有这种情况发生。"
            />
            <MyAccordionItem
              index="5"
              title="如果我离线了会怎么样？会被罚没吗？"
              info=" 这视情况而定。除了有效余额的影响外，还需要主要以像两种重要情况：

              如果绝大多数（2/3）验证者都在线，离线招致的惩罚会较低，因为有足够多的验证者在线，可以实现区块的最终确定性。
              如果有超过 1/3 的验证者同时离线，离线惩罚就会较高，因为网络无法继续实现区块的最终确定性。这种属于不太可能发生的极端情况。
              请注意，如果是第二种 (不太可能的) 情况，离线验证者在 21 天内损失的ETH可高达 50% (16 ETH)。21 天之后，这些验证者就会被逐出验证者池。这样一来，网络就可以恢复正常，开始达成区块的最终确定性。"
            />
            <MyAccordionItem
              index="6"
              title="我可以暂停运行 (而非退出网络) 我的验证者节点几天，然后再重新开始吗？"
              info="可以的，但正常情况下你会损失一定数额的ETH，大概相当于你在那段时期赚取的ETH数量。换言之，如果你赚取了大约0.01个ETH，那么你将损失大约0.01个ETH。"
            />
            <MyAccordionItem
              index="7"
              title="作恶的验证者会遭受什么惩罚？"
              info=" 同样视情况而定。恶意行为 (例如，投票给无效或有冲突的区块) 会让验证者遭到罚没。在早期最低罚没金额是0.25 ETH ，之后会恢复至1 ETH的低限，但是如果其他验证者在同一时间也遭到罚没，这一金额会增加。这样设计的目的是尽可能减少验证者因无心之失而蒙受的损失，但同时有力防止协同攻击。"
            />
            <MyAccordionItem
              index="8"
              title=" 质押多于32 ETH会有什么好处吗？"
              info=" 没有，单个验证者存入超过 32 ETH 不会获得任何优势。将质押的最大ETH数额限制到32个有助于提高去中心化程度，因为它防止任何一个验证者有过大的投票权重。验证者的投票权重取决于其质押余额。"
            />
            <MyAccordionItem
              index="9"
              title=" 验证者保持活跃和诚实会有什么激励吗？"
              info="除了离线会被罚款外，验证者的恶意行为也会遭受惩罚，例如投票给无效或冲突的区块。另一方面，如果验证者提议或证明的区块被打包到链上，他们就会得到奖励。

              基本规则如下：帮助网络达成共识的行为会得到奖励；妨碍共识达成的无意行为 (或不作为) 会招致轻度惩罚；恶意行为会招致严重惩罚 (也称为罚没)。换言之，验证者在最大化他们的奖励时就是在为整个网络带来最大的裨益。"
            />
            <MyAccordionItem
              index="10"
              title=" 诚实验证者需要在线多长时间才能实现盈利？"
              info="总的来说，只要验证者的在线时间超过 50% ，就能实现盈利。这意味着验证者不需要使用后备客户端或网络连接来达到最大在线时间，因为离线的后果并没有那么严重。"
            />
            <MyAccordionItem
              index="11"
              title="我的验证者可以主动退出吗？"
              info="可以，在成为活跃验证者的 9 天后，可以发起主动退出请求，将验证者状态转为即将退出，进入等待退出的队列。"
            />
            <MyAccordionItem
              index="12"
              title=" 怎样追踪我质押了的 ETH 以及我的奖励？"
              info="已经有一些很好的浏览器如 beaconcha.in 和 beaconscan.com 来追踪验证者节点的工作情况。你也可以在本地上安装 Prometheus 和 Grafana 来创建一个dashboard来追踪你的验证者节点的工作状况，或者在验证者客户端的输出设备上查看。"
            />
            <MyAccordionItem
              index="bottom"
              title="什么时候信标链可能开放转账的功能？"
              info="通俗来说，按照先前的路线图，用户要取出在以太坊2.0中质押的ETH和奖励，需要等到阶段2实现之后（至少2年），而新路线图的一个优势在于简化并且加速了eth1和eth2的合并过程，甚至有可能在分片之前就可以实现合并，大幅缩短了ETH的锁定时间。"
            />
          </Accordion>
        </Box>
      </Flex>
    </Layout>
  )
}

export default Reward04
