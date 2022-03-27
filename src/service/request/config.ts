let BASE_URL = ""
const TIME_OUT = 10000

if (process.env.NODE_ENV === "production") {
  BASE_URL = "http://localhost:3001/api"
} else if (process.env.NODE_ENV === "development") {
  BASE_URL = "http://localhost:3001/api"
} else {
  BASE_URL = "http://localhost:3001/api"
}
export { BASE_URL, TIME_OUT }
// console.log(process.env.NODE_ENV)
