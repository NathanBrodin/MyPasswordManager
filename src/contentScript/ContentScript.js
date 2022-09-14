/* global chrome */
import React from 'react'
import CryptoJS from 'crypto-js'
import { db } from '../firebase'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import './ContentScript.css'

export default class ContentScript extends React.Component {
  constructor() {
    super()

    this.state = {
      form: this.getForm(),
      inputs: this.getInputs(),
      url: this.getUrl(),
      user: undefined,
      isStored: true,
      key: undefined
    }

    if(!this.state.url || !this.state.inputs) { return }

    this.storeInputs = this.storeInputs.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.searchUserData = this.searchUserData.bind(this)
    this.encryptData = this.encryptData.bind(this)
    this.decryptData = this.decryptData.bind(this)

    this.getUser()
  }

  handleSubmit() {
    if(!this.state.form && this.state.isStored) { return }
    this.storeInputs()
  }

  getForm() {
    const form = document.getElementsByTagName('form')[0]
    if(form) {
      return form
    }
  }

  getInputs() {
    var inputs = document.getElementsByTagName('input')
    inputs = Object.values(inputs).filter(this.filterInputs)

    let isFormPage = false
    for(let input of inputs) {
      if(input.type === "password") {
        isFormPage = true
      }
    }

    if(inputs.length && isFormPage) {
      return inputs
    }
    return undefined
  }
  
  filterInputs(input) {
    switch (input.type) {
      case "email":
      case "text":
      case "tel": 
      case "password":
        return true
    
      default:
        return false
    }

  }

  getUrl() {
    let url = (new URL(window.location.href))
    url = url.hostname.replace('www.', '')

    if(url) {
      return url
    }
    return undefined
  }

  getUser() {
    chrome.storage.sync.get(['key']).then( (result) => { 
      // eslint-disable-next-line
      this.state.key = result.key
    })

    chrome.storage.sync.get(['user']).then( (result) => { 
      // eslint-disable-next-line
      this.state.user = result.user
      this.searchUserData()
    })
  }

  encryptData(data, key) {
    let encJson = CryptoJS.AES.encrypt(JSON.stringify(data), key).toString()
    let encData = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(encJson))
    return encData
  }

  decryptData(data, key) {
    let decData = CryptoJS.enc.Base64.parse(data).toString(CryptoJS.enc.Utf8)
    let decJson = CryptoJS.AES.decrypt(decData, key).toString(CryptoJS.enc.Utf8)
    return JSON.parse(decJson)
  }

  async searchUserData() {
    if(!this.state.user) { return }

    const urlRef = doc(db, "users/" + this.state.user + "/data/" + this.state.url)
    const urlSnap = await getDoc(urlRef)
    
    // if url is stored, get values
    if(urlSnap.exists()) {
      this.fillInputs(urlSnap.data())
    } else {
      this.setState({ isStored: false })
    }
  }
  
  async storeInputs() {
    if(!this.state.user || !this.state.inputs) { return }

    const inputs = this.state.inputs

    const urlDoc = doc(db, "users", this.state.user, "data", this.state.url)
    await setDoc(urlDoc, {})

    for(let input of inputs) {   
      await updateDoc(urlDoc, {
        [input.id]: this.encryptData(input.value, this.state.key)
      })
    }

    this.state.form.submit()
  }

  async fillInputs(userData) {
    const inputs = this.state.inputs

    if(!inputs) { return }

    for(let input of inputs) {
      try {
        input.value = this.decryptData(userData[input.id], this.state.key)
      } catch(e) {
        console.error("Data of input [" + input.id + "] was not found, " + e)
      }
    }

    const urlRef = doc(db, "users/" + this.state.user)
    const urlSnap = await getDoc(urlRef)
    if(urlSnap.data().autoSubmit === true) {
      this.state.form.submit()
    }
  }

  render() {
    if(!this.state.inputs) { return(
      <div></div>
    ) }
    return (
      <div className='extension-container'>
        <button className='extension-button' onClick={this.handleSubmit}>
          <div className="svg-wrapper-1">
            <div className="svg-wrapper">
            <svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0z" fill="none"></path><path d="M1 14.5a6.496 6.496 0 0 1 3.064-5.519 8.001 8.001 0 0 1 15.872 0 6.5 6.5 0 0 1-2.936 12L7 21c-3.356-.274-6-3.078-6-6.5zm15.848 4.487a4.5 4.5 0 0 0 2.03-8.309l-.807-.503-.12-.942a6.001 6.001 0 0 0-11.903 0l-.12.942-.805.503a4.5 4.5 0 0 0 2.029 8.309l.173.013h9.35l.173-.013zM13 12h3l-4 5-4-5h3V8h2v4z" fill="currentColor"></path></svg>
            </div>
          </div>
          <span>Save</span>
        </button>
      </div>
    )
  }
}