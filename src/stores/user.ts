import { getCookie } from '../services/cookie-handler'
import { jwtDecode } from 'jwt-decode'

function isAuthenticated(): boolean {
  try {
    return getCookie(import.meta.env.VITE_COOKIENAME) != undefined
  } catch {
    return false
  }
}

function getUserData() {
  if (isAuthenticated()) return jwtDecode(getCookie(import.meta.env.VITE_COOKIENAME)) as any
  else return ''
}

const getUserEmail = () => getUserData().email

const getUserName = () => (getUserData() == '' ? '' : getUserData().name)

const getUserInitials = () => {
  if (getUserName() == '') {
    return ''
  } else {
    const primeiraLetraNome = getUserName().substring(0, 1)
    const indexEspaco = getUserName().indexOf(' ')
    const primeiraLetraSobrenome = getUserName().substring(indexEspaco)
    return primeiraLetraNome + primeiraLetraSobrenome
  }
}

export { isAuthenticated, getUserData, getUserEmail, getUserName, getUserInitials }
