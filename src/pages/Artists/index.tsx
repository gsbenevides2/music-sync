import React from 'react'
import { Helmet } from 'react-helmet'

// import LaggerList from '../../components/LaggerList'

function ArtistsScreen() {
  // const musics: Array<{
  //   title: string
  //   subtitle: string
  //   imageSrc: string
  // }> = Array(15).fill({
  //   imageSrc:
  //     'https://thumbs.dreamstime.com/z/dynamic-radial-color-sound-equalizer-design-music-album-cover-template-abstract-circular-digital-data-form-vector-160916775.jpg',
  //   title: 'Nome da Música',
  //   subtitle: 'Nome do Artista'
  // })
  return (
    <div>
      <Helmet>
        <title>Music Sync - Todos os Artistas</title>
      </Helmet>
      <br />
      {/* <LaggerList listOfItems={musics} /> */}
      <p style={{ height: '11vh' }} />
    </div>
  )
}

export default ArtistsScreen
