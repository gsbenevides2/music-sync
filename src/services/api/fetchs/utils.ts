class OfflineError extends Error {
  code = 'Offline'
}

export class NotMoreError extends Error {
  code = 'NotMoreError'
}

export function networkTest() {
  return new Promise<'api' | 'db'>((resolve, reject) => {
    const offline = localStorage.getItem('offline')
    console.log(offline)
    if (navigator.onLine === true) resolve('api')
    else if (offline === 'true') resolve('db')
    else reject(new OfflineError())
  })
}
