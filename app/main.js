import Webgl from 'js/core/Webgl';
import loop from 'js/core/Loop';
import props from 'js/core/props';
import ExtrudeText from 'js/components/ExtrudeText';
import PointsText from 'js/components/PointsText';
import PointsPlanesText from 'js/components/PointsPlanesText';

import fontToGeometryFactory from 'js/components/FontToGeometryFactory';

// ##
// INIT
module.exports = (parameters) => {

fontToGeometryFactory.load_fonts(parameters.font_path);

const webgl = new Webgl(window.innerWidth, window.innerHeight);
document.body.appendChild(webgl.dom);
// - Add object update to loop
loop.add(webgl.onUpdate);

// ##
// EXAMPLE LIGHT
const light = new THREE.SpotLight( 0xffffff , 1 , 500 , Math.PI * 0.45);
light.position.set(2, 8, 120);
webgl.add(light);
light.castShadow = true;            // default false
var i = 0;
loop.add(
	() => {
		light.position.y =  Math.sin(Math.PI * i++ * 0.001) * 5;
		light.position.x =  Math.sin(Math.PI * i++ * 0.003) * 5;

	})
light.shadow.mapSize.width = 4096;  // default
light.shadow.mapSize.height = 4096; // default
light.shadow.camera.near = 10;    // default
light.shadow.camera.far = 500;     // default
light.shadow.camera.right = 500;
light.shadow.camera.left = - 500;
light.shadow.camera.top	= 120;
light.shadow.camera.bottom = - 120;
light.shadow.bias = -0.0001
light.shadow.camera.fov = 100;

const light2 = new THREE.SpotLight( 0xffff44 , 1 , 500 , Math.PI * 0.45);
light2.position.set(20, 20, 120);
webgl.add(light2);
light2.castShadow = true;            // default false
var i = 0;
loop.add(
	() => {
		light2.position.y =  Math.sin(Math.PI * i++ * 0.0015) * 25;
		light2.position.x =  Math.sin(Math.PI * i++ * 0.0032) * 25;

	})
light2.shadow.mapSize.width = 4096;  // default
light2.shadow.mapSize.height = 4096; // default
light2.shadow.camera.near = 10;    // default
light2.shadow.camera.far = 500;     // default
light2.shadow.camera.right = 500;
light2.shadow.camera.left = - 500;
light2.shadow.camera.top	= 120;
light2.shadow.camera.bottom = - 120;
light2.shadow.bias = -0.0001
light2.shadow.camera.fov = 100;

var helper = new THREE.CameraHelper( light.shadow.camera );
webgl.add( helper );

const light3 = new THREE.AmbientLight(0x111122);
webgl.add(light3);


var plane = new THREE.Mesh(new THREE.BoxBufferGeometry(1000,500, 1, 1, 1), new THREE.MeshPhongMaterial({color : 0xaaaaaa}))
webgl.add(plane)
plane.position.z = -50;
plane.receiveShadow = true; //default

const geometry = new THREE.BoxBufferGeometry(1, 1,1,1,1,1)




const pointsPlanesText = new PointsPlanesText({
	text : "Particle",
	size: 200,
	debug : false,
	point_size : 1,
	lights : false,
	sizeAttenuation : true,
	opacity : 0.5,
	extrude : {
		amount : 10,
		step : 2,
		bevelThickness : 5,
		bevel : true, bevelSize : 10, bevelSegments : 1
	},
	geometry
});

webgl.add(pointsPlanesText);
pointsPlanesText.castShadow = true; //default is false
pointsPlanesText.receiveShadow = true; //default


loop.add(() => {
	pointsPlanesText.update(undefined, webgl.camera)
});

// RENDERER
loop.start();

// ON RESIZE / ORIENTATION CHANGE
function onResize() {
  const w = window.innerWidth;
  const h = window.innerHeight;

  webgl.onResize(w, h);
}

const changeText = (a) => {
	pointsPlanesText.set_text({text : a.srcElement.value, size: 120 * Math.random() + 20 -  a.srcElement.value.length * 2, extrude : {amount : 10}, geometry : geometry})
}


window.addEventListener('resize', onResize);
window.addEventListener('orientationchange', onResize);

var input = document.getElementById(parameters.input);
console.log(input)
input.addEventListener('keypress', changeText);

}
