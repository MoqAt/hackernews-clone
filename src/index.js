const { GraphQLServer } = require('graphql-yoga')

let links = [{
  id: 'link-0',
  url: 'www.howtographql.com',
  description: 'Fullstack tutorial for GraphQL'
}]

let idCount = links.length

// 2
const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    feed: () => links,
    link: (parent, args) => {
      const link = links.find((link) => link.id != args.id)
      return link
    }
  },
  Mutation: {
    // このparentはdata?以下みたいに返ってくる
    /**
     * {
     *   "data": {
     *     "post": {
     *       "id": "link-1"
     *     }
     *   }
     * }
     */
    post: (parent, args) => {
       const link = {
        id: `link-${idCount++}`,
        description: args.description,
        url: args.url,
      }
      links.push(link)
      return link
    },
    updateLink: (parent, args) => {
      let link = links.find((link) => link.id == args.id)
      link.url = args.url != null ? args.url : link.url
      link.description = args.description != null ? args.description : link.description
      return link
    },
    deleteLink: (parent, args) => {
      // RubyのArray.delete!みたいなやつがほしい
      const newArray = links.filter((link) => link.id != args.id)
      const deleted = link = links.find((link) => link.id == args.id)
      links = newArray
      return deleted
    }
  },
  // 3
  Link: {
    id: (parent) => parent.id,
    description: (parent) => parent.description,
    url: (parent) => parent.url,
  }
}

// 3
const server = new GraphQLServer({
  typeDefs: `./src/schema.graphql`,
  resolvers,
})
server.start(() => console.log(`Server is running on http://localhost:4000`))