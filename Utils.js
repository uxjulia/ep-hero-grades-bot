function getHeroName(args) {
  let name = args[0]
  for (let i = 1; i < args.length; i++) {
    name = name.concat(' ', args[i])
  }
  const hero = name.toLowerCase()
  return hero
}

module.exports = {getHeroName}