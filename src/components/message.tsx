import React from 'react'
import { createRoot } from 'react-dom/client'
import MessageSnackbar from './Snackebar'
import ThemeProvider from 'src/theme'
import { StyledEngineProvider } from '@mui/material'

interface SnackbarWrapProps {
  duration: number
  variant: 'error' | 'success' | 'info' | 'warning'
  message: string
}

class Message {
  private prevUid = ''
  private defaultConfig = {
    duration: 1500,
  }
  private _appendMessageSnackbar(props: SnackbarWrapProps) {
    const uid = (Math.random() * 1000).toString(16)
    const { duration } = props
    let div = document.createElement('div')
    div.id = uid
    this._processQueue(uid)
    document.body.appendChild(div)
    const root = createRoot(div)
    root.render(
      <StyledEngineProvider injectFirst>
        <ThemeProvider>
          <MessageSnackbar {...props} />
        </ThemeProvider>
      </StyledEngineProvider>
    )
    setTimeout(() => {
      this._removeTarget(uid)
    }, duration + 1000)
  }
  private _processQueue(uid: string) {
    this._removeTarget(this.prevUid)
    this.prevUid = uid
  }

  private _removeTarget(uid: string) {
    let target = document.getElementById(uid)
    if (target) {
      document.body.removeChild(target)
    }
  }

  info(message: string, duration = this.defaultConfig.duration) {
    this._appendMessageSnackbar({ message, duration, variant: 'info' })
  }
  warning(message: string, duration = this.defaultConfig.duration) {
    this._appendMessageSnackbar({ message, duration, variant: 'warning' })
  }
  error(message: string, duration = this.defaultConfig.duration) {
    this._appendMessageSnackbar({ message, duration, variant: 'error' })
  }
  success(message: string, duration = this.defaultConfig.duration) {
    this._appendMessageSnackbar({ message, duration, variant: 'success' })
  }
}

const message = new Message()

export default message
