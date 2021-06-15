import React from "react"
import Layout from "../components/layout"
import TutorialBox from "../components/tutorialBox"
import { Flex, Box, Image, Link } from "@chakra-ui/react"
import { StaticImage } from "gatsby-plugin-image"

const Tutorials = () => {
  return (
    <Layout>
      {/* 主网教程 */}
      <Box  mt="3rem"  mb="0.5rem">
        <StaticImage
          src="../images/zhu-wang-jiao-cheng.png"
          width={120}
          quality={100}
          formats={["AUTO", "WEBP", "AVIF"]}
          alt="A Gatsby astronaut"
        />
      </Box>
        {/* 主网教程 */}
      <Flex justifyContent="space-between" flexWrap="wrap">
      <TutorialBox title="Ubuntu/Prysm"  link="/tongshi/zhu-wang-21/">
          <StaticImage
              src="../images/1.png"
              width={60}
              quality={100}
              formats={["AUTO", "WEBP", "AVIF"]}
              alt="A Gatsby astronaut"
            />
          </TutorialBox>
          <TutorialBox title="Ubuntu/Lighthouse" link="/tongshi/zhu-wang-22/">
          <StaticImage
              src="../images/22.png"
              width={60}
              quality={100}
              formats={["AUTO", "WEBP", "AVIF"]}
              alt="A Gatsby astronaut"
            />
          </TutorialBox>
          <TutorialBox title="Ubuntu/Teku" link="/tongshi/zhu-wang-23/">
          <StaticImage
              src="../images/3.png"
              width={60}
              quality={100}
              formats={["AUTO", "WEBP", "AVIF"]}
              alt="A Gatsby astronaut"
            />
          </TutorialBox>
          <TutorialBox title="Ubuntu/Nimbus" link="/tongshi/zhu-wang-24/">
          <StaticImage
              src="../images/4.png"
              width={60}
              quality={100}
              formats={["AUTO", "WEBP", "AVIF"]}
              alt="A Gatsby astronaut"
            />
          </TutorialBox>
      </Flex>
      {/* 测试网教程 */}
      <Box mt="5rem"  mb="0.5rem">
        <StaticImage
          src="../images/ce-shi-wang-jiao-cheng.png"
          width={140}
          quality={100}
          formats={["AUTO", "WEBP", "AVIF"]}
          alt="A Gatsby astronaut"
        />
      </Box>
      {/* 质押者须知  */}
      <Flex justifyContent="space-between" flexWrap="wrap">
      <TutorialBox title="Ubuntu/Prysm" link="/tongshi/ce-shi-wang-25/">
          <StaticImage
              src="../images/1.png"
              width={60}
              quality={100}
              formats={["AUTO", "WEBP", "AVIF"]}
              alt="A Gatsby astronaut"
            />
          </TutorialBox>
          <TutorialBox title="Ubuntu/Lighthouse" link="/tongshi/ce-shi-wang-26/">
          <StaticImage
              src="../images/22.png"
              width={60}
              quality={100}
              formats={["AUTO", "WEBP", "AVIF"]}
              alt="A Gatsby astronaut"
            />
          </TutorialBox>
          <TutorialBox title="Ubuntu/Teku" link="/tongshi/ce-shi-wang-27/">
          <StaticImage
              src="../images/3.png"
              width={60}
              quality={100}
              formats={["AUTO", "WEBP", "AVIF"]}
              alt="A Gatsby astronaut"
            />
          </TutorialBox>
          <TutorialBox title="Ubuntu/Nimbus" link="/tongshi/ce-shi-wang-28/">
          <StaticImage
              src="../images/4.png"
              width={60}
              quality={100}
              formats={["AUTO", "WEBP", "AVIF"]}
              alt="A Gatsby astronaut"
            />
          </TutorialBox>
      </Flex>

      {/* 硬件配置 */}
      <Flex mt="5rem"  mb="0.5rem" justifyContent="space-around">
        {/* 硬件配置 */}
        <Flex flexDirection="column">
          <Box>
            <StaticImage
              src="../images/ying-jian-pei-zhi.png"
              width={130}
              quality={100}
              formats={["AUTO", "WEBP", "AVIF"]}
              alt="A Gatsby astronaut"
            />
          </Box>
          <TutorialBox title="以太坊2.0主网质押教学(Ubuntu/Prysm)"   link="/tongshi/ying-jian-pei-zhi-20/">
          <StaticImage
              src="../images/5.png"
              width={60}
              quality={100}
              formats={["AUTO", "WEBP", "AVIF"]}
              alt="A Gatsby astronaut"
            />
          </TutorialBox>
        </Flex>
        {/* 视频 */}
        <Flex ml="6rem" flexDirection="column" w="1200px">
          <Box>
            <StaticImage
              src="../images/shi-pin.png"
              width={80}
              quality={100}
              formats={["AUTO", "WEBP", "AVIF"]}
              alt="A Gatsby astronaut"
            />
          </Box>
          <Flex mt="2rem" >
            {/* 两条视频 */}
   
            <Link
              _focus={{ boxShadow: "none" }}
              w="400px"
              h="210px"
              href="https://www.bilibili.com/video/BV1x541157FC"
              isExternal
            >
              {" "}
              <Image
                borderRadius="10px"
                src={"https://i.ibb.co/njTyhKJ/2.png"}
                alt={"title"}
              />
            </Link>
            <Link
             
              ml="3rem"
              _focus={{ boxShadow: "none" }}
              w="400px"
              h="210px"
              href="https://www.bilibili.com/video/BV1d5411L7k9"
              isExternal
            >
              {" "}
              <Image
                borderRadius="10px"
                src={"https://i.ibb.co/rvBDX0w/1.png"}
                alt={"title"}
              />
            </Link>
           
          </Flex>
        </Flex>
      </Flex>
    </Layout>
  )
}

export default Tutorials
