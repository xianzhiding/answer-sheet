/*
 * @Description: 
 * @Author: dingxianzhi
 * @Email: dingxz@moofen.cn
 * @Date: 2022-06-06 13:31:46
 * @LastEditTime: 2022-08-11 17:10:35
 */
export function useArrayCutHook(initial, options) {
  const runtimeOptions = {
    height: 197,
    perpageHeight: 197,
    rowHeight:35,
    ...(options || {}),
  }

  let arr = initial.reduce((acc, item) => acc.concat(item), [])
  let cache = getArr()

  function getArr () {
    let beyond = 0
    const { results } = arr.reduce(
      (acc, item) => {
        if (item.height >= runtimeOptions.rowHeight && !(item.height % runtimeOptions.rowHeight == 0)) {
          beyond = 13
        }

        acc.totalHeight += item.height

        if (acc.totalHeight <= (acc.arrLen - beyond)) {
          acc.results[acc.results.length - 1].push(item)
        }

        if (acc.totalHeight > (acc.arrLen - beyond)) {
          acc.totalHeight = item.height
          beyond = 0
          acc.arrLen = runtimeOptions.perpageHeight
          acc.results.push([item])
        }

        return acc
      }, { arrLen: runtimeOptions.height, results: [[]], totalHeight: 0 },
    )
    return results
  }

  function setArr(index, newArray) {
    cache[index] = newArray
    arr = cache.reduce((acc, item) => acc.concat(item), [])
    cache = getArr()

    return cache.map(item => {
      return [...item]
    })
  }

  function updateOptions(opts) {
    Object.assign(runtimeOptions, opts)

    return getArr()
  }

  return {
    setArr,
    getArr,
    updateOptions,
  }
}

