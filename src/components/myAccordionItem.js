import React from "react"
import {
  Box,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
} from "@chakra-ui/react"
import { CloseIcon, AddIcon } from "@chakra-ui/icons"
const MyAccordionItem = ({ title, info, index }) => {
  return (
    <AccordionItem
      borderTop={index === "top" ? "none" : ""}
      borderBottom={index === "bottom" ? "none" : ""}
    >
      {({ isExpanded }) => (
        <>
          <Box as="h2">
            <AccordionButton py="1.4rem" _focus={{ boxShadow: "none" }}>
              <Box flex="1" textAlign="left" pl="2rem" fontSize="18px" fontWeight="400">
                {title}
              </Box>
              {isExpanded ? (
                <CloseIcon fontSize="12px" mr="2rem" />
              ) : (
                <AddIcon fontSize="12px"mr="2rem"/>
              )}
            </AccordionButton>
          </Box>
          <AccordionPanel pb={4} fontSize="15px">
            {info}
          </AccordionPanel>
        </>
      )}
    </AccordionItem>
  )
}

export default MyAccordionItem
