let canvas = document.getElementById("screen");
let ctx = canvas.getContext("2d");

class Wall{

    constructor(x1,y1, x2,y2){
        this.x1 = x1;
        this.x2 = x2;
        this.y1 = y1;
        this.y2 = y2;
    }
    
}

class Minimap{

    constructor(){
        this.size = 90;
        this.offset = 20
    }

    render(player, map){
        //draws bounding box
        ctx.beginPath();
        ctx.fillStyle = "#ffffff"
        ctx.fillRect(this.offset, this.offset, this.size, this.size)
        ctx.rect(this.offset, this.offset, this.size, this.size);
        ctx.fillStyle = "#000000"
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(this.offset + this.size/2, this.offset + this.size/2 , 2, 0, 2 * Math.PI);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(this.offset + this.size/2, this.offset + this.size/2);
        ctx.lineTo(
            (this.offset + this.size/2) + 6 * Math.cos(player.angle ),
            (this.offset + this.size/2) + 6 *  Math.sin(player.angle )
            )
        ctx.stroke();


    }

}

class MainView{

    constructor(){

        this.other = 1000;
        this.height = canvas.height/2;
        this.fov = 200
        
    }

    intersect(x1,y1, x2,y2, x3,y3, x4,y4){
        let x = this.fnCross(x1,y1, x2,y2)
        let y = this.fnCross(x3,y3, x4,y4)
        let det = this.fnCross(x1-x2, y1-y2, x3-x4, y3-y4)
        x = this.fnCross(x, x1-x2, y, x3-x4) / det
        y = this.fnCross(x, y1-y2, y, y3-y4) / det

        return [x,y]
    }

    fnCross(x1,y1, x2,y2){
       return x1*y2 - y1*x2
    }

    render(player, map){
        map.walls.forEach( wall =>{
            let tx1 = wall.x1 - player.x ; let ty1 = wall.y1 - player.y
            let tx2 = wall.x2 - player.x ; let ty2 = wall.y2 - player.y

            let tz1 = tx1 * Math.cos(player.angle) + ty1 * Math.sin(player.angle)
            let tz2 = tx2 * Math.cos(player.angle) + ty2 * Math.sin(player.angle)
            tx1 = tx1 * Math.sin(player.angle) - ty1 * Math.cos(player.angle)
            tx2 = tx2 * Math.sin(player.angle) - ty2 * Math.cos(player.angle)

            if(tz1 > 0 || tz2 > 0){
                let ixz1 
                let ixz2 
                ixz1 = this.intersect(tx1,tz1, tx2,tz2, -0.0001,0.0001, -20,5)
                ixz2 = this.intersect(tx1,tz1, tx2,tz2,  0.0001,0.0001,  20,5)

               

                if(tz1 <= 0){
                    if(ixz1[1] > 0){
                        tx1=ixz1[0];
                        tz1=ixz1[1];
                    }else{
                        tx1=ixz2[0];
                        tz1=ixz2[1];
                    }
                }

                if(tz2 <= 0){
                    if(ixz1[1] > 0){
                        tx2=ixz1[0];
                        tz2=ixz1[1];
                    }else{
                        tx2=ixz2[0];
                        tz2=ixz2[1];
                    }
                }

                let x1 = -tx1 * this.fov / tz1 ; let  y1a = -this.other / tz1 ; let  y1b =  this.other / tz1
                let x2 = -tx2 * this.fov / tz2 ; let  y2a = -this.other / tz2 ; let  y2b =  this.other / tz2

                //actually draw the lines
                ctx.beginPath();
                ctx.moveTo(
                    this.height +x1,
                    this.height +y1a
                    );
                ctx.lineTo(
                    this.height +x2,
                    this.height +y2a
                )
                ctx.stroke();

                ctx.beginPath();
                ctx.moveTo(
                    this.height +x1,
                    this.height +y1b);
                ctx.lineTo(
                    this.height +x2,
                    this.height  +y2b
                )
                ctx.stroke();

                ctx.beginPath();
                ctx.moveTo(
                    this.height +x1,
                    this.height +y1a);
                ctx.lineTo(
                    this.height +x1,
                    this.height +y1b
                )
                ctx.stroke();

                ctx.beginPath();
                ctx.moveTo(
                    this.height +x2,
                    this.height +y2a);
                ctx.lineTo(
                    this.height +x2,
                    this.height +y2b
                )
                ctx.stroke();
            }


        })
    }

}

class Map{

    constructor(){
        this.walls = []
    }

    addWall(wall){
        this.walls.push(wall)
    }

}

class Player{

    constructor(){
        this.x = 22;
        this.y = 15;
        this.angle = 0

    }

    turnLeft(amount){
        this.angle -= amount;
    }

    turnLeft(amount){
        this.angle += amount;
    }

}

let minimap = new Minimap()
let map = new Map()
let player = new Player()
let mainView = new MainView()

map.addWall(new Wall(10,10,20,5))
map.addWall(new Wall(20,5,35,5))
map.addWall(new Wall(35,5,40,30))
map.addWall(new Wall(40,30,30,40))
map.addWall(new Wall(30,40,10,40))
map.addWall(new Wall(10,40,10,10))


function main(){
    ctx.clearRect(0,0,canvas.width, canvas.height)
    
    mainView.render(player, map)
    minimap.render(player, map)

    player.angle -= .01
    
    requestAnimationFrame(main)
}





requestAnimationFrame(main)