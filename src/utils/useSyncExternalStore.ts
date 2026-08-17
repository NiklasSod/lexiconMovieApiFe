import { useSyncExternalStore } from 'react'

// Client detection helper
const emptySubscribe = () => () => {}
export const useIsClient = () =>
  useSyncExternalStore(
    emptySubscribe,
    () => true, // Client snapshot
    () => false, // Server snapshot
  )
