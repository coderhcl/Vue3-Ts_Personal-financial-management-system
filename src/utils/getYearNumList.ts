const getYearNumList = (list: any[]) => {
  const startYear = new Date().getUTCFullYear()
  const matchYear: any[] = []
  for (let i = 0; i < 12; i++) {
    if (i < 9) {
      matchYear[i] = `${startYear}-0${i + 1}`
    }
    if (i >= 9) {
      matchYear[i] = `${startYear}-${i + 1}`
    }
  }

  const numlist = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  list.forEach((item) => {
    if (item.createTime.match(matchYear[0])) {
      numlist[0] = numlist[0] + item.money
    }
    if (item.createTime.match(matchYear[1])) {
      numlist[1] = numlist[1] + item.money
    }
    if (item.createTime.match(matchYear[2])) {
      numlist[2] = numlist[2] + item.money
    }
    if (item.createTime.match(matchYear[3])) {
      numlist[3] = numlist[3] + item.money
    }
    if (item.createTime.match(matchYear[4])) {
      numlist[4] = numlist[4] + item.money
    }
    if (item.createTime.match(matchYear[5])) {
      numlist[5] = numlist[5] + item.money
    }
    if (item.createTime.match(matchYear[6])) {
      numlist[6] = numlist[6] + item.money
    }
    if (item.createTime.match(matchYear[7])) {
      numlist[7] = numlist[7] + item.money
    }
    if (item.createTime.match(matchYear[8])) {
      numlist[8] = numlist[8] + item.money
    }
    if (item.createTime.match(matchYear[9])) {
      numlist[9] = numlist[9] + item.money
    }
    if (item.createTime.match(matchYear[10])) {
      numlist[10] = numlist[10] + item.money
    }
    if (item.createTime.match(matchYear[11])) {
      numlist[11] = numlist[11] + item.money
    }
  })
  return numlist
}

export default getYearNumList
