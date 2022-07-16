import { ipcRenderer } from 'electron'

import { matchUrl } from './url'
import GithubProxy from '../main'

export class ElectronProxy {
  plugin: GithubProxy
  ipcRendererSend: typeof ipcRenderer.send

  constructor(plugin: GithubProxy) {
    this.plugin = plugin
    this.load()
  }

  load() {
    this.ipcRendererSend = ipcRenderer.send
    ipcRenderer.send = (...args) => {
      const [type, , e] = args
      if (type === 'request-url') {
        matchUrl(e, this.plugin.settings)
      }
      this.ipcRendererSend.bind(ipcRenderer)(...args)
    }
  }

  unload() {
    ipcRenderer.send = this.ipcRendererSend
  }
}
