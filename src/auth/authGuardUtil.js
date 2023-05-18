import { getInstance } from './index'

export function performOnceAuthReady (callback, params) {
  const authService = getInstance()

  // If loading has already finished, check our auth state using `callback()`
  if (!authService.loading) {
    return callback(params)
  }

  // Watch for the loading property to change before we check isAuthenticated
  authService.$watch('loading', loading => {
    if (loading === false) {
      return callback(params)
    }
  })
}
