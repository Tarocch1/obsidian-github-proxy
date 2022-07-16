import * as https from 'https'

import { matchUrl } from './url'
import GithubProxy from '../main'

const forPc = (e: AjaxOptions) => {
  try {
    https
      .get(e.url, function (res) {
        res.setEncoding('utf8')
        let rawData = ''
        res.on('data', (chunk) => {
          rawData += chunk
        })
        res.on('end', () => {
          try {
            e.success!(rawData, {} as any)
          } catch (error) {
            e.error!(error, {} as any)
          }
        })
      })
      .on('error', function (error) {
        e.error!(error, {} as any)
      })
  } catch (error) {
    e.error!(error, {} as any)
  }
}

const proxy: typeof ajaxPromise = (e: AjaxOptions) => {
  return new Promise((resolve, reject) => {
    e.success = resolve
    e.error = function (error, req) {
      return reject(req)
    }
    // TODO mobile
    forPc(e)
  })
}

export class AjaxProxy {
  plugin: GithubProxy
  ap: typeof ajaxPromise

  constructor(plugin: GithubProxy) {
    this.plugin = plugin
    this.load()
  }

  load() {
    this.ap = window.ajaxPromise
    window.ajaxPromise = (e) => {
      if (matchUrl(e, this.plugin.settings)) return proxy(e)
      return this.ap(e)
    }
  }

  unload() {
    window.ajaxPromise = this.ap
  }
}
