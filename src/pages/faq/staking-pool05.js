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

const StakingPool05 = () => {
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
          >
            <ReachLink to="/faq/reward-and-penalties04">奖惩</ReachLink>
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
            <ReachLink to="/faq/staking-pool05">质押池服务</ReachLink>
          </Box>
        </Box>

        {/* right side faq   */}
        <Box  w="940px" maxH="10rem" borderRadius="20px" background="#fff">
          <Accordion allowMultiple borderRadius="20px">
            {/* lin1  */}
            <MyAccordionItem
              index="top"
              title="在质押池里质押与运行节点分别有什么风险与好处？"
              info="在质押池里质押的好处就是你不需要履行任何职责。风险还是那句老话“控制不了你的密钥就控制不了你的币。"
            />

            <MyAccordionItem
              index="bottom"
              title=" 有没有去中心化的第三方运营方案？"
              info="没有，所有的第三方托管方案都要求你信任第三方。举例，如果第三方托管了你的验证私钥（你保留自己的取款私钥），你还是必须信任该第三方会妥善运营验证者，不会导致你被罚没（所以你跟第三方之间必须实现分配好责任）。如果你直接把钱交给第三方，连取款私钥都不保留，则信任程度更甚（与把钱存入中心化交易所等同）。"
            />
          </Accordion>
        </Box>
      </Flex>
    </Layout>
  )
}

export default StakingPool05
