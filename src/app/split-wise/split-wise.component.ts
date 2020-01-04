import { Component } from '@angular/core';
import { Expense, Graph, Tranasaction, Share } from '../model/app.model';

@Component({
  selector: 'app-split-wise',
  templateUrl: './split-wise.component.html',
  styleUrls: ['./split-wise.component.css']
})
export class SplitWiseComponent {
  public peoples: Array<string>;
  public expenses: Array<Expense>;
  public totalExp: Array<string | number>;
  public userInputType = 0; // 0: people, 1: Bills
  public userInput: string;
  public currency = '₹';
  public expenseListKey = 0;
  public expPopoverId: number;
  public expenseGraph: Graph;
  public simpleTransactions: Array<Tranasaction>;
  private preDefinedDetails = [
    'Enter comma (,) seperated name of all people involved, with first being default Payer',
    'Add Expense detail in below format <br/><code>[Description, Amount, Individual Shares, Payer]</code>'
  ];
  private helpingText = [
    'expense description',
    'expense amount or expression (50 * 5) in ₹',
    'expense individual shares (name of the Person : ratio of expense share)',
    'name of the Payers (name of the Payer : ratio of expense share)'
  ];
  public detailedExpense: string;

  constructor() {
    this.expenses = new Array<Expense>();
    this.peoples = [];
    this.detailedExpense = this.preDefinedDetails[0];
  }

  changeInputType(type: number) {
    this.userInputType = type;
    this.detailedExpense = this.preDefinedDetails[type];
  }

  entryChanged(e: KeyboardEvent) {
    const isSubmit = e.key === 'Enter';
    if (this.userInputType === 0) {
      this.addPeoples(isSubmit);
    } else if (this.userInputType === 1) {
      this.addExpense(isSubmit);
    }
  }

  // Extracts the Expense breakup from the Expenses coded details
  getExpenseBreakup() {
    const inputs = this.userInput.split(',').map(x => x && x.trim());
    const desc = inputs[0];
    const amount = this.parseAmount(inputs[1]);

    // Calculating individuals expense shares of people
    const shares = this.getSharedRatioBreakup(inputs[2], amount, true);

    // Deciding the individual payer of the expense
    const payers = this.getSharedRatioBreakup(inputs[3], amount, false);

    return { desc, amount, shares, payers };
  }

  // Computes shares as per ration passed
  getSharedRatioBreakup(
    expdetail: string,
    totalAmount: number,
    distributeEqually: boolean
  ): Array<Share> {
    const shares = this.peoples.map(name => ({ name, amount: 0 }));
    let totalRatio = 0;

    // Computing the total ration of matech persons
    if (expdetail) {
      const eachExpanse = expdetail.split(' ');
      totalRatio = eachExpanse.reduce((sum, bill) => {
        const [name, ratio] = bill.split(':');
        const totalMatch = this.peoples.filter(peopleName =>
          this.startsWith(name, peopleName)
        ).length;
        sum += parseFloat(ratio ? ratio : '1') * totalMatch;
        return sum;
      }, 0);

      if (totalRatio) {
        eachExpanse.forEach(eachShare => {
          const [name, ratio] = eachShare.split(':');

          shares.forEach(share => {
            if (this.startsWith(name, share.name)) {
              const hisTotal =
                (parseFloat(ratio ? ratio : '1') * totalAmount) / totalRatio;
              share.amount = this.round(hisTotal);
            }
          });
        });
      }
    }

    // if none of the persons matched
    if (totalRatio === 0) {
      if (distributeEqually) {
        shares.forEach(bill => {
          bill.amount = this.round(totalAmount / this.peoples.length);
        });
      } else {
        shares[0].amount = totalAmount;
      }
    }
    return shares;
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
      return new Function(`return ${amountStr.replace(/k/g, '*1e3')}`)();
    } catch {
      return amount;
    }
  }

  // Handles the display and addition of Peoples
  addPeoples(isSubmit: boolean) {
    const list = this.userInput
      .split(',')
      .filter(name => name && name.trim())
      .map(name => this.firstCapital(name.trim()));

    if (isSubmit) {
      this.peoples = list;
      this.userInput = '';
      this.changeInputType(1);
      this.expenses = new Array<Expense>();
    } else {
      this.detailedExpense = `Person Entered : <code><ol>${list
        .map(
          (name, i) => `<li>
          ${name}
          ${i === 0 ? ' (Default payer)' : ''}
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
    const { desc, amount, shares, payers } = this.getExpenseBreakup();
    if (isSubmit) {
      const expense = new Expense(
        this.expenseListKey++,
        this.firstCapital(desc),
        amount,
        shares,
        payers
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
      <li>Shares :
        <ol>
        ${shares
          .filter(s => inputStage === 2 || s.amount)
          .map(s => `<li>${s.name} - ${this.currency + s.amount}</li>`)
          .join('')}
        </ol>
      </li>
      <li>Paid By :
        <ol>
        ${payers
          .filter(p => inputStage === 3 || p.amount)
          .map(p => `<li>${p.name} - ${this.currency + p.amount}</li>`)
          .join('')}
        </ol>
      </li>
      </ul></code>
      Press Enter to Add`;
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
    const sharedExpense = new Array(this.peoples.length).fill(0);
    for (const exp of this.expenses) {
      const lenders = exp.payers;
      const borrowers = exp.shares;
      const expTotalAmount = exp.amount;
      totalExpSum += expTotalAmount;

      for (let i = 0; i < borrowers.length; i++) {
        const borrowerName = borrowers[i].name;
        const borrowedAmount = borrowers[i].amount;
        sharedExpense[i] += borrowedAmount;

        lenders.forEach(lender => {
          if (lender.amount) {
            this.expenseGraph.addExpense(
              lender.name,
              borrowerName,
              (borrowedAmount * lender.amount) / expTotalAmount
            );
          }
        });
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

      if (Math.abs(Math.abs(cPayer.amount) - cReceiver.amount) < 0.001) {
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

  showExpensePopOver(expId: number) {
    this.expPopoverId = expId;
  }
}
