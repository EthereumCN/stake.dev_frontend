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

const Faq = () => {
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
            color="#333"
          >
            <Box as="span" color="#2E71FF">
              →{" "}
            </Box>{" "}
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
          >
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
              title="什么是验证者节点？"
              info="每个客户端都包含两个软件。第一个是节点软件，它负责处理网络共识，它与外部世界连接，并发送和接受区块。第二个是验证者客户端，它与你的节点连接，并负责证明与提议区块。每个验证者客户端上都可以有多个质押了32个ETH的验证者。"
            />
            <MyAccordionItem
              index="2"
              title=" 我是否总是需要运行一个Eth1节点来运行一个Eth2验证者节点？"
              info="在eth1->eth2合并之前，你都需要运行一个Eth1节点，合并后，Eth1节点就会被抛弃，而Eth2节点就是以太坊节点。"
            />
            <MyAccordionItem
              index="3"
              title="在ETH 2上质押需要运行一个ETH 1全节点吗？轻客户端可以吗？如果你的ETH 1节点掉线了会怎么样？"
              info="是的，你需要一个ETH 1节点，轻客户端也可以，但是同步轻客户端有时候会容易出问题。如果你没有一个ETH 1节点，你可以继续证明，但你不可以提议区块。"
            />
             <MyAccordionItem
              index="4"
              title="我应该什么时候补充我的验证者余额？"
              info="这个问题的答案很大程度取决于你余额还有多少ETH。如果你的余额接近16个ETH的话，需要再存入：这是为了确保不会被验证者集踢出 (如果余额低于16 ETH的话，会被自动踢出)。如果余额接近31个ETH，不需要再存入ETH以达到32个。"
            />
             <MyAccordionItem
              index="5"
              title=" 我什么时候可以提款，退出与提款有什么区别？"
              info="可以用你的验证者节点签名一条自愿退出信息以示意你想要停止验证。但是请注意，在阶段0，一旦验证者退出了就无法再进入。这意味着不能再激活你的验证者节点，在实现转账功能前也不能转移或提取资金。"
            />
            <MyAccordionItem
              index="bottom"
              title="如果我自己运营验证者，需要什么样的硬件？"
              info="你需要一颗还不错的 CPU、16 GB 的内存，固态硬盘（为了保险，考虑1 TB及以上的规模），还要有稳定的电力供应和网络供应。如没有发生大规模的掉线事件，则在线 50% 时间以上就可保证正收益（但你可别连续长时间不在线呀）。"
            />
          </Accordion>
        </Box>
      </Flex>
    </Layout>
  )
}

export default Faq
