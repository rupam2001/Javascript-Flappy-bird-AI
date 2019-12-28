var canvas = document.getElementById("gameScreen");
var ctx = canvas.getContext("2d");
const width = 510;
const height = 510;
class Bird///////////////////////////////////////////////////////////////////////////////////////////////////////////Bird Class
{
   constructor(weights1,weights2)
   {
    this.weights1=weights1;
    this.weights2=weights2;
    this.position={x:70,y:510/2};
    this.score=0;//based on lifetime
    this.gravity=20;
    this.jump=10;
    this.dim=20; //dimension of the bird
    this.lost=false;
   }
  w1()
  {
  return this.weights1;
  }
  w2()
  {
  return this.weights2;
  }
  draw(ctx)
  {
    ctx.fillStyle="#0ff";
    if(!this.lost)
    ctx.fillRect(this.position.x,this.position.y,this.dim,this.dim);
  }
  update(inputs){
     function relu(n)
     {
        if(n>0)
          return n;
        return 0;
     }
    var hidenlayer=[];
      
      for(var j=0;j<9;j++)
      {
        var temp=0,temp2=0;
        for(var k=0;k<inputs.length;k++)
        {
           temp=inputs[k]*this.weights1[k][j];
           temp=relu(temp);
           temp2+=temp;
        }
        hidenlayer.push(temp2);
      }
    var output=[];
     for(var j=0;j<2;j++)
      {
        var temp=0,temp2=0;
        for(var k=0;k<hidenlayer.length;k++)
        {
           temp=hidenlayer[k]*this.weights2[k][j];
           temp=relu(temp);
           temp2+=temp;
        }
        output.push(temp2);
      }   
      // console.log(output);
    let big=output[0];
    let pos=0;
    for(var i=0;i<output.length;i++)
    {
      if(output[i]>big)
      { 
        big=output[i];
        pos=i;
      }
    }
    if(pos==1)
    {
      this.position.y-=this.jump;
    }
    else{
     this.position.y+=this.gravity;
    }
   if(this.position.y<0 || this.position.y+this.dim>height)
       {this.lost=true;
       }
   if(!this.lost)
   {
    this.score+=1;
   }
  }
  getscore()
  {
    return this.score;
  }
  changescore()
  {
    this.score=0;
  }
  died()
  {
    this.lost=true;
  }
  isAlive()
  {
    return this.lost;
  }
}
class Pipes///////////////////////////////////////////////////////////////////////////////////////////////////////pipes class
{
  constructor(width,height)
  {
    this.position={x:width,y:0};
    this.pwidth=20;
    this.gap=100;
    this.pype1_height=Math.floor(Math.random()*(height-this.gap-this.gap)+this.gap);
    this.pipe2y=this.pype1_height+this.gap;
    this.speed=10;
  }
  draw(ctx)
  {
    ctx.fillStyle="#999900";
    ctx.fillRect(this.position.x,this.position.y,this.pwidth,this.pype1_height);
    ctx.fillRect(this.position.x,this.pipe2y,this.pwidth,500);
  }
  update()
  {
    this.position.x-=this.speed;
    if(this.position.x<0)
    {  this.position={x:width,y:0};
       this.pype1_height=Math.floor(Math.random()*(height-this.gap-this.gap)+this.gap);
        this.pipe2y=this.pype1_height+this.gap;
    }
  }
  death_check(bird)
  {
    if(bird.position.x+bird.dim>this.position.x && bird.position.x<this.position.x+this.pwidth)
    {
      if(bird.position.y<this.pype1_height)//for the pipe1
      {
        bird.died();
      }
      else if(bird.position.y+bird.dim>this.pipe2y)//for the pipe2
      {
        bird.died();
      }
    }
  }
  getinput(bird)
  {
    let hdist_p1=this.position.x-bird.position.x;
    let hdist_p2=this.position.x-bird.position.x;
    let vdist_p2=this.pipe2y-bird.position.y;
    let inputs=[hdist_p1,hdist_p2,vdist_p2];
    return inputs;
  }
  restart()
  {
    this.position={x:width,y:0};
    this.pype1_height=Math.floor(Math.random()*(height-this.gap-this.gap)+this.gap);
    this.pipe2y=this.pype1_height+this.gap;
  }
}

