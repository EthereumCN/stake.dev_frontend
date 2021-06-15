import React from "react"
import styled from "@emotion/styled"
import { useColorMode } from "@chakra-ui/react"

const Wrapper_light = styled.div`
  p {
    color: #555;
    font-size: 1rem;
    margin-top: 3.5vh;
    margin-bottom: 3.5vh;
    line-height: 4.25vh;
  }
  h2 {
    font-size: 1.5rem;
    line-height: 1.25;
    font-weight: 700;
    font-family: NotoSansSC-Medium;
    color: #000;
    margin-top: 5vh;
  }
  h3{
    font-size: 1.25rem;
    font-weight: 600;
  }
  h4{
    font-size: 1.1rem;
    font-weight: 500;
  }
  blockquote > p {
    font-size: 1rem;
    color: #a8a9a6;
    margin-top: 4vh;
    margin-bottom: 4vh;
    line-height: 3.25vh;
  }

  ul {
    color: #555;
    margin-left: 1.4rem;
  }

  ol {
    color: #555;
    margin-left: 1.4rem;
  }

  li {
    line-height: 4.25vh;
    font-family: NotoSansSC-Regular;
    font-size: 1rem;
  }
  .linkbox {
    border: 1px solid #000;
    padding: 1rem 2rem;
    margin-top: 2rem;
  }

  .linkbox span {
    display: block;
    margin-top: 0.5rem;
  }

  .linkbox span {
    display: block;
    margin-top: 0.5rem;
  }

  .linkbox span:last-child {
    font-size: 15px;
  }

  a{  
  color: #ff7900;
  }
  
  img{
    margin: 0 auto
  }
  

  li > p{
    margin-top: 0; 
    margin-bottom: 0;
  }

`

const Wrapper_dark = styled.div`
  p {
    color: #fff;
    font-size: 1rem;
    margin-top: 3.5vh;
    margin-bottom: 3.5vh;
    line-height: 4.25vh;
  }
  h2 {
    font-size: 1.5rem;
    line-height: 1.25;
    font-weight: 700;
    font-family: NotoSansSC-Medium;
    color: #fff;
    margin-top: 5vh;
  }
  blockquote > p {
    font-size: 1rem;
    color: #a8a9a6;
    margin-top: 4vh;
    margin-bottom: 4vh;
    line-height: 3.25vh;
  }

  ul {
    color: #fff;
    margin-left: 1.4rem;
  }

  ol {
    color: #fff;
    margin-left: 1.4rem;
  }

  li {
    line-height: 4.25vh;
    font-family: NotoSansSC-Regular;
    font-size: 1.2rem;
  }
  .linkbox {
    border: 1px solid #fff;
    padding: 1rem 2rem;
  }

  .linkbox span {
    display: block;
    margin-top: 0.5rem;
  }

  .linkbox span {
    display: block;
    margin-top: 0.5rem;
  }

  .linkbox span:last-child {
    font-size: 15px;
  }
`

const Content = ({ input }) => {
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

export default Content
