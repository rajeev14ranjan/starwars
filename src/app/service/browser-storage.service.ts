import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpHelperService } from './http-helper.service';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { UAParser } from 'ua-parser-js';
import { environment } from 'src/environments/environment';


@Injectable()
export class StorageService {
    private autoLoginToken = 'starAut0L0g1nTok3n';
    private allUsers: Array<UserDetail>;
    public uniquieLogid: string;
    public loggedUser = new UserDetail();
    public loggedUserName: string;
    public loggedUserID: string;
    public logScore = 0;
    public parser = new UAParser();
    public isGuestUser: boolean;
    //public isBrowserOnline = Navigator.onLine;

    constructor(private _router: Router, private _dbcon: HttpHelperService) { }

    public getAllUsers(): Observable<Array<UserDetail>> {
        let url = `api/stars.php?a=getUser`;
        return this._dbcon.get(url).pipe(
            map((res: Array<UserDetail>) => {
                this.allUsers = res;
                return res;
            })
        );
    }

    public getHighScore() {
        let url = `api/stars.php?a=score`;

        return this._dbcon.get(url).pipe(
            map((res: Array<any>) => {
                if (res.length == 0) return { "fullname": 'SYSTEM', "score": 0 };
                return res[0];
            })
        );
    }


    public checkForLogin() {
        if (!this.loggedUserName && environment.production) {
            this._router.navigateByUrl('login');
        }
    }

    public autoLoginIfTokenAvailable() {
        try {
            let token: LoginToken = JSON.parse(localStorage.getItem(this.autoLoginToken));
            if (token) {
                this.checkCredentialValidity(token.userName, token.passHash, true).subscribe(
                    (response: boolean) => {
                        if (response) {
                            this.uniquieLogid = (Date.now()).toString(36).toUpperCase();
                            this.saveUserLog();
                            this._router.navigateByUrl('dashboard');
                        } else {
                            this.deleteAutoLoginToken();
                        }
                    });
            }
        }
        catch
        {
            this.deleteAutoLoginToken();
        }
    }

    public deleteAutoLoginToken() {
        localStorage.removeItem(this.autoLoginToken);
    }

    public saveAutoLoginToken(un: string, pw: string) {
        let token = new LoginToken(un, this.hash(pw));
        localStorage.setItem(this.autoLoginToken, JSON.stringify(token));
    }

    public isAdmin(): boolean {
        return !environment.production || this.loggedUser.access == 'admin';
    }

    public getFullUserNameValidity(checkUserName: string) {
        let url = './api/stars.php';
        let postData = { 'action': 'validate', 'un': checkUserName };
        return this._dbcon.post(url, postData);
    }

    public saveCredentials(fullName: string, userName: string, passWord: string, isLogin = true): Observable<boolean> {
        if (fullName && userName && passWord) {

            const postData = { 'fn': '', 'un': '', 'pw': '', 'action': 'createUser' };
            postData.fn = this.trim(fullName);
            postData.un = this.trim(userName);
            postData.pw = this.hash(this.trim(passWord));

            return this._dbcon.post('./api/stars.php', postData).pipe(
                map((res: any) => {
                    if (isLogin) {
                        if (res.status) {
                            this.loggedUser = new UserDetail();
                            this.loggedUser.username = userName;
                            this.loggedUser.fullname = fullName;
                            this.loggedUser.access = 'user';
                        } else {
                            this.loggedUser = new UserDetail();
                        }
                        return true;
                    } else {
                        return true;
                    }
                }));
        }
    }

    public trim(text: string) {
        return (text && typeof text == 'string' ? text.trim() : text);
    }

    public checkCredentialValidity(checkUserName: string, checkPassWord: string, hashed = false): Observable<boolean> {
        let url = `./api/stars.php`;
        const postData = { 'un': checkUserName, 'pw': hashed ? checkPassWord : this.hash(checkPassWord), 'action': 'login' };

        return this._dbcon.post(url, postData).pipe(
            map((res: Array<UserDetail>) => {
                if (res && res.length > 0) {
                    this.loggedUser = res[0];
                    this.loggedUserName = res[0].fullname;
                    this.loggedUserID = res[0].username;
                    this.isGuestUser = false;
                    return true;
                } else {
                    this.loggedUserName = '';
                    return false;
                }
            }));
    }

