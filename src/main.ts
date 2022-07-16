import { Plugin } from 'obsidian'

import { GithubProxySettingTab, PluginSettings } from './setting'
import { AjaxProxy } from './proxy/ajax'
import { ElectronProxy } from './proxy/electron'

const DEFAULT_SETTINGS: PluginSettings = {
  server: 'mirr',
}

export default class GithubProxy extends Plugin {
  settings: PluginSettings
  ajaxProxy: AjaxProxy
  electronProxy: ElectronProxy

  async onload() {
    await this.loadSettings()
    this.addSettingTab(new GithubProxySettingTab(this.app, this))
    this.ajaxProxy = new AjaxProxy(this)
    this.electronProxy = new ElectronProxy(this)
  }

  onunload() {
    this.ajaxProxy.unload()
    this.electronProxy.unload()
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData())
  }

  async saveSettings() {
    await this.saveData(this.settings)
  }
}
