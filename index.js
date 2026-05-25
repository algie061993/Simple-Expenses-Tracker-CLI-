/** TO DO: Expand this program to calculate the total expenses
 * a day, a month, or a year. You can also add a feature to delete
 * an expense by its ID or name.
 * You can also add a feature to edit an existing expense by its ID or name.
 **/

const fs = require("fs"); // File system module for reading and writing files

const command = process.argv[2]; // Get the command from command line arguments
const arguments = Number(process.argv[3]); // Parse the third argument as a number
const expenseName = process.argv[4]; // Get the expense name from command line
const dateInput = process.argv[3]; // Get date input for date-specific queries
const expenseId = Number(process.argv[3]); // Parse expense ID as a number
const multipleIds = process.argv
  .slice(3)
  .map(Number)
  .filter((id) => !isNaN(id)); // Parse multiple IDs from arguments
// Remove or replace the old newAmount and newName declarations with this:
const arg4 = process.argv[4];
const arg5 = process.argv[5];

let newAmount = undefined;
let newName = undefined;

// If the first update parameter is a number, assign it to amount
if (arg4 !== undefined && !isNaN(Number(arg4))) {
  newAmount = Number(arg4);
  newName = arg5; // The next argument (if any) must be the name
} else if (arg4 !== undefined) {
  // If the first parameter isn't a number, treat it as the name
  newName = arg4;
}
/**
 * Reads and parses the expenses.json file to retrieve all expenses.
 * @returns {Array} An array of expense objects.
 */
const getAllExpenses = () => {
  const expenses = fs.readFileSync("expenses.json", "utf-8"); // Read expenses data from file
  return JSON.parse(expenses); // Parse JSON string to JavaScript object
};

/**
 * Saves an array of expenses to the expenses.json file.
 * @param {Array} expenses - The array of expense objects to save.
 */
const expensesSave = (expenses) => {
  const textData = JSON.stringify(expenses, null, 2); // Convert expenses array to formatted JSON string
  fs.writeFileSync("expenses.json", textData); // Write formatted JSON to file
};

/**
 * Adds a new expense to the expenses file.
 * Validates that the amount is a positive number and the name is a non-empty string.
 * @param {number} amount - The amount of the expense.
 * @param {string} name - The name/description of the expense.
 */
const addExpenses = (amount, name) => {
  if (
    isNaN(amount) ||
    amount <= 0 ||
    amount > 1000000 ||
    amount === undefined
  ) {
    console.log("Please provide a valid number for the amount.");
    return;
  }

  if (typeof name !== "string" || name.trim() === "") {
    console.log("Please provide a valid name for the expense.");
    return;
  }
  const currentExpenses = getAllExpenses(); // Get existing expenses from file
  // 1. Start by assuming the maximum ID found so far is 0
  let maxId = 0;

  // 2. Loop through every single existing expense item
  for (let i = 0; i < currentExpenses.length; i++) {
    // If this item's ID is bigger than our maxId, update our maxId tracker
    if (currentExpenses[i].id > maxId) {
      maxId = currentExpenses[i].id;
    }
  }

  // 3. The new ID will always be 1 higher than the absolute maximum ID found
  const nextId = maxId + 1;

  const newExpenses = {
    id: nextId, // Use the calculated next ID
    name: name, // Expense name provided by user
    amount: amount, // Expense amount provided by user
    date: new Date().toISOString(), // Current date in ISO format
    selected: false, // Default selection status
  };

  currentExpenses.push(newExpenses); // Add new expense to array

  expensesSave(currentExpenses); // Save updated expenses to file
  console.log("Expense added successfully!"); // Confirm successful addition
};

/**
 * Displays all expenses in a formatted list with their ID, name, amount, and date.
 * Shows [Selected] tag for expenses that have been marked as selected.
 */
