import { Component } from '@angular/core';
import { Expense } from '../model/app.model';

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
  public currency = '₹ ';
  private preDefinedDetails = [
    'Enter comma (,) seperated name of all people involved',
    'Add Expense detail in below format <br/><code>[Description , Amount , Individual Shares]</code>'
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
    const amount = parseFloat(`${inputs[1] || '0'}`);
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
    return { desc, amount, shares };
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
        .map(name => `<li>${name}</li>`)
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
    const { desc, amount, shares } = this.getExpenseBreakup();
    if (isSubmit) {
      const expense = new Expense(
        this.expenses.length,
        this.firstCapital(desc),
        amount,
        shares
      );
      this.expenses.push(expense);
      this.userInput = '';
      this.changeInputType(1);
      this.calculateTotalExpense();
    } else {
      this.detailedExpense = `Entered Expense details : <code><ul>
      <li>Description : ${desc}</li>
      <li>Amount : ${this.currency + amount}</li>
      <li>Shares : <ol>
        ${shares
          .filter(s => s.amount)
          .map(s => `<li>${s.name} - ${this.currency + s.amount}</li>`)
          .join('')}
        </oi>
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

  calculateTotalExpense() {
    let totalExpSum = 0;
    const sharedExpense = new Array(this.payees.length).fill(0);
    for (const exp of this.expenses) {
      totalExpSum += exp.amount;

      for (let i = 0; i < exp.shares.length; i++) {
        sharedExpense[i] += exp.shares[i].amount;
      }
    }

    this.totalExp = [
      ' T O T A L',
      ...sharedExpense.map(amt => this.currency + this.round(amt)),
      this.currency + totalExpSum
    ];
  }

  firstCapital(str: string) {
    return str.substr(0, 1).toUpperCase() + str.substr(1);
  }

  startsWith(name: string, fullName: string): boolean {
    if (!name || !fullName) {
      return false;
    }
    name = name ? name.trim().toLowerCase() : name;
    return fullName.toLowerCase().startsWith(name);
  }

  trackByExp(index: number, item) {
    return item.id;
  }
}
