import Text from 'js/components/Text';
import DEBUG from 'js/core/Debug';
import fontToGeometryFactory from 'js/components/FontToGeometryFactory';

// create text from extruding a shape created from a json text
export default class PointsPlanesText extends Text
{
    constructor(config = {}) { 
        super()


        this.material = new THREE.MeshPhongMaterial( { color: 0x888888, side : THREE.DoubleSide, wireframe : false, vertexColors: THREE.VertexColors } );
        this.geometry = new THREE.BufferGeometry(1,1,1,1);
        this.text_object = new THREE.Mesh( this.geometry , this.material);
        this.add(this.text_object)
        this.set_text(config);
        this.text_object.castShadow = true; //default is false
        this.text_object.receiveShadow = true; //default is false

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

        //if (config) {
        //    // using given material
        //    if(config.material) {
        //        this.material = config.material;
        //    } else {
        //        this.material.color.set( config.color || 0xda6746);
        //        this.material.size = ( config.point_size || 1  );
        //        this.material.lights = ( config.lights || false )
        //        this.material.sizeAttenuation = ( config.sizeAttenuation || false )
        //        this.material.opacity = (  config.opacity || config.opacity === 0 ? config.opacity : 1);
        //        this.material.transparent=(  this.material.opacity < 1 ? true : false);
        //    }
        //}

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

                context.create_shapes(context.geometry.attributes.position.array);
                // we only change the geometry of the 3d object to save up memory
                //context.text_object.geometry = context.geometry;
            }
        });
    }

    get_points() {

    }

    create_shapes(points, size) {
        let attributes;

        if(points[0] instanceof THREE.Vector3) {
            attributes = [];
            var i = points.length;
            while (i--) {
                attributes.push(points.x, points.y, points.z);
            }
        } else {
            attributes = points;
        }
        //console.
        var geometry = new THREE.PlaneBufferGeometry( 2, 2, 1, 1 );
        var point_length = attributes.length /3;

        const post_length = geometry.attributes.position.array.length/3;
        const extranded_attributes = new Float32Array(post_length * point_length * 3)
        //const normals = new Float32Array(post_length * i * 3)
        var indices = [];
        var normals = [];
        var uv = [];
        var colors = []
        var color = new THREE.Color();
        for(let i = 0 ; i < point_length; i++) {
            //console.log(i)
            for(let j = 0 ; j < post_length; j++) {
 
                extranded_attributes[i * 3 * 4 + j * 3 ] = (geometry.attributes.position.array[j * 3] + attributes[i * 3]);
                extranded_attributes[i * 3 * 4 + j * 3 + 1] = (geometry.attributes.position.array[j * 3 + 1] + attributes[i * 3 + 1]);
                extranded_attributes[i * 3 * 4 + j * 3 + 2] = (geometry.attributes.position.array[j * 3 + 2] + attributes[i * 3 + 2]);
            }

            indices.push(i * 4 + 3)
            indices.push(i * 4 + 1)
            indices.push(i * 4 + 2)
            indices.push(i * 4 + 1)
            indices.push(i * 4 )
            indices.push(i * 4 + 2)

            normals.push( 0);
            normals.push( 0);
            normals.push( 1);

            normals.push( 0);
            normals.push( 0);
            normals.push( 1);

            normals.push( 0);
            normals.push( 0);
            normals.push( 1);

            normals.push( 0);
            normals.push( 0);
            normals.push( 1);
            //normals.push( 0, 0, 1 );

            uv.push(0, 0);
            uv.push(0, 1);
            uv.push(1, 1);
            uv.push(1, 0);
            uv.push(0, 1);
            uv.push(1, 1);

            color.setHSL(Math.random(), 1.0, 0.6);

            colors.push( color.r, color.g, color.b );
            colors.push( color.r + 0.1, color.g - 0.1, color.b - 0.1 );
            colors.push( color.r + 0.15, color.g - 0.15, color.b + 0.25 );
            colors.push( color.r + 0.2, color.g - 0.2, color.b - 0.2);


        }
        this.text_object.geometry.setIndex( indices );

        this.text_object.geometry.addAttribute( 'uv', new THREE.Float32BufferAttribute( uv, 2 ) );
        this.text_object.geometry.addAttribute( 'normal', new THREE.Float32BufferAttribute( normals, 3 ) );
        this.text_object.geometry.addAttribute( 'position', new THREE.BufferAttribute( extranded_attributes, 3 ) );
        this.text_object.geometry.addAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );

        this.text_object.geometry.attributes.normal.needsUpdate = true;
        this.text_object.geometry.attributes.position.needsUpdate = true;
        this.text_object.geometry.attributes.uv.needsUpdate = true;
        this.text_object.geometry.attributes.color.needsUpdate = true;

        //this.text_object.geometry.computeVertexNormals ();

        this.text_object.geometry.computeBoundingSphere();
        this.text_object.geometry.computeBoundingBox();

        //context.text_object.geometry = context.geometry;
        


    }

    update(TIME, camera) {
        this.lookAt(camera.position);
        //this method update the text, as the first parameters will receive the time. See core/TIME module
    }

    get_size () {
        return this.geometry.boundingBox.getSize();
    }
}