const listExpenses = () => {
  const expenses = getAllExpenses(); // Retrieve all expenses

  if (expenses.length === 0) {
    console.log("No expenses found."); // Display message if no expenses exist
    return;
  }

  console.log("\n--- Your Expenses ---"); // Print header for expenses list

  for (let i = 0; i < expenses.length; i++) {
    const expensesItem = expenses[i]; // Get current expense item

    console.log(
      `${expensesItem.id}. ${expensesItem.name} - ₱${expensesItem.amount} (Date: ${expensesItem.date.slice(0, 10)}) ${expensesItem.selected ? "[Selected]" : ""}`, // Display expense details
    );
  }
  console.log("---------------------\n"); // Print closing line
};

/**
 * Marks multiple expenses as selected by their IDs and displays the total.
 * @param {Array} ids - Array of expense IDs to mark as selected and total.
 */
const selectAndTotalExpenses = (ids) => {
  const expenses = getAllExpenses(); // Get all expenses
  let sum = 0; // Initialize sum
  let foundCount = 0; // Count of found expenses

  if (expenses.length === 0) {
    console.log("No expenses found."); // Error if no expenses exist
    return;
  }

  console.log("--- Selected Expenses ---"); // Print header

  for (let i = 0; i < expenses.length; i++) {
    if (ids.includes(expenses[i].id)) {
      expenses[i].selected = true; // Mark expense as selected
      sum += expenses[i].amount; // Add to sum
      foundCount++; // Increment found count
      console.log(`${expenses[i].name}: ₱${expenses[i].amount}`); // Display expense
    }
  }

  if (foundCount === 0) {
    console.log("No expenses found with the provided IDs."); // Error if none found
    return;
  }

  expensesSave(expenses); // Save changes
  listExpenses(); // Display all expenses with updated selection status
  console.log("----------------------------------------");
  console.log(`Total for selected expenses: ₱${sum}`); // Display total

  for (let i = 0; i < expenses.length; i++) {
    expenses[i].selected = false; // Reset all selections
  }
  expensesSave(expenses); // Save reset selections to file
};

/**
 * Calculates and displays the total of all expenses.
 * Shows each expense and its amount, then displays the grand total.
 */
const TotalExpenses = () => {
  const expenses = getAllExpenses(); // Get all expenses

  let sum = 0; // Initialize total sum
  let name = ""; // Initialize name variable
  console.log("----------- List of Expenses -----------"); // Print header
  for (let i = 0; i < expenses.length; i++) {
    sum += expenses[i].amount; // Add each expense amount to sum
    name = expenses[i].name; // Store current expense name

    console.log(`${name}: ₱${expenses[i].amount}`); // Display each expense
  }
  console.log("----------------------------------------");
  console.log("------------ Total Expenses ------------");
  console.log(`Total Expenses: ₱${sum}`); // Display grand total
  console.log("----------------------------------------");
};

/**
 * Calculates and displays total expenses for a specific date.
 * @param {string} targetDate - The date to filter expenses by (YYYY-MM-DD format).
 */
const totalBydate = (targetDate) => {
  const expenses = getAllExpenses(); // Get all expenses

  if (
    isNaN(Date.parse(targetDate)) ||
    targetDate === undefined ||
    targetDate.trim() === ""
  ) {
    console.log("Please provide a valid date in the format YYYY-MM-DD."); // Validate date input
    return;
  }

  let sum = 0; // Initialize sum for this date
  console.log(`--- Expenses for ${targetDate} ---`); // Print date header

  for (let i = 0; i < expenses.length; i++) {
    const expenseDate = new Date(expenses[i].date).toISOString().split("T")[0]; // Extract date portion only
    if (expenseDate === targetDate) {
      sum += expenses[i].amount; // Add amount if date matches
      console.log(`${expenses[i].name}: ₱${expenses[i].amount}`); // Display matching expense
    }
  }
  console.log("----------------------------------------");
  console.log(`Total Expenses for ${targetDate}: ₱${sum}`); // Display total for date
  console.log("----------------------------------------");
};

