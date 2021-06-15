import React from "react"
import styled from "@emotion/styled"
import { useColorMode } from "@chakra-ui/react"

const Wrapper_light = styled.div`
  p{
    font-size: 14px;
    margin-bottom: 0.2rem
  }

  ul {
    color: rgb(99, 100, 104);
    list-style-type: none;
  }

  a {
    font-size: 14px;
    line-height: 1.5;
    display: block;
  }

  a:hover {
    color: #ff7900;
  }

  ul ul {
    margin-left: 0.8rem;
    color: #999;
  }


  ul > li {
    margin-bottom: 0.3rem;
  }
`

const Wrapper_dark = styled.div`
  ul {
    color: rgb(99, 100, 104);
    list-style-type: none;
  }



  a {
    font-size: 12px;
    font-weight: 500;
    line-height: 1.5;
    display: block;
  }
  a:hover {
    color: #ff7900;
  }

  ul ul {
    margin-left: 1rem;
    color: #999;
  }

  ul > li {
    margin-bottom: 0.3rem;
  }
`

const RightSidebar = ({ input }) => {
  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <>
      {colorMode === "light" ? (
        <Wrapper_light dangerouslySetInnerHTML={{ __html: input }} />
      ) : (
        <Wrapper_dark dangerouslySetInnerHTML={{ __html: input }} />
      )}
    </>
  )
}

export default RightSidebar
