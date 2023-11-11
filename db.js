const { Pool } = require('pg')

console.log('ababbabab')
const pool = new Pool({
  user: 'myuser',
  host: 'localhost', // Replace with your PostgreSQL server host
  database: 'khanairdb',
  // password: 'your_password',
  port: 5432 // Default PostgreSQL port
})

module.exports = pool
