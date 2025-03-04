import { get, put, deletar, post } from '@/services/api-handler'

async function getCupom(codigoCupom: string) {
  try {
    const resposta = await get('Cupom/' + codigoCupom)
    return resposta
  } catch (error) {
    console.log(error)
  }
}

async function getCupons() {
  try {
    const resposta = await get('Cupom')
    return resposta
  } catch (error) {
    console.log(error)
  }
}

async function createCupom(cupom: any) {
  try {
    const resposta = await post('Cupom/', cupom)
    return resposta
  } catch (error) {
    console.log(error)
  }
}

async function updateCupom(cupom: any) {
  try {
    const resposta = await put('Cupom/' + cupom.id, cupom)
    return resposta
  } catch (error) {
    console.log(error)
  }
}
async function deleteCupom(id: string) {
  try {
    const resposta = await deletar('Cupom/' + id)
    return resposta
  } catch (error) {
    console.log(error)
  }
}

export { getCupom, getCupons, createCupom, updateCupom, deleteCupom }
