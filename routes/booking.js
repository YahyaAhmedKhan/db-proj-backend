const express = require('express')
const db = require('../db') // Adjust the path as necessary

const router = express()

router.post('/addFlightbooking', async (req, res) => {
  try {
    const { accountId, flightRecordId } = req.body
    const insertedFlightBooking = await insertFlightBooking(accountId, flightRecordId)
    res.status(200).json(insertedFlightBooking) // Send the inserted row as JSON response
  } catch (error) {
    console.error('Error adding flight booking:', error)
    res.sendStatus(500)
  }
})

async function insertFlightBooking (accountId, flightRecordId) {
  try {
    const flightBooking = await db.query(
      'INSERT INTO flight_bookings (total_seats, total_price, account_id, flight_record_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [0, 0, accountId, flightRecordId]
    )
    // flightBooking.rows[0] contains the newly inserted row
    const insertedFlightBooking = flightBooking.rows[0]

    console.log('Inserted flight booking:', insertedFlightBooking)
    return insertedFlightBooking
  } catch (error) {
    console.error('Error inserting flight booking:', error)
    throw error
  }
}
async function insertSeatBooking (flightBookingId, passenger) {
  try {
    const {
      seatBookingNumber,
      firstName,
      lastName,
      gender,
      passportNumber,
      dateOfBirth,
      nationality,
      seatClass,
      specialNeeds,
      extraBaggage,
      price
    } = passenger

    const seatNumber = generateRandomSeatNumber()
    console.log(seatNumber) // Example output: "A42"

    await db.none(
      'INSERT INTO seat_bookings (flight_booking_id, seat_booking_number, seat_number, first_name, last_name, gender, passport_number, date_of_birth, nationality, seat_class, special_needs, extra_baggage, price) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)',
      [
        flightBookingId,
        seatBookingNumber,
        seatNumber,
        firstName,
        lastName,
        gender,
        passportNumber,
        dateOfBirth,
        nationality,
        seatClass,
        specialNeeds,
        extraBaggage,
        price
      ]
    )
  } catch (error) {
    console.error('Error inserting seat booking:', error)
    throw error
  }
}

async function bookFlightAndSeats (totalSeats, flightRecordId, flightRecordDate, passengers) {
  try {
    // 1. Insert flight booking record
    const flightBookingId = await insertFlightBooking(totalSeats, flightRecordId)

    // 2. Insert seat bookings for each passenger
    const seatBookingPromises = passengers.map((passenger, index) => {
      return insertSeatBooking(flightBookingId, passenger)
    })

    await Promise.all(seatBookingPromises)

    console.log('Flight booking and seat bookings successfully completed')
  } catch (error) {
    console.error('Error:', error)
  }
}

// Example usage of the function
const totalSeats = 2 // Replace with the actual total seats
const flightBookingId = 1 // Replace with the actual flight booking ID
const flightRecordDate = '2023-12-31' // Replace with the actual date of the flight record

const passengers = [
  {
    seatBookingNumber: 1,
    firstName: 'John',
    lastName: 'Doe',
    gender: 'M',
    passportNumber: 'US123456',
    dateOfBirth: '1990-01-15',
    nationality: 'USA',
    seatClass: 'economy',
    specialNeeds: false,
    extraBaggage: false,
    price: 300.00
  },
  {
    seatBookingNumber: 2,
    firstName: 'Jane',
    lastName: 'Smith',
    gender: 'F',
    passportNumber: 'CA789012',
    dateOfBirth: '1985-07-20',
    nationality: 'Canada',
    seatClass: 'business',
    specialNeeds: true,
    extraBaggage: true,
    price: 500.00
  }
]

const generateRandomSeatNumber = () => {
  const getRandomChar = (min, max) => {
    const charCode = Math.floor(Math.random() * (max - min + 1)) + min
    return String.fromCharCode(charCode)
  }

  const randomLetter = getRandomChar(65, 90) // ASCII codes for capital letters
  const randomDigits = Math.floor(Math.random() * 100).toString().padStart(2, '0')

  return `${randomLetter}${randomDigits}`
}

module.exports = router
