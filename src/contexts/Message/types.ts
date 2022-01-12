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
  },
  SpotifyOK: {
    type: 'success',
    text: 'Autenticação com Spotify realizada com sucesso!'
  },
  YoutubeOK: {
    type: 'success',
    text: 'Autenticação com Youtube realizada com sucesso!'
  },
  PlaylistCreated: {
    type: 'success',
    text: 'Playlist criada com sucesso!'
  },
  UnknowError: {
    type: 'error',
    text: 'Ocorreu um erro desconhecido. Tente novamente mais tarde.'
  },
  MusicAddedToPlaylist: {
    type: 'success',
    text: 'Música adicionada a playlist!'
  },
  MusicDeleted: {
    type: 'success',
    text: 'Música deletada com sucesso!'
  },
  PlaylistDeleted: {
    type: 'success',
    text: 'Playlist deletada com sucesso!'
  },
  MusicRemovedFromPlaylist: {
    type: 'success',
    text: 'Música removida com sucesso da playlist!'
  },
  SongAlreadyPlaylist: {
    type: 'error',
    text: 'A música já está nessa playlist.'
  },
  InvalidYoutubeVideo: {
    type: 'error',
    text: 'Video invalido, tente um outro link.'
  },
  Offline: {
    type: 'error',
    text: 'Você está sem intenet!'
  }
}

export type MessagesKeys = keyof typeof messages
