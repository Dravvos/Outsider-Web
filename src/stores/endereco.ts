import { get, put, deletar, post } from '@/services/api-handler'

async function getEndereco(id: string) {
  try {
    const resposta = await get('Endereco/' + id)
    return resposta
  } catch (error) {
    console.log(error)
  }
}

async function getEnderecos(usuarioId: string) {
  try {
    const resposta = await get('Endereco/' + usuarioId)
    return resposta
  } catch (error) {
    console.log(error)
  }
}

async function createEndereco(endereco: any) {
  try {
    const resposta = await post('Endereco/', endereco)
    return resposta
  } catch (error) {
    console.log(error)
  }
}

async function updateEndereco(endereco: any) {
  try {
    const resposta = await put('Endereco/' + endereco.id, endereco)
    return resposta
  } catch (error) {
    console.log(error)
  }
}
async function deleteEndereco(id: string) {
  try {
    const resposta = await deletar('Endereco/' + id)
    return resposta
  } catch (error) {
    console.log(error)
  }
}

export { getEndereco, getEnderecos, createEndereco, updateEndereco, deleteEndereco }