// Function to delete an expense by its ID with validation and confirmation
const deletedExpenses = (id) => {
  const expenses = getAllExpenses();
  const deletedExpense = expenses.find((expense) => expense.id === id); // Find expense to delete by ID

  if (id === undefined || isNaN(id)) {
    console.log("Please provide a valid ID to delete an expense.");
    return; // Exit if ID is invalid
  }

  if (!expenses.some((expense) => expense.id === id)) {
    console.log(`No expense found with ID ${id}.`);
    return; // Exit if no expense matches the ID
  }
  const updatedExpenses = expenses.filter((expense) => expense.id !== id); // Filter out the expense to delete
  expensesSave(updatedExpenses); // Save updated expenses to file
  console.log(`Expense with ID ${id} has been deleted successfully!`); // Confirm deletion
};

// Function to update an existing expense by its ID with validation and confirmation
// Function to update an existing expense by its ID with validation and confirmation
const updateExpense = (id, updatedAmount, updatedName) => {
  const expenses = getAllExpenses();
  const expenseIndex = expenses.findIndex((expense) => expense.id === id);

  if (id === undefined || isNaN(id)) {
    console.log("Please provide a valid ID to update an expense.");
    return;
  }

  if (expenseIndex === -1) {
    console.log(`No expense found with ID ${id}.`);
    return;
  }

  // Ensure at least one property is being updated
  if (updatedAmount === undefined && updatedName === undefined) {
    console.log("Please provide an amount, a name, or both to update.");
    return;
  }

  // Validate amount ONLY if the user provided one
  if (updatedAmount !== undefined) {
    if (isNaN(updatedAmount) || updatedAmount <= 0 || updatedAmount > 1000000) {
      console.log("Please provide a valid number for the amount.");
      return;
    }
  }

  // Validate name ONLY if the user provided one
  if (updatedName !== undefined) {
    if (typeof updatedName !== "string" || updatedName.trim() === "") {
      console.log("Please provide a valid name for the expense.");
      return;
    }
  }

  // Apply updates conditionally
  expenses[expenseIndex].amount =
    updatedAmount !== undefined ? updatedAmount : expenses[expenseIndex].amount;
  expenses[expenseIndex].name =
    updatedName !== undefined
      ? updatedName.trim()
      : expenses[expenseIndex].name;

  expensesSave(expenses);
  console.log(`Expense with ID ${id} has been updated successfully!`);
};

const helpMessage = `Usage:
  node index.js add <amount> <name>         - Add a new expense with the specified amount and name.
  node index.js list                        - List all expenses.
  node index.js total                       - Display the total of all expenses.
  node index.js total-by-date <date>        - Display total expenses for a specific date.
  node index.js select <id1> <id2> ...      - Mark expenses as selected and display their total.
  node index.js update <id> <amount> [name] - Update amount, or amount and name.
  node index.js update <id> <name>          - Update name only.
  node index.js update <id> <amount>        - Update amount only.
  node index.js delete <id>                 - Delete an expense by its ID.
  node index.js help                        - Display all available commands.
`; // Help message displayed for 'help' command

if (command === "add") {
  addExpenses(arguments, expenseName); // Execute add command
} else if (command === "list") {
  listExpenses(); // Execute list command
} else if (command === "total") {
  TotalExpenses(); // Execute total command
} else if (command === "total-by-date") {
  totalBydate(dateInput); // Execute total-by-date command
} else if (command === "select") {
  selectAndTotalExpenses(multipleIds); // Execute select command with multiple IDs
} else if (command === "help") {
  console.log(helpMessage); // Display help message
} else if (command === "update") {
  updateExpense(expenseId, newAmount, newName); // Execute update command with expense ID and new values
} else if (command === "delete") {
  deletedExpenses(expenseId); // Execute delete command with expense ID
} else {
  console.log(
    "Invalid command. Please use 'add', 'list', 'total', 'total-by-date', 'select', 'update', 'delete', or 'help'.", // Error for invalid command
  );
}
