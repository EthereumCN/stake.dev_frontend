import React from "react"
import Layout from "../components/layout"
import Casebox from "../components/generalEducationBox"
import { Box, Flex } from "@chakra-ui/react"
import { StaticImage } from "gatsby-plugin-image"

const GeneralEducation = () => {
  return (
    <Layout>
      {/* 质押者须知 */}
      <Box mt="2rem" mb="0.5rem">
        <StaticImage
          src="../images/zhi-ya-zhe-xu-zhi.png"
          width={140}
          quality={100}
          formats={["AUTO", "WEBP", "AVIF"]}
          alt="A Gatsby astronaut"
        />
      </Box>
      {/* 质押者须知  */}
      <Flex justifyContent="space-between" flexWrap="wrap">
        <Casebox
          title="了解Eth2质押程序"
          imglink="https://i.ibb.co/3S5F2Th/1.png"
          link="/tongshi/liao-jie-eth2-zhi-ya-cheng-xu-01/"
        />

        <Casebox
          title="Eth2 Staking系列：密钥篇"
          imglink="https://i.ibb.co/nR3CzmY/02.png"
          link="/tongshi/eth2-staking-xi-lie-mi-shi-pian-02/"
        />
        <Casebox
          title="解读以太坊2.0密钥"
          imglink="https://i.ibb.co/Fh5dNyf/03.png"
          link="/tongshi/jie-du-yi-tai-fang-2-mi-shi-03/"
        />
        <Casebox
          title="Eth2 验证者须知：
          如何判断“证明”的有效性"
          imglink="https://i.ibb.co/nR3CzmY/02.png"
          link="/tongshi/ru-he-pan-duan-zheng-ming-you-xiao-xing-04/"
        />
        <Casebox
          title="Eth2 Staking 系列：至善者，善之敌"
          imglink="https://i.ibb.co/6m4Ltk3/05.png"
          link="/tongshi/zhi-shan-zhe-shan-zhi-di-05/"
        />
        <Casebox
          title="Eth2 Staking 系列：
          为何客户端多样性如此重要"
          imglink="https://i.ibb.co/nBPD9d8/06.png"
          link="/tongshi/wei-he-ke-hu-duan-duo-yang-xing-ru-ci-zhong-yao-06/"
        />
        <Casebox
          title="以太坊2.0主网客户端性能比较"
          imglink="https://i.ibb.co/DDRDNf5/1.png"
          link="/tongshi/yi-tai-fang-2-zhu-wang-ke-hu-duan-xing-neng-bi-jiao-07/"
        />
        <Box w="360px"/>
      </Flex>
      {/* staking经济学  */}
      <Box mt="6rem"   mb="0.5rem">
        <StaticImage
          src="../images/staking.png"
          width={200}
          quality={100}
          formats={["AUTO", "WEBP", "AVIF"]}
          alt="A Gatsby astronaut"
        />
      </Box>
      <Flex justifyContent="space-between" flexWrap="wrap">
        <Casebox
          title="Staking 经济激励机制——以太坊2.0实例"
          imglink="https://i.ibb.co/VDpFFPx/01.png"
          link="/tongshi/yi-tai-fang-2-shi-li-08/"
        />
        <Casebox
          title="初始以太坊2.0经济激励机制"
          imglink="https://i.ibb.co/nR3CzmY/02.png"
          link="/tongshi/yi-tai-fang-2-jing=ji-ji-li-ji-zhi-09/"
        />
        <Casebox
          title="评估以太坊2.0经济安全性"
          imglink="https://i.ibb.co/nR3CzmY/02.png"
          link="/tongshi/ping-gu-yi-tai-fang-2-jing-ji-an-quan-xing-10/"
        />
        <Casebox
          title="Eth2 Staking系列：激励篇"
          imglink="https://i.ibb.co/nR3CzmY/02.png"
          link="/tongshi/eth-2-staking-ji-li-pian-11/"
        />
        <Casebox
          title="以太坊2.0质押池的代币经济 (上)：何为质押代币？"
          imglink="https://i.ibb.co/b3znKCc/1.png"
          link="/tongshi/yi-tai-fang-he-wei-zhi-ya-shang-12/"
        />
        <Casebox
          title="以太坊2.0质押池的代币经济 (下)：质押代币的运作方式"
          imglink="https://i.ibb.co/b3znKCc/1.png"
          link="/tongshi/yi-tai-fang-he-wei-zhi-ya-xia-13/"
        />
        <Box w="360px"/>
        <Box w="360px"/>
      </Flex>
      {/* 理念与机制  */}

      <Box  mt="6rem"  mb="0.5rem">
        <StaticImage
          src="../images/li-nian-yu-ji-zhi.png"
          width={140}
          quality={100}
          formats={["AUTO", "WEBP", "AVIF"]}
          alt="A Gatsby astronaut"
        />
      </Box>
      <Flex justifyContent="space-between" flexWrap="wrap">
        <Casebox
          title="Vitalik: 一种proof of stake设计哲学"
          imglink="https://i.ibb.co/cxd67RS/1.png"
          link="/tongshi/vitalik-14/"
        />
        <Casebox
          title="Vitalik: 区块链“验证”的哲学"
          imglink="https://i.ibb.co/8jwjTGb/1.png"
          link="/tongshi/vitalik-15/"
        />
        <Casebox
          title="Vitalik: 权益证明 vs. 工作量证明"
          imglink="https://i.ibb.co/SttfDh4/1.png"
          link="/tongshi/vitalik-16/"
        />
        <Casebox
          title="如何参与Eth2 Staking 系列 (开篇)"
          imglink="https://i.ibb.co/v3TtTtR/1.png"
          link="/tongshi/vitalik-17/"
        />
        <Casebox
          title="Eth2 Staking系列：共识机制篇"
          imglink="https://i.ibb.co/qsYHKK9/1.png"
          link="/tongshi/vitalik-18/"
        />
        <Casebox
          title="Eth2 Staking系列：分片共识"
          imglink="https://i.ibb.co/qsYHKK9/1.png"
          link="/tongshi/vitalik-19/"
        />
        <Box w="360px"/>
        <Box w="360px"/>
      </Flex>
    </Layout>
  )
}

export default GeneralEducation
