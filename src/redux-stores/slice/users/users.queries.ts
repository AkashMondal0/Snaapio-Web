export const QUsers = {
  findUsersByKeyword: `query FindUsersByKeyword($graphQLPageQuery: GraphQLPageQuery!) {
  findUsersByKeyword(graphQLPageQuery: $graphQLPageQuery) {
    username
    email
    id
    name
    profilePicture
  }
}`
}