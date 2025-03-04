import { get, put, deletar, post } from '@/services/api-handler'

async function getProdutosAdmin() {
  try {
    const resposta = await get('Produto/GetAll')
    return resposta
  } catch (error) {
    console.log(error)
  }
}

async function getProdutosClient() {
  try {
    const resposta = await get('Produto')
    return resposta
  } catch (error) {
    console.log(error)
  }
}

async function getProduto(id: string) {
  try {
    const resposta = await get('Produto/' + id)
    return resposta
  } catch (error) {
    console.log(error)
  }
}

async function getProdutosEmEstoque(categoriaId: string, corId: string, nome: string) {
  try {
    const resposta = await get('Produto/' + categoriaId + '/' + corId + "/" + nome)
    return resposta
  } catch (error) {
    console.log(error)
  }
}

async function updateProduto(produtoId: string, produto: any) {
  try {
    const resposta = await put('Produto/' + produtoId, produto)
    return resposta
  }
  catch (ex) {
    console.log(ex)
  }
}

async function deleteProduto(id: string) {
  try {
    const resposta = await deletar('Produto/' + id)
    return resposta
  }
  catch (ex) {
    console.log(ex)
  }
}
async function addProduto(produto: any) {
  try {
    const resposta = await post('Produto', produto)
    return resposta
  }
  catch (ex) {
    console.log(ex)
  }
}


export {
  getProdutosAdmin, updateProduto, deleteProduto,
  addProduto, getProduto, getProdutosClient, getProdutosEmEstoque
}
