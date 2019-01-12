/**
 * Parse the hero name given by the command
 * @param args
 * @returns {string}
 */
function getHeroName(args) {
  let name = args[0]
  for (let i = 1; i < args.length; i++) {
    name = name.concat(' ', args[i])
  }
  return name.toLowerCase()
}

/**
 * Log a system message to the console with date and timestamp.
 * @param message
 */
function log(message) {
  const timestamp = new Date().toLocaleTimeString();
  const date = new Date().toLocaleDateString();
  const m = `${date} - ${timestamp}: ${message}`
  console.log(m)
}

module.exports = {getHeroName, log}