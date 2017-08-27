import kue from 'kue';
const args = require('minimist')(process.argv.slice(2));

console.log(process.env.REDIS_URL || args.url || 'redis://localhost:6379');
kue.createQueue({
  redis: process.env.REDIS_URL || args.url || 'redis://localhost:6379'
});

const port = process.env.PORT || 5000;
kue.app.listen(port);
console.log(`Kue listening on ${port}`);
