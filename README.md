# Expenses Tracker

A simple CLI application to track and manage your expenses.

## Installation

Ensure you have Node.js installed, then clone this repository and run:

```bash
npm install  # or just ensure fs module is available (built-in)
```

## Usage

Run the program from the command line with the following commands:

### Add an Expense

```bash
node index.js add <amount> <name>
```

Add a new expense with the specified amount and name.

**Example:**
```bash
node index.js add 250 groceries
```

### List All Expenses

```bash
node index.js list
```

Displays all expenses with their ID, name, amount, and date.

### View Total Expenses

```bash
node index.js total
```

Calculates and displays the total amount of all expenses.

### View Expenses by Date

```bash
node index.js total-by-date <YYYY-MM-DD>
```

Shows all expenses and their total for a specific date.

**Example:**
```bash
node index.js total-by-date 2026-05-22
```

### Select and Total Expenses

```bash
node index.js select <id1> <id2> <id3> ...
```

Marks multiple expenses as selected by their IDs and displays their total.

**Example:**
```bash
node index.js select 1 2 4
```

### Update an Expense

```bash
node index.js update <id> <amount> [name]
node index.js update <id> <name>
node index.js update <id> <amount>
```

Updates an existing expense by its ID. You can update the amount, name, or both.

**Examples:**
```bash
node index.js update 1 300                    # Update amount only
node index.js update 1 groceries              # Update name only
node index.js update 1 300 groceries          # Update both amount and name
```

### Delete an Expense

```bash
node index.js delete <id>
```

Deletes an expense by its ID.

**Example:**
```bash
node index.js delete 1
```

### Show Help

```bash
node index.js help
```

Displays all available commands and their usage.

## Data Storage

Expenses are stored in `expenses.json` in the following format:

```json
[
  {
    "id": 1,
    "name": "expense name",
    "amount": 100,
    "date": "2026-05-20T11:52:10.813Z",
    "selected": false
  }
]
```

## License

MIT