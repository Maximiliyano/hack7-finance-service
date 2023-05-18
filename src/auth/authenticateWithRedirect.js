import { getInstance } from './index'

const ROOT_PATH = '/'

export function authenticateWithRedirect (redirectParameters) {
  if (isAlreadyAuthenticated() && isRedirectRequired(redirectParameters)) {
    redirectWithoutAuthentication(redirectParameters)
  } else if (!isAlreadyAuthenticated() && redirectParameters.goingToPath !== ROOT_PATH) {
    loginWithRedirect()
  } else {
    redirectParameters.redirectFunction()
  }
}

function isAlreadyAuthenticated () {
  return getInstance().isAuthenticated
}

function redirectWithoutAuthentication (redirectParameters) {
  redirectParameters.redirectFunction({
    path: redirectParameters.alreadyAuthenticatedRedirectUrl,
    replace: true
  })
}

function isRedirectRequired (redirectParameters) {
  return redirectParameters.alreadyAuthenticatedRedirectUrl
}

function loginWithRedirect () {
  getInstance().loginWithRedirect({
    prompt: 'select_account'
  })
}
