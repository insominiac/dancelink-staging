const { apiUrl } = require('./app/lib/api');

console.log('Testing apiUrl function:');
console.log('apiUrl("public/content/events"):', apiUrl('public/content/events'));
console.log('apiUrl("public/events"):', apiUrl('public/events'));
console.log('apiUrl("seo?path=/events"):', apiUrl('seo?path=/events'));