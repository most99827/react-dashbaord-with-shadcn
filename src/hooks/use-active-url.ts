import { useLocation } from "react-router-dom"

export function useActiveUrl() {
  const location = useLocation()
  const currentUrl = location.pathname

  function urlIsActive(urlToCheck: string, current?: string) {
    return urlToCheck === (current ?? currentUrl)
  }

  return { currentUrl, urlIsActive }
}

