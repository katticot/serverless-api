import Store from '../posts_store'

const Posts = async () => {
  const posts = new Store()
  const body = JSON.stringify(await posts.all())
  const value = await NAMESPACE.get("first-key")
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-type': 'application/json'
  }
  return new Response(body, { headers })
}

export default Posts