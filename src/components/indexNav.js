import React from "react"
import { Flex, Box, Heading, Link, Text } from "@chakra-ui/react"
import { Link as ReachLink } from "gatsby"
import BackgroundImage from "gatsby-background-image"
import { StaticImage } from "gatsby-plugin-image"

const IndexNav = () => {
  return (
    <Flex
      zIndex="100"
      alignItems="center"
      justifyContent="space-around"
      py="2rem"
    >
      {/* img */}
      <Box zIndex="100" pl="2rem">
        <ReachLink to="/">
          <StaticImage
            src="../images/1111.png"
            width={80}
            quality={100}
            formats={["AUTO", "WEBP", "AVIF"]}
            alt="A Gatsby astronaut"
          />
        </ReachLink>
      </Box>
      <Flex
        zIndex="100"
        as="nav"
        fontWeight="500"
        color="#B17D69"
        justifyContent="space-between"
        fontSize="18px"
        w="25rem"
      >
        <Box _hover={{ color: "#EF7B1D" }}>
          <ReachLink to="/generalEducation">通识</ReachLink>
        </Box>
        <Box _hover={{ color: "#EF7B1D" }} mx="1rem">
          <ReachLink to="/tutorials">教程</ReachLink>
        </Box>
        <Box _hover={{ color: "#EF7B1D" }}>
          <ReachLink to="/faq">FAQ</ReachLink>
        </Box>
        <Box _hover={{ color: "#EF7B1D" }} mx="1rem">
          <Link
            _focus={{ boxShadow: "none" }}
            href="https://eth2.ethereum.cn/eth2-glossary"
            isExternal
          >
            术语
          </Link>
        </Box>
        <Box
          cursor="pointer"
          color="#fff"
          boxShadow="0px 4px 8px 0px rgba(1, 98, 159, 0.49);"
          bgColor="#2592FF"
          borderRadius="4px"
          textAlign="center"
          px="1rem"
          minW="80px"
          
          fontWeight="800"
        >
          <Link
            _focus={{ boxShadow: "none" }}
            href="https://forum.weeth.org/"
            isExternal
          >
            论坛
          </Link>
        </Box>
      </Flex>
    </Flex>
  )
}

export default IndexNav
