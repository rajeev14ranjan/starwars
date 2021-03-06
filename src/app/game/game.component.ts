import {
  Component,
  OnInit,
  HostListener,
  ViewChild,
  OnDestroy
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { StorageService } from '../service/browser-storage.service';
import { Router } from '@angular/router';
import { FloatTextComponent } from '../float-text/float-text.component';
import { RoutingService } from '../service/routing-service.service';

@Component({
  selector: 'game-page',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit, OnDestroy {
  public enemyArry = new Array<Point>();
  public bulletArry = new Array<Point>();
  public gunPosition = 0;
  public gameOver = false;
  public score = 0;
  public lifeCount = 10;
  public gamePreview = true;
  public highScore = { timestamp: '', highScore: 0 };
  public highScoreFlag: boolean;
  public leftMove = 30;
  public leftCounter = 0;
  public rightMove = 30;
  public rightCounter = 0;
  public lifeWarning = true;
  public scoreMilestone = 500;
  public footerPos = { top: 0, left: 0 };
  public isUserAdmin: boolean;
  public isGuestUser: boolean;

  public width = window.innerWidth;
  public height = window.innerHeight;

  public playingArea = {
    xMin: 0,
    xMax: 0,
    yMin: 0,
    yMax: 0,
    width: 0,
    height: 0
  };

  @ViewChild('floater') floater: FloatTextComponent;

  constructor(
    private _title: Title,
    private _router: Router,
    private _localStorage: StorageService,
    private _routingService: RoutingService
  ) {
    this._localStorage.checkForLogin();
    this.getHighScore();
  }

  public getHighScore() {
    this._localStorage.getHighScore().subscribe(highSc => {
      this.highScore.highScore = highSc.score;
      this.highScore.timestamp = highSc.timestamp;
    });
  }

  ngOnInit() {
    this._title.setTitle('Game Page');
    this.footerPos = this._routingService.getCoordinate(
      document.getElementById('footerDiv')
    );
    this.isUserAdmin = this._localStorage.isAdmin();
    this.isGuestUser = this._localStorage.isGuestUser;
    this.calculatePlayingArea();
  }

  public resetToNewGame() {
    this.gamePreview = false;
    this.gameOver = false;
    this.lifeCount = 10;
    this.score = 0;
    this._localStorage.logScore = 0;
    this.highScoreFlag = false;
    this.calculatePlayingArea();
  }

  public calculatePlayingArea() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.footerPos = this._routingService.getCoordinate(
      document.getElementById('footerDiv')
    );

    const playingWidth = this.floor(0.6 * this.width);
    const playingHeight = this.floor(0.8 * this.height);

    this.playingArea.width = playingWidth;
    this.playingArea.height = playingHeight;
    this.playingArea.xMax = this.floor(playingWidth / 2);
    this.playingArea.xMin = -1 * this.playingArea.xMax;
    this.playingArea.yMin = 0;
    this.playingArea.yMax = playingHeight;
  }

  public detectCollision() {
    const ccId = setInterval(() => {
      if (!this.gameOver) {
        this.collisionCheck();
      } else {
        clearInterval(ccId);
        this.gunPosition = 0;
      }
    }, 100);
  }

  public floor(n: number) {
    return n >> 0;
  }

  public startGame() {
    this.floater.showText('Game Started, Best of Luck!', 'I');
    this.lifeWarning = true;
    const itId = setInterval(() => {
      let x = this.floor((Math.random() - 0.5) * this.playingArea.width);
      x = this.floor(x / 30) * 30;
      const y = this.playingArea.yMin;
      const master = this.floor(Math.random() * 10) > 8;
      this.enemyArry.push({ x: x, y: y, m: master ? 1 : 0 });
      if (this.enemyArry.length > 20) {
        this.lifeCount--;
        this.enemyArry.shift();
      }
      if (this.lifeCount < 1) {
        this.gameOver = true;
        this.enemyArry = new Array<Point>();
        this.floater.showText('Game Over, You played really well', 'S');
        clearInterval(itId);
      }
      if (this.lifeWarning && this.lifeCount < 4) {
        this.floater.showText('Play Carefully, Only 3 life left', 'E');
        this.lifeWarning = false;
      }
    }, 2000);
  }

  // checks the collision between bullet and enemy
  public collisionCheck() {
    for (let e = 0; e < this.enemyArry.length; e++) {
      const enemy = this.enemyArry[e];
      const b = this.bulletArry.findIndex(blt => blt.x === enemy.x);
      if (b > -1 && enemy.m < 2) {
        const bullet = this.bulletArry[b];

        if (enemy.y + 150 > bullet.y) {
          if (enemy.m) {
            this.score += 200;
            this.floater.showText(
              'You have gained a Life by killing Master Ship',
              'I'
            );
            this.lifeCount++;
          }
          this.score += Math.ceil((this.playingArea.yMax - enemy.y) / 5);
          enemy.m = 2; // Change it in blast

          setTimeout(() => (enemy.m = 3), 800);
          this.bulletArry.splice(b, 1);

          if (this.score > this.scoreMilestone) {
            this.floater.showText(
              `You have crossed ${this.scoreMilestone} mark!`,
              'S'
            );
            this.scoreMilestone *= 2;
          }

          if (!this.highScoreFlag && this.score > this.highScore.highScore) {
            this.floater.showText(
              '🏆 Congratulations! This is a new high score 🏆',
              'I'
            );
            this.highScoreFlag = true;
          }
          this._localStorage.logScore = this.score;
        }
      } // end collision check

      if (enemy.y > this.playingArea.yMax) {
        this.enemyArry.splice(e, 1);
        if (enemy.m < 3) {
          this.lifeCount -= 1;
        }
      }
    }

    for (let b = 0; b < this.bulletArry.length; b++) {
      if (this.bulletArry[b].y < this.playingArea.yMin) {
        this.bulletArry.splice(b, 1);
      }
    }
  }

  public goTo(url: string) {
    this._router.navigateByUrl(url);
  }

  public fireBullet(xIndex: number) {
    this.bulletArry.push({ x: xIndex, y: this.playingArea.yMax, m: 0 });
    while (this.bulletArry[0].y < this.playingArea.yMin) {
      this.bulletArry.shift();
    }
  }

  getLifeCount() {
    return Array(this.lifeCount);
  }

  @HostListener('document:keydown', ['$event'])
  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    const k = event.keyCode;

    if (k === 37 && this.gunPosition > this.playingArea.xMin - 30) {
      this.gunPosition -= this.leftMove;
      this.leftCounter++;
      this.rightCounter = 0;
      this.leftMove = this.getXPos(this.leftCounter);
      this.rightMove = 30;
    } else if (k === 39 && this.gunPosition < this.playingArea.xMax + 30) {
      this.gunPosition += this.rightMove;
      this.rightCounter++;
      this.leftCounter = 0;
      this.rightMove = this.getXPos(this.rightCounter);
      this.leftMove = 30;
    } else if (k === 38 && !this.gameOver) {
      this.fireBullet(this.gunPosition);
      this.rightCounter = 0;
      this.leftCounter = 0;
    } else if (k === 32 && (this.gamePreview || this.gameOver)) {
      this.resetToNewGame();
      this.startGame();
      this.detectCollision();
    }
  }

  public getXPos(counter: number): number {
    switch (counter) {
      case 0:
      case 1:
      case 2:
      case 3:
        return 30;
      case 4:
      case 5:
        return 60;
      case 6:
      case 7:
        return 90;
      case 8:
      case 9:
        return 120;
      default:
        return 120;
    }
  }

  ngOnDestroy() {
    this._localStorage.saveUserLog();
  }
}

class Point {
  public x?: number;
  public y?: number;
  public m?: number; // 0: normal, 1: masterShip, 2: hit, 3: killed
}
