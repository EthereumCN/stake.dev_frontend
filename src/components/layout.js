import * as React from "react"
import Header from "./header"
import Footer from "./footer"
import { Flex, Box } from "@chakra-ui/react"

const Layout = ({ children }) => {
  return (
    <Flex
      // bgColor="#FFF8F5"

      background="linear-gradient(270deg, #F9F9F8, #FFF8F5 , #F8F8F8 )"
      minH="100vh"
      flexDirection="column"
      px="8rem"
      minW="1440px"
    >
      <Header />

      <Box flex="1">{children}</Box>
      <Footer />
    </Flex>
  )
}

export default Layout
