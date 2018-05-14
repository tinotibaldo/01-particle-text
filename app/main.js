import Webgl from 'js/core/Webgl';
import loop from 'js/core/Loop';
import props from 'js/core/props';
import ExtrudeText from 'js/components/ExtrudeText';
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
light.position.set(1, 1, 1);
webgl.add(light);

const extrudeText = new ExtrudeText({
	text : "A Particle Mind",
	size: 120,
	debug : false,
	extrude : {bevel : true},
	//sides: {opacity : 0.1, color : 0x000000},
	//front : { material : new THREE.MeshBasicMaterial({color : 0xda6746})}
});

webgl.add(extrudeText);

loop.add(() => {
	extrudeText.update(undefined, webgl.camera)
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
