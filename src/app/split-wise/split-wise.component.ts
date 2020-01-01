import { Component } from '@angular/core';
import { Expense, Graph, Tranasaction } from '../model/app.model';

@Component({
  selector: 'app-split-wise',
  templateUrl: './split-wise.component.html',
  styleUrls: ['./split-wise.component.css']
})
export class SplitWiseComponent {
  public payees: Array<string>;
  public expenses: Array<Expense>;
  public totalExp: Array<string | number>;
  public userInputType = 0; // 0: people, 1: Bills
  public userInput: string;
  public currency = '₹';
  public expenseListKey = 0;
  public expenseGraph: Graph;
  public simpleTransactions: Array<Tranasaction>;
  private preDefinedDetails = [
    'Enter comma (,) seperated name of all people involved, with first being default payee',
    'Add Expense detail in below format <br/><code>[Description, Amount, Individual Shares, Payer]</code>'
  ];
  private helpingText = [
    'expense description',
    'expense amount or expression (50 * 5) in ₹',
    'expense individual shares (name of the person : ratio of expense share)',
    'name of the Payer'
  ];
  public detailedExpense: string;

  constructor() {
    this.expenses = new Array<Expense>();
    this.payees = [];
    this.detailedExpense = this.preDefinedDetails[0];
  }

  changeInputType(type: number) {
    this.userInputType = type;
    this.detailedExpense = this.preDefinedDetails[type];
  }

  entryChanged(e: KeyboardEvent) {
    const isSubmit = e.key === 'Enter';
    if (this.userInputType === 0) {
      this.addPayees(isSubmit);
    } else if (this.userInputType === 1) {
      this.addExpense(isSubmit);
    }
  }

  // Extracts the Expense breakup from the Expenses coded details
  getExpenseBreakup() {
    const inputs = this.userInput.split(',').map(x => x && x.trim());
    const desc = inputs[0];
    const expdetail = inputs[2];
    const amount = this.parseAmount(inputs[1]);
    const shares = this.payees.map(name => ({ name, amount: 0 }));

    if (expdetail) {
      const eachExpanse = expdetail.split(' ');
      const totalRatio = eachExpanse.reduce((sum, bill) => {
        const [name, ratio] = bill.split(':');
        const totalMatch = this.payees.filter(payeeName =>
          this.startsWith(name, payeeName)
        ).length;
        sum += parseFloat(ratio ? ratio : '1') * totalMatch;
        return sum;
      }, 0);
      eachExpanse.forEach(eachShare => {
        const [name, ratio] = eachShare.split(':');

        shares.forEach(share => {
          if (this.startsWith(name, share.name)) {
            const hisTotal =
              (parseFloat(ratio ? ratio : '1') * amount) / totalRatio;
            share.amount = this.round(hisTotal);
          }
        });
      });
    } else {
      shares.forEach(bill => {
        bill.amount = this.round(amount / this.payees.length);
      });
    }

    // Deciding the payee of the expense
    const payee =
      this.payees.find(payeeName => this.startsWith(inputs[3], payeeName)) ||
      this.payees[0];

    return { desc, amount, shares, payee };
  }

  // to compute amount from entered string
  parseAmount(amountStr: string) {
    if (!amountStr || !amountStr.trim()) {
      return 0;
    }
    const amount = parseFloat(amountStr);
    if (amount.toString() === amountStr) {
      return amount;
    }

    try {
      return new Function(`return ${amountStr}`)();
    } catch {
      return amount;
    }
  }

  // Handles the display and addition of payees
  addPayees(isSubmit: boolean) {
    const list = this.userInput
      .split(',')
      .filter(name => name && name.trim())
      .map(name => this.firstCapital(name.trim()));

    if (isSubmit) {
      this.payees = list;
      this.userInput = '';
      this.changeInputType(1);
      this.expenses = new Array<Expense>();
    } else {
      this.detailedExpense = `Person Entered : <code><ol>${list
        .map(
          (name, i) => `<li>
          ${name}
          ${i === 0 ? ' (Default payee)' : ''}
          </li>`
        )
        .join('')}</ol>
        ${
          this.expenses.length
            ? '⚠️ This will delete all current expenses<br/>'
            : ''
        }</code>Press enter to Add`;
    }
  }

