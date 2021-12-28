export interface Message {
  text: string
  type: 'warn' | 'error' | 'success'
  action?: () => void
}
export const messages = {
  SessionNotFound: {
    type: 'error',
    text: 'Ocorreu um erro de autenticação. Sua sessão não foi encontrada. Deverá se reautenticar!',
    action: () => {
      localStorage.clear()
      window.location.href = window.location.origin
    }
  },
  TokenInvalid: {
    type: 'error',
    text: 'Ocorreu um erro de autenticação. Seu token não é mais valido. Deverá se reautenticar!',
    action: () => {
      localStorage.clear()
      window.location.href = window.location.origin
    }
  },
  MusicCreated: {
    type: 'success',
    text: 'Música adicionada com sucesso!'
  },
  MusicAlreadyExists: {
    type: 'warn',
    text: 'A música já existe!'
  },
  SelectYoutubeMusic: {
    type: 'warn',
    text: 'Música não encontrada no Youtube. Escolha uma música do Youtube.'
  },
  NotLoadAllMusics: {
    type: 'error',
    text: 'Não foi possivel carregar todas as músicas!'
  },
  NotLoadAllAlbums: {
    type: 'error',
    text: 'Não foi possivel carregar todas os albums!'
  },
  NotLoadAllArtists: {
    type: 'error',
    text: 'Não foi possivel carregar todas os artistas!'
  }
}

export type MessagesKeys = keyof typeof messages
