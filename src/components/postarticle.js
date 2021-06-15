import React from "react"
import Content from "../components/content"
import { Box, Heading, Text, Divider, Flex } from "@chakra-ui/react"
import { ArrowLeftIcon, ArrowRightIcon } from "@chakra-ui/icons"
import { Link } from "gatsby"

const Postarticle = ({ data, pageContext }) => {
  const post = data.markdownRemark
  const { previous, next } = pageContext

  return (
    <>
      <Box
        w="100%"
        maxW={800}
        mx="auto"
        px="30px"
        // pt={["20px", "20px", "50px", "10vh"]}
        mb={["3vh", "3vh", "5vh", "5vh"]}
      >
        <Heading
          lineHeight="7vh"
          fontWeight="700"
          fontFamily="NotoSansSC-Medium"
        >
          {post.frontmatter.title}
        </Heading>

        <Text
          fontSize="1rem"
          color="#a8a9a6"
          mt="4vh"
          mb="4vh"
          lineHeight="3.25vh"
        >
          {post.frontmatter.description}
        </Text>
        <Divider />

        <Content input={post.html} />
        <Divider />

        {/* flex布局 */}
        <Flex
          justifyContent={["center", "center", "space-between", "space-between"]}
          mt="5rem"
          flexWrap="wrap"
        >
          {/* 上一页 */}
          {next && (
            <Box
              w={["40%", "40%", "40%", "40%"]}
              h="100%"
              mt={["5vh", "5vh", "5vh", "0"]}
            >
              <Link to={next.fields.slug} rel="next">
                <Flex justifyContent="flex-start">
                <ArrowLeftIcon mt="0.5rem" fontSize="24px" color="#9DAAB6" />
                  <Box ml="2rem">
                    <Text fontSize="12px" fontWeight="400" color="#9DAAB6">
                      Previous
                    </Text>
                    <Text fontSize="18px" fontWeight="500">
                      {next.frontmatter.title}
                    </Text>
                  </Box>
                </Flex>
              </Link>
            </Box>
          )}

          {previous && next && (
            <Box
              w={["40%", "40%", "40%", "40%"]}
              h="100%"
              mt={["5vh", "5vh", "5vh", "0"]}
            >
              <Link to={previous.fields.slug} rel="next">
                <Flex justifyContent="flex-end">
                  <Box mr="2rem">
                    <Text
                      fontSize="12px"
                      fontWeight="400"
                      color="#9DAAB6"
                      textAlign="right"
                    >
                      Next
                    </Text>
                    <Text fontSize="18px" fontWeight="500">
                      {previous.frontmatter.title}
                    </Text>
                  </Box>
                
                  <ArrowRightIcon mt="0.5rem" fontSize="24px" color="#9DAAB6" />
                </Flex>
              </Link>
            </Box>
          )}
        </Flex>

        {/* 解决首页底部导航排版问题 */}
        {!(next && previous) && previous && (
          <Box
            w={["100%", "100%", "80%", "40%"]}
            h="100%"
            mt={["5vh", "5vh", "5vh", "0"]}
            float="right"
          >
            <Link to={previous.fields.slug} rel="next">
              <Flex justifyContent="flex-end">
                <Box mr="2rem">
                  <Text
                    fontSize="12px"
                    fontWeight="400"
                    color="#9DAAB6"
                    textAlign="right"
                  >
                    Next
                  </Text>
                  <Text fontSize="18px" fontWeight="500">
                    {previous.frontmatter.title}
                  </Text>
                </Box>
                <ArrowRightIcon mt="0.5rem" fontSize="24px" color="#9DAAB6" />
              </Flex>
            </Link>
          </Box>
        )}
      </Box>
    </>
  )
}

export default Postarticle
