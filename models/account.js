const db = require("../db"); // Import the database connection

// Create a new account
const createAccount = async (email, password, balance) => {
  const query =
    "INSERT INTO accounts (email, password, balance) VALUES ($1, $2, $3) RETURNING *";
  const values = [email, password, balance];

  try {
    const { rows } = await db.query(query, values);
    return rows[0];
  } catch (error) {
    throw error;
  }
};

// Get an account by ID
const getAccountById = async (account_id) => {
  const query = "SELECT * FROM accounts WHERE account_id = $1";
  const values = [account_id];

  try {
    const { rows } = await db.query(query, values);
    return rows[0];
  } catch (error) {
    throw error;
  }
};

// Update an account by ID
const updateAccountById = async (account_id, email, password, balance) => {
  const query =
    "UPDATE accounts SET email = $2, password = $3, balance = $4 WHERE account_id = $1 RETURNING *";
  const values = [account_id, email, password, balance];

  try {
    const { rows } = await db.query(query, values);
    return rows[0];
  } catch (error) {
    throw error;
  }
};

// Delete an account by ID
const deleteAccountById = async (account_id) => {
  const query = "DELETE FROM accounts WHERE account_id = $1 RETURNING *";
  const values = [account_id];

  try {
    const { rows } = await db.query(query, values);
    return rows[0];
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createAccount,
  getAccountById,
  updateAccountById,
  deleteAccountById,
};
