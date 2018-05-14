//this class loads a JSON font types and generates shapes with it
//THIS MODULE EXPORT A SINGLETON OBJECT, NOT A CLASS

import config from 'js/core/Config'

class FontToGeometryFactory
{
    constructor(config = {}) {
    	this.loader = new THREE.FontLoader();


    	// excecuted when textures are ready
        this.ready = false;
        this.waiting_calls = [];
        //this.load_fonts()
	}


	load_fonts(path) {
        console.log(path)
		const context = this;
		this.loader.load( path, function ( font ) {
			context.font = font;
			context.ready = true;
			context.onReady();
    	});
	}


    onReady() {
        if (this.waiting_calls) {
            var i = this.waiting_calls.length;
            while(i--) {
                this.create_geometry(this.waiting_calls[i]);
            }
        }
    }
    // {text, size, callback, debug}
	create_geometry(args) {
    // we need to load every single png files before actually being able to draw one of them
    // we stock the calls into waiting_texture array
    	if (! this.ready) {
    	    this.waiting_calls.push(args);
    	    return false;
    	}
        
        const shapes = this.font.generateShapes( args.text, args.size, 4 );

    	args.callback(shapes)
    	return true;
	}

}
//singleton pattern
const fontToGeometryFactory = new FontToGeometryFactory();
module.exports = fontToGeometryFactory;
