import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import Header from './components/Header'
import Player from './components/Player'
import { ModalProvider } from './contexts/Modal'
import { AlbumScreen } from './pages/Album'
import AlbumsScreen from './pages/Albums'
import { ArtistScreen } from './pages/Artist'
import ArtistsScreen from './pages/Artists'
import AuthCallback from './pages/AuthCallback'
import DashboardScreen from './pages/Dashboard'
import HomeScreen from './pages/Home'
import { PlaylistScreen } from './pages/Playlist'
import PlaylistsScreen from './pages/Playlists'
import SettingsScreen from './pages/Settings'
import AddMusicScreen from './pages/Settings/addMusic'
import { CreatePlaylistScreen } from './pages/Settings/createPlaylist'
import { ResourceManagerScreen } from './pages/Settings/resourceMamager'
import { SocialAuthManagerScreen } from './pages/Settings/socialAuthManager'
import SpotifyCallback from './pages/SpotifyCallback'
import YoutubeCallback from './pages/YoutubeCallback'

const DashboardLayout: React.FC = props => {
  return (
    <div className="">
      <Header title="Um Titulo" />
      <ModalProvider>{props.children}</ModalProvider>
      <Player />
    </div>
  )
}

const Routes: React.FC = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={HomeScreen} />
        <Route path="/authCallback" exact component={AuthCallback} />
        <Route path="/spotifyAuth/callback" exact component={SpotifyCallback} />
        <Route path="/youtubeAuth/callback" exact component={YoutubeCallback} />
        <DashboardLayout>
          <Route path="/dashboard" exact component={DashboardScreen} />
          <Route path="/dashboard/albums" exact component={AlbumsScreen} />
          <Route
            path="/dashboard/playlists"
            exact
            component={PlaylistsScreen}
          />
          <Route
            path="/dashboard/playlist/:id"
            exact
            component={PlaylistScreen}
          />
          <Route path="/dashboard/album/:id" exact component={AlbumScreen} />
          <Route path="/dashboard/artists" exact component={ArtistsScreen} />
          <Route path="/dashboard/artist/:id" exact component={ArtistScreen} />
          <Route path="/dashboard/settings" exact component={SettingsScreen} />
          <Route
            path="/dashboard/settings/resourceManager"
            exact
            component={ResourceManagerScreen}
          />
          <Route
            path="/dashboard/settings/plataformSync"
            exact
            component={SocialAuthManagerScreen}
          />
          <Route
            path="/dashboard/createPlaylist"
            exact
            component={CreatePlaylistScreen}
          />
          <Route path="/dashboard/addMusic" exact component={AddMusicScreen} />
        </DashboardLayout>
      </Switch>
    </BrowserRouter>
  )
}

export default Routes
