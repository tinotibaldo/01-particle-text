class Debug {
  constructor() {
    this.Vector3_one = new THREE.Vector3(1,1,1);
    this.Vector3_zero = new THREE.Vector3(0,0,0);

    this.canvas_renderer = undefined;
  }

  init(webgl)
  {
    this.webgl = webgl;

    this.ctx = undefined;
    
    // var cln = webgl.dom.cloneNode(false);
    // cln.id = "canvas_debug";
    // $(cln).css("position", "absolute");
    // webgl.dom.parentElement.insertBefore(cln, webgl.dom);
    // this.ctx = cln.getContext('2d');

    // this.ctx.clearRect(0, 0, cln.width, cln.height);
    // this.ctx.fillStyle =  "rgba(255, 0, 0, 1)";

  }

  draw_rectangle(position_2d, width, height, color)
  {
    this.ctx.fillStyle =  color || "rgba(255, 0, 0, 1)";
    this.ctx.fillRect(position_2d.x - width/2,
                      (this.ctx.canvas.height - position_2d.y) - height/2,width,height);
    
  }

  clear()
  {
    if(this.ctx)
      this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  }

  draw_line_2D(from, to, color)
  {
    this.ctx.strokeStyle =  color ||"rgba(255, 0, 0, 1)";
    this.ctx.beginPath();
    this.ctx.moveTo(from.x, from.y);
    this.ctx.lineTo(to.x, to.y);
    this.ctx.closePath();
    this.ctx.stroke();
  }

  draw_line(from, to, color)
  {
    color = color || 0xff0000;
    let mat = new THREE.LineBasicMaterial({ color: color });
    let geo = new THREE.Geometry();
    geo.vertices.push(from);
    geo.vertices.push(to);
    let line = new THREE.Line(geo, mat);
    this.webgl.add(line);
    return line;
  }
  draw_cube(args)
  {
    let size = args.size;
    let pos = args.pos;
    let scene = args.scene;
    let color = args.color;
    size = size || 1;
    color = color || 0xff0000;
    var geometry = new THREE.BoxGeometry( size, size, size );
    var material = new THREE.MeshBasicMaterial( {color: color, side: THREE.DoubleSide} );
    var cube = new THREE.Mesh( geometry, material );
    cube.position.copy(pos || new THREE.Vector3());
    if (scene){
      scene.add( cube );
    }
    return cube;
  }


  draw_curve(curve, options)
  {
    let offset = new THREE.Vector3(0,0, 0);
    if(options)
      offset.y = options.offset || 0;
    
    for(let i=0; i< curve.length-1; i++)
    {
      this.draw_line(curve[i].clone().add(offset), curve[i+1].clone().add(offset));
    }
  }
  
}

const DEBUG = new Debug();
module.exports = DEBUG;
