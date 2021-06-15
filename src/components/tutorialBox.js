import React from "react"
import { Box, Text, Image, Flex } from "@chakra-ui/react"
import { Link as ReachLink } from "gatsby"
const TutorialBox = ({ title, children, link }) => {
  return (
    <ReachLink to={link}>
      <Box flex="1" w="20%" maxW="20%" minW="20%" >
        <Box
          _hover={{
            borderRadius: "4px",
            boxShadow: "0 8px 17px rgb(169 167 167 / 50%)",
            transition: "transform .1s ease 0s",
            transform: "scale(1.02)",
          }}
          margin="0 auto"
          w="272px"
          height="210px"
          background="#fff"
          boxShadow="0px 2px 10px 0px rgba(5, 5, 5, 0.14)"
          borderRadius="10px"
          mt="2rem"
          cursor="pointer"
        >
          {/* <Image borderTopLeftRadius="10px" borderTopRightRadius="10px" w="50%" h="50%" src={imglink} alt={title} /> */}
          <Flex alignItems="center">
            <Box as="span" m="0 auto" pt="20%">
              {/* <StaticImage
              src="../images/1.png"
              width={60}
              quality={100}
              formats={["AUTO", "WEBP", "AVIF"]}
              alt="A Gatsby astronaut"
            /> */}
              {children}
            </Box>
          </Flex>
          <Flex h="20%" alignItems="center">
            <Text
              margin="0 auto"
              textAlign="center"
              color="#333333"
              fontWeight="500"
              fontSize="18px"
            >
              {title}
            </Text>
          </Flex>
        </Box>
      </Box>
    </ReachLink>
  )
}

export default TutorialBox