function reproduction(Bird_gen,maxpop)////////////////////////////////////////////reproduction function
{
  let top5=[];
  for(var i=0;i<5;i++)
  {
    var big=Bird_gen[0].getscore();
    var pos=0;
    for(var j=0;j<maxpop;j++)
    {  
       if(Bird_gen[j].getscore()>big)
       {
        big=Bird_gen[j].getscore();
        pos=j;      
       }
    }
    console.log(big);
    top5.push(Bird_gen[pos]);
    Bird_gen[pos].changescore();
  }
  //now we have top5
  var next_gen=[];
  var mutationprob=2;
  for(var n=0;n<maxpop;n++)
  {
   let parent1=top5[Math.floor(Math.random()*(top5.length-1))];
   let parent2=top5[Math.floor(Math.random()*(top5.length-1))];
   //cross over
      //for weight1:
   let new_weight1=[];
   let w1=parent1.w1();
   let w2=parent2.w1()
   for(var i=0;i<w1.length;i++)
   {
    let temp_row=[];
    let firstpart=Math.floor(w1[i].length/2);
    let secondpart=w1[i].length-firstpart;
    for(var p1=0;p1<firstpart;p1++)
    {
      temp_row.push(w1[i][p1]);
    }
    for(var p2=secondpart;p2<w2[i].length;p2++)
    {
      temp_row.push(w2[i][p2]);
    }
    new_weight1.push(temp_row);
   }
   var mp=Math.floor(Math.random()*10);
    if(mp<mutationprob)
    {
      //mutation
      for(var i=0;i<10;i++)
      {
        new_weight1[Math.floor(Math.random()*(new_weight1.length-1))][Math.floor(Math.random()*(new_weight1[0].length-1))]=Math.floor(Math.random()*(100-(-100)-100));
      }
    }
    //for weights2:
    w1=parent1.w2();
    w2=parent2.w2();
  let new_weight2=[];
   for(var i=0;i<w1.length;i++)
   {
    let temp_row=[];
    let firstpart=Math.floor(w1[i].length/2);
    let secondpart=w1[i].length-firstpart;
    for(var p1=0;p1<firstpart;p1++)
    {
      temp_row.push(w1[i][p1]);
    }
    for(var p2=secondpart;p2<w2[i].length;p2++)
    {
      temp_row.push(w2[i][p2]);
    }
    new_weight2.push(temp_row);
   }
    mp=Math.floor(Math.random()*10);
    if(mp<mutationprob)
    {
      //mutation
      for(var i=0;i<5;i++)
      {
        new_weight2[Math.floor(Math.random()*(new_weight2.length-1))][Math.floor(Math.random()*(new_weight2[0].length-1))]=Math.floor(Math.random()*(100-(-100)-100));
      }
    }
    //birth
    var babyBird=new Bird(new_weight1,new_weight2);
   next_gen.push(babyBird);
  }
return next_gen;
}
function WeightGenerator(n,m)//////////////////////////////////////////////////////////random weight generator function
{
   let weights=[];
   for(var rows=0;rows<n;rows++)
   {
     var clm=[];
    for(var coloms=0;coloms<m;coloms++)
    {
      clm.push(Math.floor(Math.random()*(100-(-100))-100));
    }
    weights.push(clm);
   }
   return weights;
}
function populate(maxpop)/////////////////////////////////////////////////////////initial population function
{
   let generation_list=[];
   for(var i=0;i<maxpop;i++)
   {
     let weight1=WeightGenerator(3,20);
     let weight2=WeightGenerator(20,2);
     let babyBird=new Bird(weight1,weight2);
     generation_list.push(babyBird);
   }
  return generation_list;
}
let maxpop=1000;
let Bird_gen=populate(maxpop);
let pipes=new Pipes(width,height);
let gen_no=1;
console.log(gen_no);
function gameloop()///////////////////////////////////////////////////////Game loop function
{
	ctx.clearRect(0,0,width,height);
	for(var b=0;b<Bird_gen.length;b++)
  {
    Bird_gen[b].draw(ctx);

    let inputs=pipes.getinput(Bird_gen[b])
    Bird_gen[b].update(inputs);
    pipes.death_check(Bird_gen[b]);
  }
  let count=0;
  for(var b=0;b<Bird_gen.length;b++)
  {
    if(Bird_gen[b].isAlive())
         count+=1;
  }
  if(count>=Bird_gen.length)
  {
    Bird_gen=reproduction(Bird_gen,maxpop);
    pipes.restart()
    gen_no+=1;
    console.log(gen_no);
  }
  pipes.draw(ctx);
  pipes.update();
}
var t=setInterval(gameloop,30);///////////////////////////////////////////////////////////////interval



