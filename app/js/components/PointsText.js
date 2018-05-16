import Text from 'js/components/Text';
import DEBUG from 'js/core/Debug';
import fontToGeometryFactory from 'js/components/FontToGeometryFactory';

// create text from extruding a shape created from a json text
export default class PointsText extends Text
{
    constructor(config = {}) { 
        super()


        this.material = new THREE.PointsMaterial( { color: 0x888888 } );
        this.geometry = new THREE.BufferGeometry();
        this.text_object = new THREE.Points( this.geometry , this.material);
        this.add(this.text_object)
        this.set_text(config)
    }

    set_text(config) {
        //this method initilize every variable needed for the text
        // we neeed to declare a context here so that we are able to get it inside the loader's callback.
        const context = this;

        this.text = config.text ||  'Sanchesin es un buen muchacho'
        //otherwise we cant check later
        if ( !config.extrude ) config.extrude = {};

        const size = config.size ||  100

        //extruding is creating a shape and using extrude settings to extrude that shape
        var extrudeSettings = {
            steps          :    config.extrude.steps          || 2,
            amount         :    config.extrude.amount         || 1,
            bevelEnabled   :    (config.extrude.bevel         || config.extrude.bevelThickness || config.extrude.bevelSize || config.extrude.bevelSegments) ? true : false,
            bevelThickness :    config.extrude.bevelThickness || 5,
            bevelSize      :    config.extrude.bevelSize      || 5,
            bevelSegments  :    config.extrude.bevelSegments  || 1,
        };

        if (config) {
            // using given material
            if(config.material) {
                this.material = config.material;
            } else {
                this.material.color.set( config.color || 0xda6746);
                this.material.size = ( config.point_size || 1  );
                this.material.lights = ( config.lights || false )
                this.material.sizeAttenuation = ( config.sizeAttenuation || false )
                this.material.opacity = (  config.opacity || config.opacity === 0 ? config.opacity : 1);
                this.material.transparent=(  this.material.opacity < 1 ? true : false);
            }
        }

        // we clean the last used goemetry in order free ram usage
        if ( context.geometry ){ 
            context.geometry.dispose();
        }

        // we load a 3d font model
        fontToGeometryFactory.create_geometry({
            text : context.text,
            size : size,
            callback : (shapes) => {
                context.geometry = new THREE.ExtrudeBufferGeometry( shapes, extrudeSettings );
                context.geometry.computeBoundingBox();
                const xMid = - 0.5 * (context.geometry.boundingBox.max.x - context.geometry.boundingBox.min.x );
                const yMid = - 0.5 * (context.geometry.boundingBox.max.y - context.geometry.boundingBox.min.y );
                const zMid = - 0.5 * (context.geometry.boundingBox.max.z - context.geometry.boundingBox.min.z );

                context.geometry.translate( xMid, yMid, zMid );

                // we only change the geometry of the 3d object to save up memory
                context.text_object.geometry = context.geometry;
            }
        });
    }

    update(TIME, camera) {
        this.lookAt(camera.position);
        //this method update the text, as the first parameters will receive the time. See core/TIME module
    }

    get_size () {
        return this.geometry.boundingBox.getSize();
    }
}

