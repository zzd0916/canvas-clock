var WINDOW_WIDTH = 1024
var WINDOW_HEIGHT = 768
var RADIUS = 8
var MARGIN_TOP = 60
var MARGIN_LEFT = 30

var TYPE = 'CLOCK' // 时钟效果 还是 倒计时效果    'CLOCK' OR 'COUNTDOWN'

var endTime = new Date()
endTime.setTime(endTime.getTime() + 3600*1000) //设置现在时间之后的倒计时

var currentShowTimeSeconds = 0
var balls = []
const colors = ['#FFFF00', '#76EE00', '#48D1CC', '#76EE00' , '#76EE00' ,'#CD3700' ,'#CD3700', '#CD3700', '#836FFF', '#CD3700']
window.onload = function(){

  //屏幕自适应
  WINDOW_WIDTH = document.body.clientWidth
  WINDOW_HEIGHT = document.body.clientHeight

  MARGIN_LEFT = Math.round(WINDOW_WIDTH/10)
  RADIUS = Math.round(WINDOW_WIDTH * 4 / 5 / 108) - 1
  MARGIN_TOP = Math.round(WINDOW_HEIGHT / 5)   

  var canvas = document.getElementById('canvas')
  var context = canvas.getContext('2d')

  canvas.width = WINDOW_WIDTH
  canvas.height = WINDOW_HEIGHT
  currentShowTimeSeconds = getCurrentShowTimeSeconds()

  // initWall(context)

  setInterval(() => {
    render(context)
    update()
  }, 50);

}

function update(params) {
  var nextShowTimeSeconds = getCurrentShowTimeSeconds()

  var nextHours = parseInt( nextShowTimeSeconds / 3600)
  var nextMinutes = parseInt( (nextShowTimeSeconds - nextHours* 3600) / 60)
  var nextSeconds = nextShowTimeSeconds % 60 

  var curHours = parseInt( currentShowTimeSeconds / 3600)
  var curMinutes = parseInt( (currentShowTimeSeconds - curHours* 3600) / 60)
  var curSeconds = currentShowTimeSeconds % 60 

  if( nextSeconds !=  curSeconds){
    if( parseInt(curHours/10) != parseInt(nextHours/10)){
      addBalls( MARGIN_LEFT + 0 , MARGIN_TOP , parseInt(curHours/10))
    }
    if( parseInt(curHours%10) != parseInt(nextHours%10)){
      addBalls( MARGIN_LEFT + 15*(RADIUS+1) , MARGIN_TOP , parseInt(curHours/10))
    }
    if( parseInt(curMinutes/10) != parseInt(nextMinutes/10)){
      addBalls( MARGIN_LEFT + 39*(RADIUS+1) , MARGIN_TOP , parseInt(curHours/10))
    }
    if( parseInt(curMinutes%10) != parseInt(nextMinutes%10)){
      addBalls( MARGIN_LEFT + 54*(RADIUS+1) , MARGIN_TOP , parseInt(curHours/10))
    }
    if( parseInt(curSeconds/10) != parseInt(nextSeconds/10)){
      addBalls( MARGIN_LEFT + 78*(RADIUS+1) , MARGIN_TOP , parseInt(curHours/10))
    }
    if( parseInt(curSeconds%10) != parseInt(nextSeconds%10)){
      addBalls( MARGIN_LEFT + 93*(RADIUS+1) , MARGIN_TOP , parseInt(curHours/10))
    }
    currentShowTimeSeconds = nextShowTimeSeconds
  }

  updateBalls()
}

function updateBalls() {
  for(let i =0; i< balls.length; i++){
    balls[i].x += balls[i].vx
    balls[i].y += balls[i].vy
    balls[i].vy += balls[i].g

    if(balls[i].y >= WINDOW_HEIGHT -RADIUS){
      balls[i].y = WINDOW_HEIGHT -RADIUS
      balls[i].vy = - balls[i].vy*0.75
    }
  }

  //删除弹出画布外的小球
  var cnt = 0
  for(let i = 0; i<balls.length; i++){
    if(balls[i].x + RADIUS > 0 && balls[i].x - RADIUS < WINDOW_WIDTH){
      balls[cnt++] = balls[i] 
    }
  }
  while (balls.length > Math.min(300, cnt)){
    balls.pop()
  }
}

