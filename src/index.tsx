// main
import React from 'react'
import ReactDOM from 'react-dom/client'
import reportWebVitals from 'reportWebVitals'
import {Provider} from 'react-redux'
// component
import App from 'App'
import store from 'service/store'
import 'index.scss'

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
)

reportWebVitals()