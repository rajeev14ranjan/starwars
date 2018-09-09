import { Component, OnInit, HostListener,ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BrowserStorageService} from '../service/browser-storage.service';
import { Router } from '@angular/router';
import { FloatTextComponent } from '../float-text/float-text.component';
import { RoutingService } from 'src/app/service/routing-service.service';

@Component({
  selector: 'game-page',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  public enemyArry = new Array<Point>();
  public bulletArry = new Array<Point>();
  public gunPosition = 0;
  public gameOver = false;
  public score: number = 0;
  public lifeCount = 10;
  public gamePreview = true;
  public highScore : any;
  public highScored : boolean;
  public leftMove = 30;
  public leftCounter = 0;
  public rightMove = 30;
  public rightCounter = 0;
  public lifeWarning = true;
  public scoreMilestone = 500;
  public footerPos = {top :0 , left : 0};
  public isUserAdmin : boolean;

  public width = window.innerWidth;
  public height = window.innerHeight;

  public playingArea ={
    xMin : 0,
    xMax:  0,
    yMin : 0,
    yMax : 0,
    width: 0,
    height: 0
  }


  @ViewChild('floater') floater : FloatTextComponent;
  

  constructor(private _title: Title, private _router: Router, private _localStorage : BrowserStorageService, private _routinService : RoutingService) {
    this._localStorage.checkForLogin();
    this.highScore = _localStorage.getHighScore();
    this.calculatePlayingArea();
   }


  ngOnInit() {
    this._title.setTitle('Game Page');
    this.footerPos = this._routinService.getCoordinate(document.getElementById('footerDiv'));
    this.isUserAdmin = this._localStorage.isAdmin();
  }

  public calculatePlayingArea(){
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.footerPos = this._routinService.getCoordinate(document.getElementById('footerDiv'));

    let playingWidth = Math.floor(0.6 * this.width);
    let playingHeight = Math.floor(0.8 * this.height);

    this.playingArea.width = playingWidth;
    this.playingArea.height = playingHeight;
    this.playingArea.xMin = -1 * Math.floor(playingWidth/2);
    this.playingArea.xMax = Math.floor(playingWidth/2);
    this.playingArea.yMin = 0;
    this.playingArea.yMax = playingHeight;
  }


  public detechCollision(){
    var ccId = setInterval(()=>{
      if(!this.gameOver){
        this.collisionCheck();
      }else{
        clearInterval(ccId);
        this.gunPosition= 0;
      }
    },100);
  }


  public startGame() {
    this.floater.showText('Game Started, Best of Luck!','I');
    this.lifeWarning = true;
    var itId = setInterval(() => {
      let x = Math.floor((Math.random() - 0.5) * this.playingArea.width);
      x = Math.floor(x / 30) * 30;
      let y = this.playingArea.yMin;
      let master = Math.floor((Math.random()*10)) > 8;
      this.enemyArry.push({ 'x': x, 'y': y ,'m': master? 1 : 0});
      if(this.enemyArry.length > 20){
        this.lifeCount --;
        this.enemyArry.shift();
      }
      if (this.lifeCount < 1 ) {
        this.gameOver = true;
        this.enemyArry = new Array<Point>();
        if(this.highScored){
          this._localStorage.saveHighScore(this.score);
          this.highScore = false;
        }
        this.floater.showText('Game Over, You played really well', 'S');
        clearInterval(itId);
      }
      if(this.lifeWarning && this.lifeCount < 4){
        this.floater.showText('Play Carefully, Only 3 life left', 'E');
        this.lifeWarning = false;
      }
    }, 2000);
  }

  //checks the collision between bullet and enemy
  public collisionCheck() {
      for(let e=0; e < this.enemyArry.length; e++){
          let enemy = this.enemyArry[e];
          let b = this.bulletArry.findIndex(blt => blt.x == enemy.x);
          if(b > -1 && enemy.m < 2){
            let bullet = this.bulletArry[b];
      
            if(enemy.y + 60 > bullet.y){
              if(enemy.m){
                this.score += 200;
                this.floater.showText('You have gained a Life by killing Master Ship','I');
                this.lifeCount++;
            }
            this.score += Math.ceil((this.playingArea.yMax - enemy.y)/5) ;
            enemy.m = 2; // Change it in blast

            setTimeout(()=>enemy.m=3,600);
            this.bulletArry.splice(b,1);

            if(this.score > this.scoreMilestone){
              this.floater.showText(`You have crossed ${this.scoreMilestone} mark!`,'S');
              this.scoreMilestone *= 2;
            }
            
            if(!this.highScored && this.score > parseInt(this.highScore.highScore)){
                this.floater.showText('Congratulations! This is new high score 🏆','I');
                this.highScored = true;
                this._localStorage.saveHighScore(this.score);
            }
          }
      }//end collision check

      if(enemy.y > this.playingArea.yMax){
        this.enemyArry.splice(e,1);
        if(enemy.m < 3) this.lifeCount -= 1;
      }
    }

    for(let b =0; b< this.bulletArry.length; b++){
      if(this.bulletArry[b].y < this.playingArea.yMin){
        this.bulletArry.splice(b,1);
      }
    }
  }


  public goTo(url: string) {
    this._router.navigateByUrl(url);
  }

  public fireBullet(xIndex: number) {
    this.bulletArry.push({ 'x': xIndex, 'y': this.playingArea.yMax ,'m': 0 });
    if(this.bulletArry.length > 10){
      this.bulletArry.shift();
    }
  }

  getLifeCount(){
    return Array(this.lifeCount);
  }

  @HostListener('document:keypress', ['$event']) handleKeyboardEvent(event: KeyboardEvent) {
    let x = event.keyCode;
    if ((x == 97 || x == 65) && this.gunPosition > this.playingArea.xMin - 100) {
      this.gunPosition -= this.leftMove;
      this.leftCounter++;
      this.rightCounter = 0;
      this.leftMove = this.getXPos(this.leftCounter);
      this.rightMove = 30;
    } 
    else if ((x == 100||x == 68) && this.gunPosition < this.playingArea.xMax + 100) {
      this.gunPosition += this.rightMove;
      this.rightCounter++;
      this.leftCounter = 0;
      this.rightMove = this.getXPos(this.rightCounter);
      this.leftMove = 30;
    } 
    else if ((x == 119||x == 87) && !this.gameOver) {
      this.fireBullet(this.gunPosition);
      this.rightCounter = 0;
      this.leftCounter = 0;
    }
    else if(x==32){
      this.gamePreview = false;
      this.gameOver = false;
      this.lifeCount = 10;
      this.score=0;
      this.highScore = false;
      this.calculatePlayingArea();
      this.startGame();
      this.detechCollision();
    }
  }
  
  public getXPos(counter:number):number{
    switch(counter){
      case 0:
      case 1:
      case 2: 
      case 3: return 30;
      case 4: 
      case 5: return 60;
      case 6: 
      case 7: return 90;
      case 8: 
      case 9: return 120;
      default: return 120;
    }
  }
}

class Point {
  public x?: number;
  public y?: number;
  public m?: number; //0: normal, 1: masterShip, 2: hit, 3: killed
}
