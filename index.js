/** TO DO: Expand this program to calculate the total expenses
 * a day, a month, or a year. You can also add a feature to delete
 * an expense by its ID or name.
 * You can also add a feature to edit an existing expense by its ID or name.
 **/

const fs = require("fs");

const command = process.argv[2];
const arguments = Number(process.argv[3]);
const expenseName = process.argv[4];

// Function to get all expenses from the file
const getAllExpenses = () => {
  const expenses = fs.readFileSync("expenses.json", "utf-8");
  return JSON.parse(expenses);
};

const expensesSave = (expenses) => {
  const textData = JSON.stringify(expenses, null, 2);
  fs.writeFileSync("expenses.json", textData);
};

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
  };

  currentExpenses.push(newExpenses);

  expensesSave(currentExpenses);
  console.log("Expense added successfully!");
};

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
      `${expensesItem.id}. ${expensesItem.name} - $${expensesItem.amount} (Date: ${expensesItem.date})`,
    );
  }
  console.log("---------------------\n");
};

const TotalExpenses = () => {
  const expenses = getAllExpenses();

  let sum = 0;
  let name = "";
  console.log("----------- List of Expenses -----------");
  for (let i = 0; i < expenses.length; i++) {
    sum += expenses[i].amount;
    name = expenses[i].name;

    console.log(`${name}: $${expenses[i].amount}`);
  }
  console.log("----------------------------------------");
  console.log("------------ Total Expenses ------------");
  console.log(`Total Expenses: $${sum}`);
  console.log("----------------------------------------");
};

if (command === "add") {
  addExpenses(arguments, expenseName);
} else if (command === "list") {
  listExpenses();
} else if (command === "total") {
  TotalExpenses();
} else {
  console.log("Invalid command. Please use 'add', 'list', or 'total'.");
}
