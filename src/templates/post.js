import React from "react"
import { graphql } from "gatsby"
import SEO from "react-seo-component"
// import SEO from "../components/seo"
import Postarticle from "../components/postarticle"
import Layout from "../components/layout"
import Fab from "@material-ui/core/Fab"
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp"
import Zoom from "@material-ui/core/Zoom"
import { makeStyles } from "@material-ui/core/styles"
import useScrollTrigger from "@material-ui/core/useScrollTrigger"
import Toolbar from "@material-ui/core/Toolbar"
import { Box } from "@chakra-ui/react"
import { AiOutlineAlignLeft } from "react-icons/ai"
import { Text } from "@chakra-ui/react"
import rightSide from "../css/post.module.css"

// back to top
const useStyles = makeStyles(theme => ({
  root: {
    position: "fixed",
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
}))

function ScrollTop(props) {
  const { children, window } = props
  const classes = useStyles()
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
    disableHysteresis: true,
    threshold: 100,
  })

  const handleClick = event => {
    const anchor = (event.target.ownerDocument || document).querySelector(
      "#back-to-top-anchor"
    )

    if (anchor) {
      anchor.scrollIntoView({ behavior: "smooth", block: "center" })
    }
  }

  return (
    <Zoom in={trigger}>
      <div onClick={handleClick} role="presentation" className={classes.root}>
        {children}
      </div>
    </Zoom>
  )
}

// main function
const BlogPostTemplate = ({ data, pageContext }, props) => {
  //  文章内容
  const post = data.markdownRemark

  const { siteMetadata } = data.site

  return (
    <>
      <Layout>
        {/* <SEO title={post.frontmatter.title} /> */}
        <SEO
          title={post.frontmatter.title}
          titleTemplate={siteMetadata.title}
          description={post.frontmatter.description}
          image={"https://i.ibb.co/0ZRbzxT/gatsby-icon-copy.png"}
          pathname={"https://eth2.ethereum.cn/" + post.frontmatter.path}
          article={true}
          siteLanguage={siteMetadata.siteLanguage}
          siteLocale={siteMetadata.siteLocale}
          twitterUsername={siteMetadata.twitterUsername}
          author={post.frontmatter.author}
          publishedDate={post.frontmatter.date}
          modifiedDate={new Date(Date.now()).toISOString()}
        />

        {/* 向上锚点 */}
        <Toolbar id="back-to-top-anchor" />
        <Postarticle
          style={{ display: "inline" }}
          data={data}
          pageContext={pageContext}
        />

        {/* table */}

        {/* back to top */}
        <ScrollTop {...props}>
          <Fab color="primary" size="small" aria-label="scroll back to top">
            <KeyboardArrowUpIcon />
          </Fab>
        </ScrollTop>
      </Layout>
    </>
  )
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      frontmatter {
        title
        author
        path
        date(formatString: "YYYY-MM-DD")
        description
      }
      html
      tableOfContents
    }

    site {
      siteMetadata {
        title
        description
        author
        keywords
        siteLanguage
        siteLocale
        siteUrl
        twitterUsername
      }
    }
  }
`
