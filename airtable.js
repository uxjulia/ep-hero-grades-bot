var Airtable = require('airtable');
// var config = require('./config.json');
const { airtableApi, airtableBase } = require('./config.json');
var base = new Airtable({apiKey: airtableApi}).base(airtableBase);

module.exports = {
	getHeroStats: function(id, callback) {
		base('Titan Grades').find(id, function(err, record) {
	    if (err) { console.error(err); return; }
	    callback(record)
	});
	},
	getHero: function(id, callback) {
		base('Titan Grades').select({
    view: 'Grid view',
    filterByFormula: `TRUE({Hero_ID} = ${id})`
		}).eachPage(function(err, records) {
    if (err) { console.error(err); return; }
    records.forEach(function(record) {
        console.log('Retrieved', record.get('Hero_ID'));
        callback(record)
    });
});
	}
}
