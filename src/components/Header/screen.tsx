import {
  MdHome,
  MdPerson,
  MdAlbum,
  MdSettings,
  MdPlaylistPlay
} from 'react-icons/md'

export const screens = [
  {
    path: '/dashboard',
    name: 'Home',
    title: 'Seja Bem Vindo Guilherme🎧',
    showMenu: true,
    icon: MdHome,
    showBack: false
  },
  {
    path: '/dashboard/artists',
    name: 'Artistas',
    title: 'Todos os Artistas',
    showMenu: true,
    icon: MdPerson,
    showBack: false
  },
  {
    path: '/dashboard/albums',
    name: 'Album',
    title: 'Todos os Albums',
    showMenu: true,
    icon: MdAlbum,
    showBack: false
  },
  {
    path: '/dashboard/playlists',
    name: 'Playlists',
    title: 'Todas as Playlists',
    showMenu: true,
    icon: MdPlaylistPlay,
    showBack: false
  },
  {
    path: '/dashboard/settings',
    name: 'Configurações',
    title: 'Configurações',
    showMenu: true,
    icon: MdSettings,
    showBack: false
  },
  {
    path: '/dashboard/addMusic',
    title: 'Adicionar Música',
    showMenu: false,
    showBack: true
  },
  {
    path: '/dashboard/album/:id',
    title: 'Carregando Album',
    showMenu: false,
    showBack: true
  },
  {
    path: '/dashboard/playlist/:id',
    title: 'Carregando Playlist',
    showMenu: false,
    showBack: true
  },
  {
    path: '/dashboard/artist/:id',
    title: 'Carregando Artista',
    showMenu: false,
    showBack: true
  },
  {
    path: '/dashboard/settings/resourceManager',
    title: 'Controle de Prioridade de Recursos na Rede',
    showMenu: false,
    showBack: true
  },
  {
    path: '/dashboard/settings/plataformSync',
    title: 'Sincronização Spotify e Youtube',
    showMenu: false,
    showBack: true
  },
  {
    path: '/dashboard/createPlaylist',
    title: 'Criar Playlist',
    showMenu: false,
    showBack: true
  }
]
