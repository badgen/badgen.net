type RouteArgs = null | {
  [key: string]: string
}

function matchRoute(pattern: string, path: string): RouteArgs {
  const parsedArgs: RouteArgs = {}

  const PATTERN_SEGMENT_REG = /\/(:)?([\w-]+)([*?+]){0,1}(?:<([^>]+)>)?/g
  const PATH_SEGMENT_REG = /\/([^/]+)/g

  let parsedPatternSegment = PATTERN_SEGMENT_REG.exec(pattern)
  let parsedPathSegment = PATH_SEGMENT_REG.exec(path)

  while (parsedPatternSegment !== null) {
    const [ rawPatternSegment, type, name, flag, reg ] = parsedPatternSegment

    if (parsedPathSegment === null) {
      return flag === '?' ? parsedArgs : null
    }

    if (flag === '+') {
      parsedArgs[name] = path.slice(parsedPathSegment.index)
      return parsedArgs
    }

    const [ rawPathSegment, value ] = parsedPathSegment

    switch (type) {
      case undefined: // literal match
        if (rawPatternSegment !== rawPathSegment) {
          return null
        }
        break
      case ':': // named segment
        if (reg) {
          if (new RegExp(`^${reg}$`).test(value)) {
            parsedArgs[name] = value
          } else {
            return null
          }
        } else {
          parsedArgs[name] = value
        }
    }

    parsedPatternSegment = PATTERN_SEGMENT_REG.exec(pattern)
    parsedPathSegment = PATH_SEGMENT_REG.exec(path)
  }

  if (parsedPathSegment === null) {
    return parsedArgs
  } else {
    return null
  }
}

export default matchRoute
