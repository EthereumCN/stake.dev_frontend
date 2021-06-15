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

const Client02 = () => {
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
            color="#333"
          >
            {" "}
            <Box as="span" color="#2E71FF">
              →{" "}
            </Box>{" "}
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
              title="Eth2客户端有哪些，要怎么用？"
              info="目前的Eth2客户端有Prysm、Lighthouse、Teku、Nimbus和Lodestar，之后还会有Trinity。每一个客户端都有完善的文档，详细说明如何安装以及运行。"
            />
            <MyAccordionItem
              index="2"
              title="我应该运行哪一个客户端？"
              info="你应该选择自己有信心运行的客户端，并且要考察对比不同客户端的性能。除此之外，由于Eth2网络的设计，有能力的话最好选择一个少数用户使用的客户端，帮助避免大规模故障。"
            />
            <MyAccordionItem
              index="3"
              title=" 为什么要有多客户端？客户端之间的区别是什么？"
              info="多客户端可以提高网络的弹性。假定将验证者平均分到几个Eth2客户端中，如果其中一个出现bug并且停止运作了，网络仍能继续运作。这些客户端之间的主要区别就是它们是用不同的编程语言写的。如果有四个客户端在运行，这类似于四次检查每个区块是否真的有效。"
            />
            <MyAccordionItem
              index="bottom"
              title="我能不能用多台机器来运行同一个验证者？这样应该不那么容易掉线？"
              info="千万不要！因为当你用多台机器运行同一个验证者的时候，如果这几台机器之间忽略了彼此已经发送过的见证消息，就有可能补发出与之前的消息冲突的消息，导致你的验证者被罚没！最稳妥的办法还是一个验证者仅部署在一台机器上。

              （同理，不要使用多个客户端软件来运行同一个验证者！只要选好一个客户端软件即可）"
            />
          </Accordion>
        </Box>
      </Flex>
    </Layout>
  )
}

export default Client02