function  addBalls(x, y ,num) {
  for(let i = 0; i< digit[num].length; i++)
    for(let j = 0; j< digit[num][i].length; j++)
      if( digit[num][i][j] == 1) {
        var ball ={
          x: x+j*2*(RADIUS+1)+(RADIUS+1),
          y: y+i*2*(RADIUS+1)+(RADIUS+1),
          g: 1.5 + Math.random(),
          vx: Math.pow(-1, Math.ceil(Math.random()*1000)) * 4,// -4 ~ 4
          vy: -5,
          color: colors[Math.floor(Math.random()*colors.length)]
        }
        balls.push(ball)
      }
}

function render(ctx) {
  //清除矩形空间内的canvas
  ctx.clearRect(0,0,WINDOW_WIDTH, WINDOW_HEIGHT)

  var hours = parseInt( currentShowTimeSeconds / 3600)
  var minutes = parseInt( (currentShowTimeSeconds - hours* 3600) / 60)
  var seconds = currentShowTimeSeconds % 60 

  //小时
  renderDigit(MARGIN_LEFT, MARGIN_TOP, parseInt(hours/10), ctx)  
  renderDigit(MARGIN_LEFT + 15*(RADIUS+1), MARGIN_TOP, parseInt(hours%10), ctx) 
  //冒号 10代表冒号
  renderDigit(MARGIN_LEFT + 30*(RADIUS+1), MARGIN_TOP, 10, ctx)  
  //分钟
  renderDigit(MARGIN_LEFT + 39*(RADIUS+1), MARGIN_TOP, parseInt(minutes/10), ctx)  
  renderDigit(MARGIN_LEFT + 54*(RADIUS+1), MARGIN_TOP, parseInt(minutes%10), ctx) 
  //冒号 10代表冒号
  renderDigit(MARGIN_LEFT + 69*(RADIUS+1), MARGIN_TOP, 10, ctx)  
  //秒
  renderDigit(MARGIN_LEFT + 78*(RADIUS+1), MARGIN_TOP, parseInt(seconds/10), ctx)  
  renderDigit(MARGIN_LEFT + 93*(RADIUS+1), MARGIN_TOP, parseInt(seconds%10), ctx) 

  for(let i = 0; i<balls.length; i++){
    ctx.fillStyle = balls[i].color

    ctx.beginPath()
    ctx.arc(balls[i].x, balls[i].y, RADIUS, 0 ,2*Math.PI, true)
    ctx.closePath()

    ctx.fill()
  }

}

function renderDigit(x, y, num, ctx) {
  ctx.fillStyle = 'rgb(0, 102, 153)'
  for(let i = 0; i< digit[num].length; i++)
    for(let j = 0; j< digit[num][i].length; j++)
      if( digit[num][i][j] == 1) {
        ctx.beginPath()
        ctx.arc( x+j*2*(RADIUS+1)+(RADIUS+1) , y+i*2*(RADIUS+1)+(RADIUS+1), RADIUS, 0 ,2*Math.PI)
        ctx.closePath()

        ctx.fill()
      }

}


function getCurrentShowTimeSeconds(){
  var currentTime = new Date()
  if(TYPE == 'CLOCK'){
    // 时钟效果
    var currentTime = new Date()
    var ret = currentTime.getHours() * 3600 + currentTime.getMinutes() * 60 + currentTime.getSeconds()
    return ret
    
  } else{
    // 倒计时效果
    var currentTime = new Date()
    var ret = endTime.getTime() - currentTime.getTime()
    ret = Math.round(ret /  1000)

    return ret >=0? ret : 0;
    }
  

  
 
}

function initWall(ctx){
  ctx.beginPath()
  ctx.moveTo(0, WINDOW_HEIGHT/2)
  ctx.lineTo(WINDOW_WIDTH, WINDOW_HEIGHT/2)
  ctx.lineTo(WINDOW_WIDTH, WINDOW_HEIGHT)
  ctx.lineTo(0, WINDOW_WIDTH)
  ctx.lineTo(0, WINDOW_HEIGHT/2)
  ctx.fillStyle = '#ccc'
  ctx.fill()
  ctx.lineWidth = 0
  ctx.strokeStyle = '#ccc'
  ctx.stroke()
}