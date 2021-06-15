import React from 'react'
import { ChakraProvider } from "@chakra-ui/react"

export const wrapRootElement = ({ element }) => {
  return (
    <ChakraProvider>
      {element}
    </ChakraProvider>
  )
}
