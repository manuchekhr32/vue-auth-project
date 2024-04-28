export function catchError(err: any) {
  const data = err.response.data
  if (typeof data.message === 'string') {
    alert(data.message)
  } else {
    alert(data.message.join('\n'))
  }
}
