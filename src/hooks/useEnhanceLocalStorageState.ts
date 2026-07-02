import { useEffect, useState } from 'react'

const isBrowser = typeof window !== 'undefined'
function useEnhanceLocalStorageState<T>(key: string, defaultValue: T) {
  const [state, setState] = useState<T>(() => {
    if (isBrowser) {
      const local = localStorage.getItem(key)
      if (local) { try { return JSON.parse(local) } catch { return defaultValue } } else return defaultValue
    } else return defaultValue
  })

  useEffect(() => {
    if (state) {
      window.localStorage.setItem(key, JSON.stringify(state))
    }
  }, [state, key])

  return [state, setState] as const
}
export default useEnhanceLocalStorageState
