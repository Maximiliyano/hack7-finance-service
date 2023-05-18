import { performOnceAuthReady } from './authGuardUtil'
import { authenticateWithRedirect } from './authenticateWithRedirect'

export function authGuard (alreadyAuthenticatedRedirectUrl) {
  return function (to, from, next) {
    return performOnceAuthReady(authenticateWithRedirect, {
      goingToPath: to.path,
      alreadyAuthenticatedRedirectUrl,
      redirectFunction: next
    })
  }
}
