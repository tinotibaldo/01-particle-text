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
const light = new THREE.DirectionalLight(0xffffff, 0.9);
light.position.set(2, 8, 40);
webgl.add(light);
light.castShadow = true;            // default false

light.shadow.mapSize.width = 4096;  // default
light.shadow.mapSize.height = 4096; // default
light.shadow.camera.near = 0.5;    // default
light.shadow.camera.far = 100;     // default
light.shadow.camera.right = 500;
light.shadow.camera.left = - 500;
light.shadow.camera.top	= 120;
light.shadow.camera.bottom = - 120;
light.shadow.bias = -0.001

var helper = new THREE.CameraHelper( light.shadow.camera );
webgl.add( helper );

const light2 = new THREE.AmbientLight(0x555555);
webgl.add(light2);

const extrudeText = new ExtrudeText({
	text : "A Particle Mind",
	size: 10,
	debug : false,
	extrude : {bevel : true, bevelSize : 4, bevelSegments : 5},
});
extrudeText.position.y = -250;

webgl.add(extrudeText);

var plane = new THREE.Mesh(new THREE.BoxBufferGeometry(1000,500, 1, 1, 1), new THREE.MeshPhongMaterial())
webgl.add(plane)
plane.position.z = -20;
plane.receiveShadow = true; //default

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
		step : 1,
	//	bevelThickness : 1,
	//	bevel : true, bevelSize : 10, bevelSegments : 1
	},
});

webgl.add(pointsPlanesText);
pointsPlanesText.castShadow = true; //default is false
pointsPlanesText.receiveShadow = true; //default

const pointsText = new PointsText({
	text : "A",
	size: 10,
	debug : false,
	opacity : 0.5,
	color : 0xffffff,
	extrude : {
		amount : 10,
		step : 10,
		bevelThickness : 50,
		bevel : true, bevelSize : 10, bevelSegments : 50
	},
});

pointsText.position.y = 250;
webgl.add(pointsText);

loop.add(() => {
	//extrudeText.update(undefined, webgl.camera)
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
	extrudeText.set_text({text : a.srcElement.value, size: 120 * Math.random() + 20 -  a.srcElement.value.length * 2, extrude : {bevel : true}})
}


window.addEventListener('resize', onResize);
window.addEventListener('orientationchange', onResize);

var input = document.getElementById(parameters.input);
console.log(input)
input.addEventListener('keypress', changeText);

}
