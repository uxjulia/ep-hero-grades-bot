function getHeroName(args) {
  let name = args[0]
  for (let i = 1; i < args.length; i++) {
    name = name.concat(' ', args[i])
  }
  return name.toLowerCase()
}

function log(message) {
  const timestamp = new Date().toLocaleTimeString();
  const date = new Date().toLocaleDateString();
  const m = `${date} - ${timestamp}: ${message}`
  console.log(m)
}

module.exports = {getHeroName, log}