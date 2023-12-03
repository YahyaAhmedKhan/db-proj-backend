const express = require('express')
const jwt = require('jsonwebtoken')
const db = require('../db') // Adjust the path as necessary

const router = express()
const secretKey = 'hello'

// Login endpoint
router.post('/', async (req, res) => {
  console.log('cookies received are: ', req.cookies)
  const { email, password } = req.body

  const { message, accountId } = await isValidUser(email, password)
  console.log('result: ', message, ' account id:', accountId)

  if (message === 'Login successful') {
    const token = jwt.sign({ accountId }, secretKey, { expiresIn: '1h' })

    res.cookie('jwt', token, { httpOnly: false, sameSite: 'none' })
    res.status(200).json({ msg: 'Login successful', token, email, password })
  }
  if (message === 'Invalid email') {
    res.status(401).json({ msg: 'Invalid email' })
  }
  if (message === 'Incorrect password') {
    res.status(401).json({ msg: 'Incorrect password' })
  }
  // res.status(500).json({ error: 'Server error' })
})

async function isValidUser (email, password) {
  try {
    const result = await db.query('SELECT account_id, password FROM accounts WHERE email = $1', [
      email
    ])
    const row = result.rows[0]
    if (!row) {
      return { message: 'Invalid email' }
    }
    if (row.password === password) {
      // If the password matches, return a success message along with the account ID
      return { message: 'Login successful', accountId: row.account_id }
    } else {
      return { message: 'Incorrect password' }
    }
  } catch (err) {
    console.error('Error occurred while validating user')
    console.error(err)
    throw err
  }
}

module.exports = router
