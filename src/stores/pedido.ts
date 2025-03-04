import { get, post } from '@/services/api-handler'

async function getByUser(userId: string) {
  try {
    const resposta = await get('Pedido/' + userId)
    return resposta
  } catch (error) {
    console.log(error)
  }
}


export { getByUser }
