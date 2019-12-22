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
    public shares: Array<Share>
  ) {}
}

export class Share {
  constructor(public name: string, public amount: number) {}
}
