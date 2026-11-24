export const apiUrl = (path: string) => `/api${path}`

export const fetchJson = async <T>(path: string): Promise<T> => {
  const response = await fetch(apiUrl(path))
  if (!response.ok) throw new Error(`${response.status} ${path}`)
  return response.json() as Promise<T>
}
