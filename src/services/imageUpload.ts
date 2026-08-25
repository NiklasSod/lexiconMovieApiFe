export async function uploadImageToBlob(url: string): Promise<string> {
  const response = await fetch('/api/upload-image', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  })

  const data = (await response.json().catch(() => ({}))) as {
    url?: string
    message?: string
  }

  if (!response.ok) {
    throw new Error(data.message ?? 'Could not upload image')
  }

  if (!data.url) {
    throw new Error('Image upload returned no URL')
  }

  return data.url
}
