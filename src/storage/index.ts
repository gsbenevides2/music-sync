import { Dropbox } from 'dropbox'

const { DROPBOX_ACCESS_TOKEN } = process.env

export class StorageManager {
  dropbox = new Dropbox({ accessToken: DROPBOX_ACCESS_TOKEN })
  async saveFile(path: string, buf: Buffer): Promise<string> {
    await this.dropbox.filesUpload({ path, contents: buf })
    const result = await this.dropbox.sharingCreateSharedLinkWithSettings({
      path
    })
    return result.result.url.replace('www.dropbox', 'dl.dropboxusercontent')
  }
}