  round(num: number) {
    return Math.round(num * 100) / 100;
  }

  addExpense(isSubmit: boolean) {
    const { desc, amount, shares, payee } = this.getExpenseBreakup();
    if (isSubmit) {
      const expense = new Expense(
        this.expenseListKey++,
        this.firstCapital(desc),
        amount,
        shares,
        payee
      );
      this.expenses.push(expense);
      this.userInput = '';
      this.changeInputType(1);
      this.calculateTotalExpense();
    } else {
      const inputStage = (this.userInput.match(/,/g) || []).length;
      this.detailedExpense = `Enter ${this.helpingText[inputStage] ||
        'Invalid input'} <br/><code><ul>
      <li>Description : ${desc}</li>
      <li>Amount : ${this.currency + amount}</li>
      <li>Paid By : ${payee}</li>
      <li>Shares :
        <ol>
        ${shares
          .map(s => `<li>${s.name} - ${this.currency + s.amount}</li>`)
          .join('')}
        </ol>
      </li>
      </ul></code>
      Press enter to Add`;
    }
  }

  deleteExpense(removedId: number) {
    this.expenses = this.expenses.filter(exp => exp.id !== removedId);
    this.calculateTotalExpense();
  }

  deleteAllExpense() {
    this.expenses = new Array<Expense>();
    this.calculateTotalExpense();
  }

  // Calculates the total expense once an expense is added/deleted
  calculateTotalExpense() {
    let totalExpSum = 0;
    this.expenseGraph = new Graph();
    const sharedExpense = new Array(this.payees.length).fill(0);
    for (const exp of this.expenses) {
      totalExpSum += exp.amount;
      const lender = exp.payer;

      for (let i = 0; i < exp.shares.length; i++) {
        sharedExpense[i] += exp.shares[i].amount;
        this.expenseGraph.addExpense(
          lender,
          exp.shares[i].name,
          exp.shares[i].amount
        );
      }
    }

    this.totalExp = [
      ' T O T A L',
      ...sharedExpense.map(amt => this.currency + this.round(amt)),
      this.currency + totalExpSum
    ];

    this.simplifyTransaction();
  }

  // computes the total transactions needed to settle the dues
  simplifyTransaction() {
    this.simpleTransactions = new Array<Tranasaction>();
    const allExpenseDues = this.expenseGraph.getTotalDue();

    while (allExpenseDues.length) {
      allExpenseDues.sort((a, b) => a.amount - b.amount);
      const cPayer = allExpenseDues[0];
      const cReceiver = allExpenseDues[allExpenseDues.length - 1];

      if (Math.abs(cPayer.amount) - cReceiver.amount < 0.001) {
        this.simpleTransactions.push(
          new Tranasaction(
            cPayer.name,
            cReceiver.name,
            this.round(cReceiver.amount)
          )
        );
        allExpenseDues.pop();
        allExpenseDues.shift();
      } else if (Math.abs(cReceiver.amount) > cPayer.amount) {
        this.simpleTransactions.push(
          new Tranasaction(
            cPayer.name,
            cReceiver.name,
            this.round(Math.abs(cPayer.amount))
          )
        );
        allExpenseDues.shift();
        cReceiver.amount += cPayer.amount;
      } else {
        this.simpleTransactions.push(
          new Tranasaction(
            cPayer.name,
            cReceiver.name,
            this.round(cReceiver.amount)
          )
        );
        allExpenseDues.pop();
        cPayer.amount += cReceiver.amount;
      }
    }

    this.simpleTransactions = this.simpleTransactions.filter(
      transact => transact.amount
    );
  }

  firstCapital(str: string) {
    return str.substr(0, 1).toUpperCase() + str.substr(1);
  }

  startsWith(name: string, fullName: string): boolean {
    if (!name || !name.trim() || !fullName) {
      return false;
    }
    return fullName.toLowerCase().startsWith(name.trim().toLowerCase());
  }

  trackByExp(index: number, item: Expense) {
    return item.id;
  }
}
