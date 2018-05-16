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
const light = new THREE.SpotLight( 0xD62FED , 1.2 , 800 , Math.PI * 0.45, 1);
light.position.set(2, 8, 120);
webgl.add(light);
light.castShadow = true;            // default false
var i = 0;
loop.add(
	() => {
		light.position.y =  -Math.sin(Math.PI * i++ * 0.001) * 50;
		light.position.x =  -Math.sin(Math.PI * i++ * 0.003) * 25;

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

const light2 = light.clone()
light2.color.set(0xFFAF2E);
webgl.add(light2);
var i = 0;
loop.add(
	() => {
		light2.position.y =  Math.sin(Math.PI * i++ * 0.0015) * 50;
		light2.position.x =  Math.sin(Math.PI * i++ * 0.0032) * 25;

	})

//var helper = new THREE.CameraHelper( light.shadow.camera );
//webgl.add( helper );

const light3 = new THREE.AmbientLight(0x020101);
webgl.add(light3);

var plane = new THREE.Mesh(new THREE.BoxBufferGeometry(1200,500, 1, 1, 1), new THREE.MeshPhongMaterial({color : 0x229FBF,
emissive : 0x030101}))
webgl.add(plane)
plane.position.z = -120;
plane.receiveShadow = true; //default


//var geometry = new THREE.SphereBufferGeometry( 5, 16, 16 );
var geometry = new THREE.BoxBufferGeometry( 1.3, 1, 1, 1, 1, 1 );
geometry.scale(0.3,0.3,0.3)
geometry.rotateY(0.8)
geometry.rotateZ(0.4)
const geo2 = geometry.clone();
const pointsPlanesText = new PointsPlanesText({
	text : "oh OH",
	size: 120,
	debug : false,
	extrude : {
		amount : 20,
		step : 1,
		bevelThickness : 2,
		bevel : true, bevelSize : 10, bevelSegments : 1
	},
	geometry
});

webgl.add(pointsPlanesText);

//const cloned = pointsPlanesText.clone();
//cloned.set_text({
//	text : "si ZI",
//	size: 120,
//	debug : false,
//	extrude : {
//		amount : 20,
//		step : 1,
//		bevelThickness : 2,
//		bevel : true, bevelSize : 10, bevelSegments : 1
//	},
//	geometry : geo2
//})
//cloned.position.y = -50;

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
	pointsPlanesText.set_text({text : a.srcElement.value, size: 90, extrude : {amount : 10}, geometry : geometry})
}


window.addEventListener('resize', onResize);
window.addEventListener('orientationchange', onResize);

var input = document.getElementById(parameters.input);
console.log(input)
input.addEventListener('keypress', changeText);

}
