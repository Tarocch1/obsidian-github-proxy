import { App, PluginSettingTab, Setting } from 'obsidian'

import { servers } from './server'
import GithubProxy from './main'

export interface PluginSettings {
  server: keyof typeof servers
}

export class GithubProxySettingTab extends PluginSettingTab {
  plugin: GithubProxy

  constructor(app: App, plugin: GithubProxy) {
    super(app, plugin)
    this.plugin = plugin
  }

  display() {
    this.containerEl.empty()
    new Setting(this.containerEl)
      .setName('代理服务器')
      .addDropdown((dropDown) => {
        const options = Object.keys(servers).reduce((acc, cur) => {
          acc[cur] = cur
          return acc
        }, {} as Record<string, string>)
        dropDown.addOptions(options)
        dropDown.setValue(this.plugin.settings.server)
        dropDown.onChange(async (value: PluginSettings['server']) => {
          this.plugin.settings.server = value
          await this.plugin.saveSettings()
        })
      })
  }
}
