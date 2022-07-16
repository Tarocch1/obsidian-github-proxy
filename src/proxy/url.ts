import { servers } from '../server'
import { PluginSettings } from '../setting'

const include = [
  {
    regexp: /\release\/download\//g,
    to: (url: string, server: PluginSettings['server']) =>
      url.replace('https://github.com/', servers[server].down),
  },
  {
    regexp: /^https?:\/\/raw.githubusercontent.com\//,
    to: (url: string, server: PluginSettings['server']) =>
      url.replace('https://raw.githubusercontent.com/', servers[server].raw),
  },
  {
    regexp: /^https?:\/\/github.com\//,
    to: (url: string, server: PluginSettings['server']) =>
      url.replace('https://github.com/', servers[server].home),
  },
]

export const matchUrl = (e: AjaxOptions, settings: PluginSettings) => {
  for (const item of include) {
    if (e.url && item.regexp.test(e.url)) {
      e.url = item.to(e.url, settings.server)
      e.headers ||= {}
      e.headers['content-type'] = 'application/x-www-form-urlencoded'
      e.headers['Access-Control-Allow-Origin'] = '*'
      return true
    }
  }
  return false
}