    public saveUserLog() {
        let postData = {
            'id': this.loggedUser.userid,
            'sc': this.logScore,
            'ua': this.getOsBrowser(),
            'scr': `${window.innerWidth} x ${window.innerHeight}`,
            'action': 'insertLog'
        }
        this.logScore = 0;

        if (this.uniquieLogid) {
            postData['logid'] = this.uniquieLogid;
        }
        this._dbcon.post('./api/stars.php', postData).subscribe();
    }

    public saveFeedback(rating: number, feedback: string) {
        let postData = {
            'id': this.loggedUser.userid,
            'rat': rating,
            'fd': feedback,
            'ua': this.getOsBrowser(),
            'logid': this.uniquieLogid,
            'action': 'feedback'
        }
        return this._dbcon.post('./api/stars.php', postData);
    }

    public saveUserScore(game: string, score: string) {
        let postData = {
            'action': "saveScore",
            'id': this.loggedUser.userid,
            'game': game,
            'score': score
        }
        return this._dbcon.post('./api/stars.php', postData);
    }

    public getFeedback(userId: number): Observable<Array<Feedback>> {
        let url = `./api/stars.php?a=getFeedback&id=${userId}`;
        return this._dbcon.get(url);
    }

    public getUserScore(game: string): Observable<Array<UserScore>> {
        let url = `./api/stars.php?a=getUserScore&game=${game}&uid=${this.loggedUser.userid}`;
        return this._dbcon.get(url);
    }

    public getLogforUser(userId: number): Observable<Array<Logs>> {
        let url = `./api/stars.php?a=getLogs&id=${userId}`;
        return this._dbcon.get(url) as Observable<Array<Logs>>;
    }

    public deleteUser(userId: number, userName: string) {
        let postData = {
            'usr': userName,
            'uid': userId,
            'action': 'deleteUser'
        }
        return this._dbcon.post('./api/stars.php', postData);

    }

    public hash(passText: string) {
        var a = 1, c = 0, iterator, o;
        if (passText) {
            a = 0;
            for (iterator = passText.length - 1; iterator >= 0; iterator--) {
                o = passText.charCodeAt(iterator);
                a = (a << 6 & 268435455) + o + (o << 14);
                c = a & 266338304;
                a = c !== 0 ? a ^ c >> 21 : a;
            }
        }
        return a.toString(36).toUpperCase();
    }

    public CreateDummyUser(userlenth: number): Observable<boolean> {

        let isInValid, fn, un, ps = '', cnt = 10;
        do {
            fn = '';
            for (let i = 0; i < 2 * userlenth; i++) {
                fn += this.randomLetter(i == 0 || i == userlenth) + (i == userlenth - 1 ? ' ' : '');
            }
            un = fn.split(' ')[0].substr(0, 2) + fn.split(' ')[1].substr(0, 2);
            un = un.toLowerCase();
            ps = un;
            cnt--;
            isInValid = this.allUsers.some(user => user.username == un);
        } while (isInValid && cnt > 0);

        if (cnt > 0) {
            return this.saveCredentials(fn, un, ps, false);

        } else {
            return of(false);
        }


    }

    public randomLetter(isCaptial = false) {
        return String.fromCharCode(Math.floor(Math.random() * 26) + (isCaptial ? 65 : 97));
    }

    public getOsBrowser(): string {
        let userAgent = navigator.userAgent;
        return `${this.parser.getBrowser(userAgent).name} on ${this.parser.getOS(userAgent).name}`;
    }

}

class LoginToken {
    constructor(
        public userName?: string,
        public passHash?: string
    ) { }
}

export class UserDetail {
    constructor(
        public userid?: number,
        public username?: string,
        public fullname?: string,
        public access?: string,
        public data?: string,
        public authkey?: string
    ) { }
}

export class Logs {
    constructor(
        public userid?: number,
        public fullname?: string,
        public timestamp?: Date,
        public useragent?: string,
        public score?: string,
        public screen?: string
    ) { }
}

export class Feedback {
    constructor(
        public userid?: number,
        public logid?: string,
        public timestamp?: Date,
        public useragent?: string,
        public rating?: number,
        public feedback?: string
    ) { }
}

export class UserScore {
    constructor(
        public userid: number,
        public game: string,
        public score: string
    ) { }
}
