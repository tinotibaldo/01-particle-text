import Text from 'js/components/Text';
import DEBUG from 'js/core/Debug';
import fontToGeometryFactory from 'js/components/FontToGeometryFactory';

// create text from extruding a shape created from a json text
export default class ExtrudeText extends Text
{
    constructor(config = {}) { 
        super()


        this.material   = [
                new THREE.MeshPhongMaterial( {
                flatShading : true,
                color     : 0xda6746,
                emissive  : 0xc34752,
                specular  : 0x0000ff,
                shininess : 90,
            }),
                new THREE.MeshPhongMaterial( {
                flatShading : true,
                color     : 0xeedcce,
                emissive  : 0x887a72,
                specular  : 0xffffff,
                shininess : 30,
            })
        ];
        this.geometry = new THREE.BoxBufferGeometry(1,1,1);
        this.text_object = new THREE.Mesh( this.geometry , this.material);
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

        if (config.front) {
            // using given material
            if(config.front.material) {
                this.material[0] = config.front.material;
            } else {
                this.material[0].color.set(     config.front.color     || 0xda6746);
                this.material[0].emissive.set(  config.front.emissive  || 0x0000ff);
                this.material[0].specular.set(  config.front.specular  || 0xc34752);
                this.material[0].shininess = (  config.front.shininess || 90);
                this.material[0].opacity =   (  config.front.opacity || config.front.opacity === 0 ? config.front.opacity : 1);
                this.material[0].transparent=(  this.material[0].opacity < 1 ? true : false);
            }
        }

        if (config.sides) {
            if(config.sides.material) {
                this.material[1] = config.sides.material;
            } else {
                this.material[1].color.set(     config.sides.color     || 0xeedcce);
                this.material[1].emissive.set(  config.sides.emissive  || 0x887a72);
                this.material[1].specular.set(  config.sides.specular  || 0xffffff);
                this.material[1].shininess = (  config.sides.shininess || 30);
                this.material[1].opacity =   (  config.sides.opacity || config.sides.opacity === 0 ? config.sides.opacity : 1);
                this.material[1].transparent=(  this.material[1].opacity < 1 ? true : false);
            }
        }

        // we clean the last used goemetry in order free ram usage
        if ( context.geometry ){ 
            context.geometry.dispose();
        }

        // we load a 3d font model
        const loader = new THREE.FontLoader();
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

