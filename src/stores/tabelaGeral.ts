import { get, put, deletar, post } from '@/services/api-handler'

async function getTabelasGerais(TabelaGeralId: any) {
  try {
    const resposta = await get('TabelaGeral/GetTabelasGeraisItems?tabelaGeralId=' + TabelaGeralId)
    return resposta
  } catch (error) {
    console.log(error)
  }
}

async function getTabelaGeral(nome: string) {
  try {
    const resposta = await get('TabelaGeral/GetTabelaGeralByNome/' + nome)
    return resposta
  } catch (error) {
    console.log(error)
  }
}

async function updateTabelaGeralItem(tabelaGeralItemId: any, item: any) {
  try {
    const resposta = await put('TabelaGeral/UpdateTabelaGeralItem/' + tabelaGeralItemId, item)
    return resposta
  }
  catch (ex) {
    console.log(ex)
  }
}

async function deleteTabelaGeralItem(id: any) {
  try {
    const resposta = await deletar('TabelaGeral/DeleteTabelaGeralItem/' + id)
    return resposta
  }
  catch (ex) {
    console.log(ex)
  }
}
async function addTabelaGeral(tg: any, tgi: any) {
  try {
    var resposta = await post('TabelaGeral/AddTabelaGeral', tg)
    if (resposta.status == 200 || resposta.status == 201) {
      console.log(resposta)
      tgi.TabelaGeralId = resposta.data.id;
      resposta = await post('TabelaGeral/AddTabelaGeralItem', tgi)

    }
    return resposta
  }
  catch (ex) {
    console.log(ex)
  }
}

async function addTabelaGeralItem(tgi: any) {
  try {

    const resposta = await post('TabelaGeral/AddTabelaGeralItem', tgi)
    return resposta
  }
  catch (ex) {
    console.log(ex)
  }
}

export {
  getTabelasGerais, updateTabelaGeralItem, deleteTabelaGeralItem,
  addTabelaGeral, addTabelaGeralItem, getTabelaGeral
}
