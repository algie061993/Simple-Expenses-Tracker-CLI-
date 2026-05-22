/** TO DO: Expand this program to calculate the total expenses
 * a day, a month, or a year. You can also add a feature to delete
 * an expense by its ID or name.
 * You can also add a feature to edit an existing expense by its ID or name.
 **/

const fs = require("fs");

const command = process.argv[2];
const arguments = Number(process.argv[3]);
const expenseName = process.argv[4];
const dateInput = process.argv[3];
const expenseId = Number(process.argv[3]);

/**
 * Reads and parses the expenses.json file to retrieve all expenses.
 * @returns {Array} An array of expense objects.
 */
const getAllExpenses = () => {
  const expenses = fs.readFileSync("expenses.json", "utf-8");
  return JSON.parse(expenses);
};

/**
 * Saves an array of expenses to the expenses.json file.
 * @param {Array} expenses - The array of expense objects to save.
 */
const expensesSave = (expenses) => {
  const textData = JSON.stringify(expenses, null, 2);
  fs.writeFileSync("expenses.json", textData);
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

  const currentExpenses = getAllExpenses();

  const newExpenses = {
    id: currentExpenses.length + 1,
    name: name,
    amount: amount,
    date: new Date().toISOString(),
    selected: false,
  };

  currentExpenses.push(newExpenses);

  expensesSave(currentExpenses);
  console.log("Expense added successfully!");
};

/**
 * Displays all expenses in a formatted list with their ID, name, amount, and date.
 * Shows [Selected] tag for expenses that have been marked as selected.
 */
const listExpenses = () => {
  const expenses = getAllExpenses();

  if (expenses.length === 0) {
    console.log("No expenses found.");
    return;
  }

  console.log("\n--- Your Expenses ---");

  for (let i = 0; i < expenses.length; i++) {
    const expensesItem = expenses[i];

    console.log(
      `${expensesItem.id}. ${expensesItem.name} - $${expensesItem.amount} (Date: ${expensesItem.date}) ${expensesItem.selected ? "[Selected]" : ""}`,
    );
  }
  console.log("---------------------\n");
};

/**
 * Marks an expense as selected by its ID.
 * @param {number} id - The ID of the expense to mark as selected.
 */
const selectedExpense = (id) => {
  const expenses = getAllExpenses();
  const expense = expenses.find((item) => item.id === id);
  if (!expense) {
    console.log(`Expense with ID ${id} not found.`);
    return;
  }
  const idToFind = expense.id;
  const selectedExpense = expenses.find((item) => item.id === idToFind);
  if (!selectedExpense) {
    console.log(`Expense with ID ${id} not found.`);
    return;
  }
  selectedExpense.selected = true;
  expensesSave(expenses);
  console.log(`Expense with ID ${id} has been selected.`);
};

/**
 * Calculates and displays the total of all expenses.
 * Shows each expense and its amount, then displays the grand total.
 */
const TotalExpenses = () => {
  const expenses = getAllExpenses();

  let sum = 0;
  let name = "";
  console.log("----------- List of Expenses -----------");
  for (let i = 0; i < expenses.length; i++) {
    sum += expenses[i].amount;
    name = expenses[i].name;

    console.log(`${name}: ₱${expenses[i].amount}`);
  }
  console.log("----------------------------------------");
  console.log("------------ Total Expenses ------------");
  console.log(`Total Expenses: ₱${sum}`);
  console.log("----------------------------------------");
};

/**
 * Calculates and displays total expenses for a specific date.
 * @param {string} targetDate - The date to filter expenses by (YYYY-MM-DD format).
 */
const totalBydate = (targetDate) => {
  const expenses = getAllExpenses();

  if (
    isNaN(Date.parse(targetDate)) ||
    targetDate === undefined ||
    targetDate.trim() === ""
  ) {
    console.log("Please provide a valid date in the format YYYY-MM-DD.");
    return;
  }

  let sum = 0;
  console.log(`--- Expenses for ${targetDate} ---`);

  for (let i = 0; i < expenses.length; i++) {
    const expenseDate = new Date(expenses[i].date).toISOString().split("T")[0];
    if (expenseDate === targetDate) {
      sum += expenses[i].amount;
      console.log(`${expenses[i].name}: ₱${expenses[i].amount}`);
    }
  }
  console.log("----------------------------------------");
  console.log(`Total Expenses for ${targetDate}: ₱${sum}`);
  console.log("----------------------------------------");
};

/**
 * Calculates and displays the total of all selected expenses.
 * Clears the selection status for all expenses after calculation.
 */
const selectedExpenseTotal = () => {
  const expenses = getAllExpenses();
  let sum = 0;

  console.log("--- Selected Expenses ---");
  for (let i = 0; i < expenses.length; i++) {
    if (expenses[i].selected) {
      sum += expenses[i].amount;
      console.log(`${expenses[i].name}: $${expenses[i].amount}`);
    }
  }
  console.log("----------------------------------------");
  console.log(`Total for selected expenses: $${sum}`);
  for (let i = 0; i < expenses.length; i++) {
    expenses[i].selected = false;
  }
  expensesSave(expenses);
};

const helpMessage = `Usage:
  node index.js add <amount> <name>       - Add a new expense with the specified amount and name.
  node index.js list                      - List all expenses.
  node index.js total                     - Display the total of all expenses.
  node index.js total-by-date <date>     - Display total expenses for a specific date.
  node index.js select <id>              - Mark an expense as selected.
  node index.js selected-total           - Display the total of all selected expenses.
`;

if (command === "add") {
  addExpenses(arguments, expenseName);
} else if (command === "list") {
  listExpenses();
} else if (command === "total") {
  TotalExpenses();
} else if (command === "total-by-date") {
  totalBydate(dateInput);
} else if (command === "select") {
  selectedExpense(expenseId);
} else if (command === "selected-total") {
  selectedExpenseTotal(expenseId);
} else if (command === "help") {
  console.log(helpMessage);
} else {
  console.log(
    "Invalid command. Please use 'add', 'list', 'total', 'total-by-date', or 'selected-total'.",
  );
}
