import React from 'react'
import { createRoot } from 'react-dom/client';
import ContentScript from './ContentScript';
import './index.css'

if(typeof init === 'undefined') {
  const init = function() {

    if(!document.getElementsByTagName('form')[0]) {
      return
    }

    // Adding the extension to the document
    const extensionRoot = document.createElement('div')
    extensionRoot.id = 'extension-root'
    document.body.appendChild(extensionRoot)

    // Render the extension to get the script working
    const container = document.getElementById('extension-root')
    const root = createRoot(container)
    root.render(
      <ContentScript />
    )
  }  
  init();
}