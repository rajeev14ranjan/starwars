export class LoginToken {
  constructor(public userName?: string, public passHash?: string) {}
}

export class UserDetail {
  constructor(
    public userid?: number,
    public username?: string,
    public fullname?: string,
    public access?: string,
    public data?: string,
    public authkey?: string
  ) {}
}

export class Logs {
  constructor(
    public userid?: number,
    public fullname?: string,
    public timestamp?: Date,
    public useragent?: string,
    public score?: string,
    public screen?: string
  ) {}
}

export class Feedback {
  constructor(
    public userid?: number,
    public logid?: string,
    public timestamp?: Date,
    public useragent?: string,
    public rating?: number,
    public feedback?: string
  ) {}
}

export class UserScore {
  constructor(
    public userid: number,
    public game: string,
    public score: string
  ) {}
}

export class Expense {
  constructor(
    public id: number,
    public description: string,
    public amount: number,
    public shares: Array<Share>,
    public payers: Array<Share>
  ) {}
}

export class Share {
  constructor(public name: string, public amount: number) {}
}

export class Transaction {
  constructor(
    public payer: string,
    public receiver: string,
    public amount: number
  ) {}
}

export class Graph {
  public vertexCount: number;
  public adjacencyList = new Map<string, Array<Share>>();

  get allVertices(): Array<string> {
    return Array.from(this.adjacencyList.keys());
  }

  public addExpense(lender: string, borrower: string, amount: number) {
    // Adding expense edge if not already present in the adjacency list
    [lender, borrower].forEach(person => {
      if (!this.adjacencyList.has(person)) {
        this.adjacencyList.set(person, []);
        this.vertexCount = this.adjacencyList.size;
      }
    });

    // Update the Edge between the two vertex
    const lenderExp = this.adjacencyList
      .get(lender)
      .find(exp => exp.name === borrower);
    const borrowerExp = this.adjacencyList
      .get(borrower)
      .find(exp => exp.name === lender);

    if (lenderExp) {
      lenderExp.amount += amount;
    } else {
      this.adjacencyList.get(lender).push({ name: borrower, amount });
    }

    if (borrowerExp) {
      borrowerExp.amount -= amount;
    } else {
      this.adjacencyList
        .get(borrower)
        .push({ name: lender, amount: -1 * amount });
    }
  }

  public getTotalDueOf(name: string): number {
    const adjacencyRow = this.adjacencyList.get(name);
    return adjacencyRow.reduce((acc, p) => acc + p.amount, 0);
  }

  public getTotalDue() {
    return this.allVertices.map(name => ({
      name,
      amount: this.getTotalDueOf(name)
    }));
  }
}
