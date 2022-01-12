import axios from 'axios'
import { v4 as uuid } from 'uuid'

import { db } from '../../database/db'
import { compare, encrypt } from '../../utils/cripto'
import { InvalidGithubUser } from '../../utils/errors/InvalidGithubUser'
import { SessionNotFound } from '../../utils/errors/SessionNotFound'
import { TokenInvalid } from '../../utils/errors/TokenInvalid'
import { Session } from './types'

const { GITHUB_CLIENT_ID, GITHUB_SECRET, WEB_CLIENT_HOST } = process.env

const GITHUB_LOGIN = 'gsbenevides2'
const GITHUB_REDIRECT = WEB_CLIENT_HOST + '/authCallback'

export class AuthModel {
  authUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&scope=user&login=${GITHUB_LOGIN}`
  async authCallback(code: string) {
    console.log(GITHUB_REDIRECT)
    const { data: githubAuthData } = await axios({
      url: 'https://github.com/login/oauth/access_token',
      params: {
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_SECRET,
        code,
        redirect_uri: GITHUB_REDIRECT
      },
      method: 'POST',
      headers: {
        Accept: 'application/json'
      }
    })

    const { data: githubUserData } = await axios({
      method: 'get',
      url: 'https://api.github.com/user',
      headers: {
        authorization: `Bearer ${githubAuthData.access_token}`
      }
    })
    if (githubUserData.login !== GITHUB_LOGIN) throw new InvalidGithubUser()

    const id = uuid()
    const token = uuid()
    const encrypted = encrypt(token)
    await db('sessions').insert({
      id,
      token: encrypted
    })
    return { sessionId: id, token }
  }

  async authenticate(sessionId: string, token: string) {
    const row = await db<Session>('sessions')
      .select('token')
      .where('id', sessionId)
      .first()
    if (!row) throw new SessionNotFound()
    if (compare(row.token, token) === false) throw new TokenInvalid()
  }

  async revokeCredentials(sessionId: string) {
    await db('sessions').delete().where('id', sessionId)
  }
}
