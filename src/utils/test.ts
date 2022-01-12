import 'dotenv/config'
import { db } from '../database/db'
import { MusicList } from '../models/musics/types'
import { useOptionalData } from '../models/musics/utils'


async function start (){
    const q1 = db('musics_playlists')
    q1.leftJoin('musics','musics_playlists.musicId','=','musics.id')
    q1.where('musics_playlists.playlistId','=','7801856e-5d15-4092-a5a1-c05cdfa8ae8d')
    q1.offset(0 * 10)
    q1.orderBy('musics_playlists.position', 'asc')
    q1.limit(10)
    const {query,rowManager} = useOptionalData(true,true,q1)
    
    const result = await query
    
    console.log(result.map(rowManager))
}

start()
