import React, { useEffect, useState } from "react"
import { Flex, Box,  Text,Spinner } from "@chakra-ui/react"
import { StaticImage } from "gatsby-plugin-image"
import IndexNav from "../components/indexNav"
import * as styles from "../css/index.module.css"
import axios from "axios"

const Index = () => {
  const [data1, setData1] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios("https://beaconcha.in/api/v1/epoch/latest")

      setData1(result.data.data)
    }

    fetchData(data1)
  }, [])

  return (
    <Box
      minH="100vh"
      minW="1440px"
      bgGradient="linear(to-r, #FFC2A6, #FFECE4)"
      overflow="hidden"
    >
      <Box minH="766px" position="relative">
        <IndexNav />
        <Box className={styles.firstbox}>
          <Box position="absolute" zIndex="60" top="-2rem" left="-6rem">
            <StaticImage
              src="../images/以太坊.png"
              width={600}
              quality={100}
              formats={["AUTO", "WEBP", "AVIF"]}
              alt="A Gatsby astronaut"
            />
          </Box>

          <Box position="absolute" zIndex="60" top="30%" right="15%">
            <StaticImage
              src="../images/user.png"
              width={800}
              quality={100}
              formats={["AUTO", "WEBP", "AVIF"]}
              alt="A Gatsby astronaut"
            />
          </Box>

          <Flex
            justifyContent="center"
            w="70%"
            right="0"
            bottom="-2.5rem"
            className={styles.showNumber}
            className={styles.showHeight}
            position="absolute"
            borderTop="2px solid transparent"
            style={{
              borderImage: "linear-gradient(to right, #FFCDB6, #FFC6B0)",
              borderImageSlice: "1",
            }}
          >
            <Flex w="40rem">
              {/* 以太网络验证者 */}
              <Box color="#222" textAlign="center" pt="2.5rem">
                <Box as="h2" fontSize="50px">
                  {" "}
                  {parseInt(data1.validatorscount).toLocaleString() === "NaN"
                    ? <Spinner />
                    : parseInt(data1.validatorscount).toLocaleString()}
                </Box>
                <Text fontSize="22px">以太坊网络验证者</Text>
              </Box>

              {/* eth质押总量 */}
              <Box color="#222" textAlign="center" pt="2.5rem" ml="10rem">
                <Box as="h2" fontSize="50px">
                  {" "}
                  {parseInt(
                    data1.eligibleether / 1000000000
                  ).toLocaleString() === "NaN"
                    ? <Spinner />
                    : parseInt(
                        data1.eligibleether / 1000000000
                      ).toLocaleString()}
                </Box>
                <Text fontSize="22px">ETH质押总量</Text>
              </Box>
            </Flex>
          </Flex>
        </Box>

        {/* 1500px weight */}
        {/* 900px height  */}

        <Box className={styles.sceond}>
          <Box position="absolute" zIndex="60" top="-2rem" left="-6rem">
            <StaticImage
              src="../images/以太坊.png"
              width={500}
              quality={100}
              formats={["AUTO", "WEBP", "AVIF"]}
              alt="A Gatsby astronaut"
            />
          </Box>

          <Box position="absolute" zIndex="60" top="28%" right="15%">
            <StaticImage
              src="../images/user.png"
              width={700}
              quality={100}
              formats={["AUTO", "WEBP", "AVIF"]}
              alt="A Gatsby astronaut"
            />
          </Box>

          <Flex
            justifyContent="center"
            w="70%"
            right="0"
            bottom="1rem"
            // className={styles.showNumber}
            // className={styles.showHeight}
            position="absolute"
            borderTop="2px solid transparent"
            style={{
              borderImage: "linear-gradient(to right, #FFCDB6, #FFC6B0)",
              borderImageSlice: "1",
            }}
          >
            <Flex w="40rem">
              {/* 以太网络验证者 */}
              <Box color="#222" textAlign="center" pt="2.5rem">
                <Box as="h2" fontSize="50px">
                  {" "}
                  {parseInt(data1.validatorscount).toLocaleString() === "NaN"
                    ? <Spinner />
                    : parseInt(data1.validatorscount).toLocaleString()}
                </Box>
                <Text fontSize="22px">以太坊网络验证者</Text>
              </Box>

              {/* eth质押总量 */}
              <Box color="#222" textAlign="center" pt="2.5rem" ml="10rem">
                <Box as="h2" fontSize="50px">
                  {" "}
               
                  {parseInt(data1.eligibleether / 1000000000).toLocaleString() === "NaN"
                    ? <Spinner />
                    : parseInt(data1.eligibleether / 1000000000).toLocaleString()}
                </Box>
                <Text fontSize="22px">ETH质押总量</Text>
              </Box>
            </Flex>
          </Flex>
        </Box>
      </Box>
    </Box>
  )
}

export default Index
