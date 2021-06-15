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

const Key03 = () => {
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
            color="#333"
          >
            {" "}
            <Box as="span" color="#2E71FF">
              →{" "}
            </Box>{" "}
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
              title="什么是验证者密钥？"
              info="跟一个信标链验证者相关的密钥对有两对，一对我们称为 “验证密钥对”，该密钥对的私钥用于验证者在参与共识的时候签名发送见证消息（attestation）；另一对我们称为 “取款密钥对”，该密钥对的私钥用于在验证者完全退出验证者队伍后取回自己的验证者名下的资金。

              两把私钥都需要自己保管，如果验证私钥泄露，则他人可用你的私钥发送见证消息，导致你的验证者被大力惩罚；如果取款私钥泄露，则他人可在你的验证者退出之后先你一步取走你属于你的全部资金。
              
              两把公钥都需要在存入押金时提交到押金合约（再强调一遍，除非你非常了解相关的密码学及智能合约，否则请使用 https://launchpad.ethereum.org/ 的引导流程及其提供的工具，完成操作）。"
            />
            <MyAccordionItem
              index="2"
              title="如何生成以及保存我的密钥？"
              info="生成密钥的最佳方式就是通过以太坊基金会Launchpad。可以通过离线保存助记词来保护你的提款密钥（记在纸上）。你可以通过确保你的计算机已安全地设置好来保护你的验证者密钥。"
            />
            <MyAccordionItem
              index="3"
              title=" 签名密钥 (signing key) 丢失了会有什么后果？"
              info="如果签名密钥丢失，验证者将无法继续提议或证明区块。随时间推移验证者的余额将逐渐减少，因为验证者由于无法参与共识流程而受到惩罚。当验证者的余额减少至 16 ETH 时，系统便会自动将其逐出验证者池。

              然而，这并不意味着验证者要失去质押的所有ETH了。假设验证者是通过 EIP-2334 (根据默认的引导流程) 生成其签名密钥，那么验证者总是可以根据提款密钥重新计算其签名密钥。然后就可以凭借提款密钥提款。请注意，如果同一时间退出或被逐出网络的验证者太多了，等待时间将会更长。"
            />
            <MyAccordionItem
              index="4"
              title="提款密钥 (withdrawal key) 丢失了会有什么后果？"
              info="如果提款密钥丢失了，验证者将无法访问质押的ETH了。因此，建议验证者使用助记词 (mnemonics) 来创建提款密钥，作为备份。如果验证者是通过此Launchpad的引导流程加入的，其提款密钥将默认通过助记词创建。"
            />
            <MyAccordionItem
              index="5"
              title="提款密钥被盗取了会如何？"
              info="如果提款密钥被盗，盗窃者可以转移验证者的余额，但只能在验证者退出之后才能进行此操作。如果盗窃者没有签名密钥，那么其无法强制验证者退出。这时验证者先凭借签名密钥快速退出验证者节点，然后在盗窃者之前凭借提款密钥将资金转走。"
            />
            <MyAccordionItem
              index="6"
              title=" 签名密钥 (signing key) 丢失了会有什么后果？"
              info="如果签名密钥丢失，验证者将无法继续提议或证明区块。随时间推移验证者的余额将逐渐减少，因为验证者由于无法参与共识流程而受到惩罚。当验证者的余额减少至 16 ETH 时，系统便会自动将其逐出验证者池。

              然而，这并不意味着验证者要失去质押的所有ETH了。假设验证者是通过 EIP-2334 (根据默认的引导流程) 生成其签名密钥，那么验证者总是可以根据提款密钥重新计算其签名密钥。然后就可以凭借提款密钥提款。请注意，如果同一时间退出或被逐出网络的验证者太多了，等待时间将会更长。"
            />
            <MyAccordionItem
              index="7"
              title="为什么要有两个密钥?"
              info="简而言之，就是为了安全。签名密钥必须保证随时可用。因此，签名密钥必须保持在线。由于保存在线上尤其容易受攻击，因此不建议同时用签名密钥进行提款。"
            />
            <MyAccordionItem
              index="bottom"
              title="我可以把密钥存在硬件钱包里吗？"
              info="对硬件钱包的支持究竟会如何发展到目前为止还是个问号，不过Ledger已经更新了其规范，以支持 Eth2 密钥。在未来，硬件钱包支持 Eth2 几乎是可以肯定的。"
            />
          </Accordion>
        </Box>
      </Flex>
    </Layout>
  )
}

export default Key03
