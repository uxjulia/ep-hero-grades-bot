# Empires and Heroes Discord Bot

A personal Discord bot that retrieves hero ratings and delivers them to a Discord channel. Grades are based off of the original [Hero Grades compiled by members of 7DD](http://7ddgaming.com/2018/01/18/anchors-complete-guide-to-hero-grades/)

[Join the Hiro Bot Discord Server](https://discord.gg/Geub8qs) to use the bot.

Note: This bot is NOT meant for public installation. Please do not attempt to clone and run the bot without adding your own Airtable API key and Airtable database ID. You are more than welcome to use this repo as a starting point for your own bot, but I cannot provide any technical support. 

### Available Commands

- `!info [hero]` - Get basic info on the hero
- `!titan [hero]`- Get titan grades for a given hero
- `!offense [hero]` - Get offense grades for a given hero
- `!defense [hero]` - Get defense grades for a given hero
- `!image [hero]` - Get the card image for a given hero

Example usage: `!info Elena`

### Additional Commands

- `!summon` - Simulate an epic hero summon
- `!summon atlantis` - Simulate an Atlantis portal summon
- `!summon 10` - Simulate a 10-pull epic hero summon
- `!summon 10 atlantis` - Simulate a 10-pull Atlantis portal summon

- `!levels [element]` - Lists the best level(s) for fighting the specified elemental monsters
- `!emojis` - Get the list of emoji codes for in-game chat
- `!ocr` - Attach an image and get the text extracted from it

Example: `!levels holy`

- `!loot [total titan HP]` - Get info on rank / damage needed for specific titan loot tiers

Example: `!loot 2750000`
