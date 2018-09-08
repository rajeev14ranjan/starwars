import { Component, OnInit, HostListener,ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BrowserStorageService} from '../service/browser-storage.service';
import { Router } from '@angular/router';
import { FloatTextComponent } from '../float-text/float-text.component';

@Component({
  selector: 'game-page',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  public enemyArry = new Array<Point>();
  public bulletArry = new Array<Point>();
  public gunPosition = 783;
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
  public powerGun = false;
  public lifeWarning = true;
  public scoreMilestone = 500;

  @ViewChild('floater') floater : FloatTextComponent;
  

  constructor(private _title: Title, private _router: Router, private _localStorage : BrowserStorageService) {
    //this._localStorage.checkForLogin();
    this.highScore = _localStorage.getHighScore();
   }

  ngOnInit() {
    this._title.setTitle('Game Page');
  }

  public detechCollision(){
    var ccId = setInterval(()=>{
      if(!this.gameOver){
        this.collisionCheck();
      }else{
        clearInterval(ccId);
        this.gunPosition=783;
      }
    },100);
  }


  public startGame() {
    this.floater.showText('Game Started, Best of Luck!','I');
    this.lifeWarning = true;
    var itId = setInterval(() => {
      let x = Math.floor((Math.random() * 1000 - 500));
      x = Math.floor(x / 30) * 30;
      let y = 0;
      let master = Math.floor((Math.random()*10)) > (this.powerGun ? 5:8);
      this.enemyArry.push({ 'x': x, 'y': y ,'m': master});
      if(this.enemyArry.length > 10){
        this.lifeCount --;
        this.enemyArry.unshift();
      }
      if (this.lifeCount < 1 ) {
        this.gameOver = true;
        this.powerGun=false;
        this.enemyArry = new Array<Point>();
        if(this.highScored){
          this._localStorage.saveHighScore(this.score);
        }
        this.floater.showText('Game Over, You played really well', 'S');
        clearInterval(itId);
      }
      if(this.lifeWarning && this.lifeCount < 4){
        this.floater.showText('Play Carefully, Only 3 lifes left', 'E');
        this.lifeWarning = false;
      }
    }, 2000);
  }

  //checks the collision between bullet and enemy
  public collisionCheck() {
    for(let index = -510; index < 500; index += 30){
      let enemy = this.enemyArry.findIndex(e=> e.x == index);
      let bullet = this.bulletArry.findIndex(e=> e.x == index);
      if(enemy > -1 && bullet > -1 && 
        (this.enemyArry[enemy].y + (this.powerGun ? 120 : 60) > this.bulletArry[bullet].y )){
          if(this.enemyArry[enemy].m){
            this.score += 200;
            if(!this.powerGun){
              this.floater.showText('You have acquired Power Gun','G');
            }
            this.powerGun = true;
         }
         this.score += Math.ceil(this.enemyArry[enemy].y/10) ;
          this.enemyArry.splice(enemy,1);
          this.bulletArry.splice(bullet,1);

          if(this.score > this.scoreMilestone){
            this.floater.showText(`You have crossed ${this.scoreMilestone} mark!`,'S');
            this.scoreMilestone *= 2;
          }
          
          if(!this.highScored && this.score > parseInt(this.highScore.highScore)){
              this.floater.showText('Congratulations! This is new high score 🏆','I');
              this.highScored = true;
              this._localStorage.saveHighScore(this.score);
          }
      } else if (enemy > -1  && this.enemyArry[enemy].y > 630){
          this.enemyArry.splice(enemy,1);
          this.lifeCount -= 1;
      } else if (bullet > -1 && this.bulletArry[bullet].y < -199){
          this.bulletArry.splice(bullet,1);
      }
    }
  }

  public goTo(url: string) {
    this._router.navigateByUrl(url);
  }

  public fireBullet(xIndex: number) {
    this.bulletArry.push({ 'x': xIndex, 'y': 625,'m': false });
    if(this.powerGun){
    this.bulletArry.push({ 'x': xIndex-30, 'y': 625,'m': true });
    this.bulletArry.push({ 'x': xIndex, 'y': 625,'m': true });
    this.bulletArry.push({ 'x': xIndex+30, 'y': 625,'m': true });      
    }
    if(this.bulletArry.length > 40){
      this.bulletArry.splice(0,1);
    }
  }

  getLifeCount(){
    return Array(this.lifeCount);
  }

  @HostListener('document:keypress', ['$event']) handleKeyboardEvent(event: KeyboardEvent) {
    let x = event.keyCode;
    if ((x == 97 ||x == 65) && this.gunPosition > 60) {
      this.gunPosition -= this.leftMove;
      this.leftCounter++;
      this.rightCounter = 0;
      this.leftMove = this.getXPos(this.leftCounter);
      this.rightMove = 30;
    } 
    else if ((x == 100||x == 68) && this.gunPosition < 1300) {
      this.gunPosition += this.rightMove;
      this.rightCounter++;
      this.leftCounter = 0;
      this.rightMove = this.getXPos(this.rightCounter);
      this.leftMove = 30;
    } 
    else if ((x == 119||x == 87) && !this.gameOver) {
      this.fireBullet(this.gunPosition - 753);
      this.rightCounter = 0;
      this.leftCounter = 0;
    }
    else if(x==32){
      this.gamePreview = false;
      this.gameOver = false;
      this.lifeCount = 10;
      this.score=0;
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
  public m?: boolean;
}
