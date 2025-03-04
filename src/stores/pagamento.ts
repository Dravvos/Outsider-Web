import { get, post } from '@/services/api-handler'

async function getClientSecret(carrinhoId: string) {
  try {
    const resposta = await get('Pagamento/' + carrinhoId)
    return resposta
  } catch (error) {
    console.log(error)
  }
}

async function processarPagamento(carrinhoId: string, valor: number) {
  try {
    const resposta = await post('Pagamento/' + carrinhoId, valor as any)
    return resposta
  } catch (error) {
    console.log(error)
  }
}

export { getClientSecret, processarPagamento }
