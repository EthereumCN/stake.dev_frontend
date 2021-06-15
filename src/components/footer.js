import React from "react"
import {
  Flex,
  Box,
  Heading,
  Link,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  Button,
} from "@chakra-ui/react"
import { Link as ReachLink } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"
import { FaDiscourse, FaDiscord } from "react-icons/fa"
import { AiFillWechat, AiOutlineTwitter } from "react-icons/ai"
const Footer = () => {
  return (
    <Box
      mt="6rem"
      pt="6rem"
      h="365px"
      mb="5rem"
      borderTop="2px solid transparent"
      style={{
        borderImage: "linear-gradient(to right, #f8f8f8, #e6e6e6 , #F8F8F8)",
        borderImageSlice: "1",
      }}
    >
      {/* 上部分 */}
      <Flex justifyContent="space-between">
        {/* <ReachLink to="/">
          <StaticImage
        src="../images/1111.png"
            width={100}
            quality={100}
            formats={["AUTO", "WEBP", "AVIF"]}
            alt="A Gatsby astronaut"
          />
        </ReachLink> */}

        <Flex flexDirection="column" minW="100%">
          <Flex
            // w="950px"
            // minW="100vw"
            minW="100%"
            justifyContent="space-between"
          >
            <Box>
              <ReachLink to="/">
                <StaticImage
                  src="../images/1111.png"
                  width={100}
                  quality={100}
                  formats={["AUTO", "WEBP", "AVIF"]}
                  alt="A Gatsby astronaut"
                />
              </ReachLink>
            </Box>
            {/* row1 */}
            <Box color="#333">
              <Box>
                {" "}
                <Heading fontSize="20px" fontWeight="600">
                  资源导航
                </Heading>{" "}
              </Box>
              <Box mt="1rem" fontSize="14px" color="#333" fontWeight="400">
                <ReachLink to="/tutorials">Staking 教程</ReachLink>
              </Box>
              <Box mt="1rem">
                <Link
                  fontSize="14px"
                  color="#333"
                  fontWeight="400"
                  href="https://launchpad.ethereum.org/"
                  isExternal
                >
                  ETH 2.0 Launchpad
                </Link>
              </Box>
              <Box mt="1rem">
                <Link
                  fontSize="14px"
                  color="#333"
                  fontWeight="400"
                  href="https://eth2.ethereum.cn/hello_eth2"
                  isExternal
                >
                  ETH 2.0 知识库
                </Link>
              </Box>
              <Box mt="1rem">
                {" "}
                <Link
                  fontSize="14px"
                  color="#333"
                  fontWeight="400"
                  href="https://www.ethereum.cn/Eth2"
                  isExternal
                >
                  ETH 2.0 生态动向
                </Link>
              </Box>
            </Box>
            {/* row2 */}
            <Box>
              <Box>
                <Heading fontSize="20px" fontWeight="600">
                  客户端
                </Heading>
              </Box>
              <Box mt="1rem">
                {" "}
                <Link
                  fontSize="14px"
                  color="#333"
                  fontWeight="400"
                  href="https://prysmaticlabs.com/"
                  isExternal
                >
                  Prysm
                </Link>
              </Box>
              <Box mt="1rem">
                {" "}
                <Link
                  fontSize="14px"
                  color="#333"
                  fontWeight="400"
                  href="https://lighthouse.sigmaprime.io/"
                  isExternal
                >
                  Lighthouse
                </Link>
              </Box>
              <Box mt="1rem">
                <Link
                  fontSize="14px"
                  color="#333"
                  fontWeight="400"
                  href="https://consensys.net/knowledge-base/ethereum-2/teku/"
                  isExternal
                >
                  Teku
                </Link>
              </Box>
              <Box mt="1rem">
                {" "}
                <Link
                  fontSize="14px"
                  color="#333"
                  fontWeight="400"
                  href="https://nimbus.team/"
                  isExternal
                >
                  Nimbus
                </Link>
              </Box>
            </Box>
            {/* row3 */}
            <Box>
              <Heading fontSize="20px" fontWeight="600">
                浏览器
              </Heading>
              <Box mt="1rem">
                <Link
                  fontSize="14px"
                  color="#333"
                  fontWeight="400"
                  href="https://beaconcha.in/"
                  isExternal
                >
                  Beaconcha.in
                </Link>
              </Box>
              <Box mt="1rem">
                {" "}
                <Link
                  fontSize="14px"
                  color="#333"
                  fontWeight="400"
                  href="https://beaconscan.com/"
                  isExternal
                >
                  BeaconScan
                </Link>
              </Box>
            </Box>
            {/* row4 */}
            <Box>
              <Box>
                {" "}
                <Heading fontSize="20px" fontWeight="600">
                  验证者收益计算器
                </Heading>
              </Box>
              <Box mt="1rem">
                {" "}
                <Link
                  fontSize="14px"
                  color="#333"
                  fontWeight="400"
                  href="https://beaconscan.com/staking-calculator"
                  isExternal
                >
                 Beaconscan calculator
                </Link>{" "}
              </Box>
              <Box mt="1rem">
                {" "}
                <Link
                  fontSize="14px"
                  color="#333"
                  fontWeight="400"
                  href="https://beaconcha.in/calculator"
                  isExternal
                >
                 Beaconcha.in calculator 
                </Link>{" "}
              </Box>
            </Box>
            {/* row5 */}
            <Box>
              <Heading fontSize="20px" fontWeight="600">
                节点监测运维
              </Heading>
              <Box mt="1rem">
                {" "}
                <Link
                  fontSize="14px"
                  color="#333"
                  fontWeight="400"
                  href="https://grafana.com/"
                  isExternal
                >
                  Grafana
                </Link>{" "}
              </Box>
              <Box mt="1rem">
                {" "}
                <Link
                  fontSize="14px"
                  color="#333"
                  fontWeight="400"
                  href="https://prometheus.io/"
                  isExternal
                >
                  Prometheus
                </Link>{" "}
              </Box>
            </Box>
          </Flex>
        </Flex>
      </Flex>

      <Flex mt="5rem" minW="100%" justifyContent="space-between">
        <Box w="5.5%" />
        <Flex>
          <Heading fontSize="20px" fontWeight="600">
            加入社区
          </Heading>
          <Link ml="2rem" fontSize="20px" fontWeight="600" isExternal  href="https://forum.weeth.org/">
            {" "}
            <FaDiscourse />{" "}
          </Link>
          {/* <Link ml="2rem" fontSize="20px" fontWeight="600"> */}

          <Popover>
            <PopoverTrigger>
              <button
                style={{
                  marginLeft: "2rem",
                  fontSize: "20px",
                  fontWeight: "600",
                }}
              >
                
                <AiFillWechat />
              </button>
            </PopoverTrigger>
            <PopoverContent
              w="50%"
              px="2rem"
              ml="5.5rem"
              _focus={{ outline: "none" }}
              _active={{ boxShadow: "none" }}
            >
              <PopoverBody minW="2rem">
                <Box m="auto 0">
                  <StaticImage
                    src="../images/WechatImg.jpeg"
                    width={80}
                    quality={100}
                    formats={["AUTO", "WEBP", "AVIF"]}
                    alt="A Gatsby astronaut"
                  />
                </Box>
              </PopoverBody>
            </PopoverContent>
          </Popover>
          {/* </Link> */}
          <Link ml="2rem" fontSize="20px" fontWeight="600"  isExternal  href="https://twitter.com/StakerWeeth">
            {" "}
            <AiOutlineTwitter />{" "}
          </Link>
          <Link ml="2rem" fontSize="20px" fontWeight="600" isExternal  href="https://discord.gg/s5eKP8ZN">
            {" "}
            <FaDiscord />{" "}
          </Link>
        </Flex>
        <Box w="20%" />
        <Box w="20%" />
      </Flex>
    </Box>
  )
}

export default Footer

{
  /* 加入社区 */
}

{
  /* <Flex mt="5rem" minW="100%" justifyContent="space-between">
  <Box opacity="0">
    <ReachLink to="/">
      <StaticImage
        src="../images/1111.png"
        width={100}
        quality={100}
        formats={["AUTO", "WEBP", "AVIF"]}
        alt="A Gatsby astronaut"
      />
    </ReachLink>
  </Box>
  <Flex>
    <Heading fontSize="20px" fontWeight="600">
      加入社区
    </Heading>
    <Link ml="2rem" fontSize="20px" fontWeight="600">
      {" "}
      <FaDiscourse />{" "}
    </Link>

    <Link ml="2rem" fontSize="20px" fontWeight="600">
      {" "}
      <AiFillWechat />{" "}
    </Link>
    <Link ml="2rem" fontSize="20px" fontWeight="600">
      {" "}
      <AiOutlineTwitter />{" "}
    </Link>
    <Link ml="2rem" fontSize="20px" fontWeight="600">
      {" "}
      <FaDiscord />{" "}
    </Link>
  </Flex>
</Flex> */
}
