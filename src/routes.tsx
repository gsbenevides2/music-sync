import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import Header from './components/Header'
import Player from './components/Player'
import { MusicListContextProvider } from './contexts/MusicList'
import { PlayerContextProvider } from './contexts/Player'
import AddMusicScreen from './pages/AddMusic'
import { AlbumScreen } from './pages/Album'
import AlbumsScreen from './pages/Albums'
import ArtistsScreen from './pages/Artists'
import AuthCallback from './pages/AuthCallback'
import DashboardScreen from './pages/Dashboard'
import HomeScreen from './pages/Home'
import SettingsScreen from './pages/Settings'

const DashboardLayout: React.FC = props => {
  return (
    <MusicListContextProvider>
      <PlayerContextProvider>
        <div className="p-3">
          <Header title="Um Titulo" />
          {props.children}
          <Player />
        </div>
      </PlayerContextProvider>
    </MusicListContextProvider>
  )
}

const Routes: React.FC = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={HomeScreen} />
        <Route path="/authCallback" exact component={AuthCallback} />
        <DashboardLayout>
          <Route path="/dashboard" exact component={DashboardScreen} />
          <Route path="/dashboard/albums" exact component={AlbumsScreen} />
          <Route path="/dashboard/album/:id" exact component={AlbumScreen} />
          <Route path="/dashboard/artists" exact component={ArtistsScreen} />
          <Route path="/dashboard/settings" exact component={SettingsScreen} />
          <Route path="/dashboard/addMusic" exact component={AddMusicScreen} />
        </DashboardLayout>
      </Switch>
    </BrowserRouter>
  )
}

export default Routes
