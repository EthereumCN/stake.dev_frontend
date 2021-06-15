import React from "react"
import { Box, Text, Image, Flex } from "@chakra-ui/react"
import { Link as ReachLink } from "gatsby"
const GeneralEducationBox = ({ title, imglink, link }) => {
  return (
    <ReachLink to={link}>
      <Box
        flex="1"
        w="33.3%"
        maxW="33.3%"
        minW="33.3%"
        _hover={{
          borderRadius: "4px",
          boxShadow: "0 8px 17px rgb(169 167 167 / 50%)",
          transition: "transform .1s ease 0s",
          transform: "scale(1.02)",
        }}
      >
        <Box
          margin="0 auto"
          w="360px"
          height="300px"
          background="#fff"
          boxShadow="0px 2px 10px 0px rgba(5, 5, 5, 0.14)"
          borderRadius="10px"
          mt="2rem"
          cursor="pointer"
        >
          <Image
            borderTopLeftRadius="10px"
            borderTopRightRadius="10px"
            w="100%"
            h="208px"
            src={imglink}
            alt={title}
          />

          <Flex h="20%" mt="1rem" alignItems="center">
            <Text
              px="4rem"
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

export default GeneralEducationBox
