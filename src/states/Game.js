/* globals __DEV__ */
import Phaser from 'phaser'

export default class extends Phaser.State {
  init() { }
  preload() { 
    this.loaded=false;
    this.game.load.image('gameboard', 'assets/images/gameboard_v2.png');
    this.game.load.image('tick', 'assets/images/green_tick.png');
    this.game.load.spritesheet('numbersprite', 'assets/images/number_sprite.png', 50, 50, 12);
    this.game.load.spritesheet('oksprite', 'assets/images/ok_button.png', 158, 158, 1);
    
    this.game.load.video('baldi', 'assets/video/baldi_talking.mp4');

    this.game.load.audio('MainMenu', 'assets/audio/BAL_MainMenu.wav');
    this.game.load.audio('minus', 'assets/audio/BAL_Math_Minus.wav');
    this.game.load.audio('plus', 'assets/audio/BAL_Math_Plus.wav');
    for (var i = 0; i < 10; i++) {
      this.game.load.audio(`number_${i}`, `assets/audio/BAL_Math_${i}.wav`);
    }
    this.game.load.onLoadComplete.add(loadComplete, this);

    function loadComplete(){
      console.log('loadComplete')
      this.loaded=true;
    }
  } 

  create() {
    var image = this.game.add.image(0, 0, 'gameboard');
    var mainmenu = game.add.audio('MainMenu');
    var that = this;

    var widthRatio = window.innerWidth/1024;
    var heightRatio = window.innerHeight/768;
    
    var scale = widthRatio < heightRatio ? widthRatio: heightRatio;
    image.scale.setTo(scale, scale);

    var video = this.game.add.video('baldi', .5, .5);
    video.addToWorld(220*scale, 470*scale,0,0,scale,scale);
    this.video = video;

    this.enterAnswer = this.game.add.text(scale*410,scale*496, 'ENTER ANSWER', {font: "50px 'Comic Sans MS'"});
    this.enterAnswer.addColor('#cdcdcd',0);
    this.scaleText(this.enterAnswer, 280 * scale, 80* scale );

    
    var tick = this.game.add.button(scale*234, scale*236, 'tick', ()=>{}, this, 0, 0, 0);
    tick.scale.setTo(scale, scale);

    this.answerText = this.game.add.text(scale*410,scale*496, '', {font: "50px 'Comic Sans MS'"});
    this.answerText.fontSize = this.enterAnswer.fontSize;

    this.question = this.game.add.text(scale*340,scale*330, '', {font: "50px 'Comic Sans MS'"});
    this.scaleText(this.question, 350 * scale, 80* scale );
    
    this.feedback = this.game.add.text(scale*340,scale*250, '', {font: "50px 'Comic Sans MS'"});
    this.scaleText(this.question, 350 * scale, 80* scale );


    var okbutton = this.game.add.button(scale*790, scale*476, 'oksprite', okClick, this, 0, 0, 0);
    okbutton.scale.setTo(scale, scale);

    function okClick(){
      
    }

    function numberButton(number){
      that.enterAnswer.visible = false;
      that.answerText.text+=number+'';
      var  s = game.add.audio(`number_${number}`).play();
      video.play(false);
      s.onStop.add(()=>{
        video.stop();
      });
    }
    function minusButton(){
      that.enterAnswer.visible = false;
      that.answerText.text+= ' - ';
      var s = game.add.audio(`minus`).play();
      video.play(false);
      s.onStop.add(()=>{
        video.stop();
      });
    }
    function clearButton(){
      that.answerText.text='';
      that.enterAnswer.visible = true;
    }

    this.createButton(scale, 779, 340, 0, function(){numberButton(1)});
    this.createButton(scale, 842, 340, 1, function(){numberButton(2)});
    this.createButton(scale, 903, 340, 2, function(){numberButton(3)});
    this.createButton(scale, 776, 277, 3, function(){numberButton(4)});
    this.createButton(scale, 842, 277, 4, function(){numberButton(5)});
    this.createButton(scale, 903, 277, 5, function(){numberButton(6)});
    this.createButton(scale, 776, 216, 6, function(){numberButton(7)});
    this.createButton(scale, 843, 216, 7, function(){numberButton(8)});
    this.createButton(scale, 902, 216, 8, function(){numberButton(9)});
    this.createButton(scale, 776, 409, 10, clearButton);
    this.createButton(scale, 843, 409, 9, function(){numberButton(0)});
    this.createButton(scale, 903, 409, 11, minusButton);

    this.generateQuestion();
  }

  scaleText(text, width, height ){
    text.wordWrap=true;
    text.wordWrapWidth = width;

    while(text.width>width || text.height>height){
      text.fontSize--;
    }
  }

  

  generateQuestion(){
    var firstNumber = Math.floor(Math.random() * 10);
    var secondNumber = Math.floor(Math.random() * 10);

    this.answer = firstNumber + secondNumber;
    this.question.text = `${firstNumber} + ${secondNumber} =`;


    var n1Sound = game.add.audio(`number_${firstNumber}`);
    var plusSound =game.add.audio(`plus`);
    var n2Sound =game.add.audio(`number_${secondNumber}`);

    n1Sound.onStop.add(()=>{
      plusSound.play();
    }, this);
    plusSound.onStop.add(()=>{
      n2Sound.play();
    }, this);
    n2Sound.onStop.add(()=>{
      this.video.stop();
    }, this);
    n1Sound.play();
    this.video.play(true);
  }

  createButton(scale, xPos, yPos, spriteNumber, action){
    var button = this.game.add.button(scale*xPos, scale*yPos, 'numbersprite', action, this, spriteNumber, spriteNumber, spriteNumber);
    button.scale.setTo(scale, scale);
  }

  render() {
    if (__DEV__) {
    }
  }
}
