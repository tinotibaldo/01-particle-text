//class import resourceManager from 'js/singletons/ResourceManager';

//this is an abstract class
export default class Text extends THREE.Object3D
{
	constructor() { 
		super();
	}

	set_text() {
		//everything but data initialization, this should be changed when text change. 
	}

    update(TIME, camera) {
        this.lookAt(camera.position);
        //this method update the text, as the first parameters will receive the time. See core/TIME module
    }
}
