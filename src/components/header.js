import React from "react"
import { Flex, Box, Text, Link } from "@chakra-ui/react"
import { StaticImage } from "gatsby-plugin-image"
import { Link as ReachLink } from "gatsby"
import { Location, useLocation } from "@reach/router"

const Header = () => {
  const { href, pathname } = useLocation()
  return (
    <Flex alignItems="center" justifyContent="space-between" py="2rem">
      {/* img */}
      <Flex alignItems="center">
        <ReachLink to="/">
          <StaticImage
            src="../images/1111.png"
            width={50}
            quality={100}
            formats={["AUTO", "WEBP", "AVIF"]}
            alt="A Gatsby astronaut"
          />
        </ReachLink>
        <Flex
          as="nav"
          mx="5rem"
          fontWeight="500"
          color="#333"
          w="15rem"
          justifyContent="space-between"
        >
          <Box
            color={pathname === "/generalEducation" ? "#EF7B1D" : "#000"}
            _hover={{ color: "#EF7B1D" }}
          >
            <ReachLink to="/generalEducation">通识</ReachLink>
          </Box>
          <Box
            color={pathname === "/tutorials" ? "#EF7B1D" : "#000"}
            _hover={{ color: "#EF7B1D" }}
          >
            <ReachLink to="/tutorials">教程</ReachLink>
          </Box>
          <Box
            color={pathname === "/faq" ? "#EF7B1D" : "#000"}
            _hover={{ color: "#EF7B1D" }}
          >
            <ReachLink to="/faq">FAQ</ReachLink>
          </Box>
          <Box _hover={{ color: "#EF7B1D" }}>
            <Link
              _focus={{ boxShadow: "none" }}
              href="https://eth2.ethereum.cn/eth2-glossary"
              isExternal
            >
              术语
            </Link>
          </Box>
        </Flex>
      </Flex>

      <Text
        cursor="pointer"
        color="#fff"
        boxShadow="0px 4px 8px 0px rgba(1, 98, 159, 0.49);"
        bgColor="#2592FF"
        px="1rem"
        fontWeight="800"
        minW="80px"
        py="0.2rem"
        borderRadius="4px"
        textAlign="center"
      >
        <Link
          _focus={{ boxShadow: "none" }}
          href="https://forum.weeth.org/"
          isExternal
        >
          进入论坛
        </Link>
      </Text>
    </Flex>
  )
}

export default Header
