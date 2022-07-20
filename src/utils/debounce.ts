export function debounce(fn: any, delay: number) {
  let timer: NodeJS.Timeout
  return function () {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      fn()
    }, delay)
  }
}
