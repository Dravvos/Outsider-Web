import { get, put, deletar, post } from '@/services/api-handler'


async function getCarrinhoByUser(userId: string) {
  try {
    const resposta = await get('Carrinho/GetByUser/' + userId)
    return resposta
  } catch (error) {
    console.log(error)
  }
}

async function updateCarrinho(item: any) {
  try {
    const resposta = await put('Carrinho', item)
    return resposta
  } catch (ex) {
    console.log(ex)
  }
}

async function removerDoCarrinho(itemId: string) {
  try {
    const resposta = await deletar('Carrinho/' + itemId)
    return resposta
  } catch (ex) {
    console.log(ex)
  }
}

async function limparCarrinho(userId: string) {
  try {
    const resposta = await deletar('Carrinho/LimparCarrinho/' + userId)
    return resposta
  } catch (ex) {
    console.log(ex)
  }
}


async function adicionarAoCarrinho(item: any) {
  try {
    const resposta = await post('Carrinho', item)
    return resposta
  } catch (ex) {
    console.log(ex)
  }
}


async function aplicarCupom(usuarioId: string, cupom: string) {
  try {
    const resposta = await post('Carrinho/AplicarCupom/' + usuarioId + '/' + cupom)
    return resposta
  } catch (ex) {
    console.log(ex)
  }
}


async function removerCupom(usuarioId: string) {
  try {
    const resposta = await deletar('Carrinho/RemoverCupom/' + usuarioId)
    return resposta
  } catch (ex) {
    console.log(ex)
  }
}

async function checkout(item: any) {
  try {
    const resposta = await post('Carrinho/Checkout', item)
    return resposta
  } catch (ex) {
    console.log(ex)
  }
}

export {
  updateCarrinho, checkout,
  removerDoCarrinho,
  limparCarrinho,
  adicionarAoCarrinho,
  getCarrinhoByUser,
  aplicarCupom, removerCupom
}
