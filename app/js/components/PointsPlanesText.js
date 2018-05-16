import Text from 'js/components/Text';
import DEBUG from 'js/core/Debug';
import fontToGeometryFactory from 'js/components/FontToGeometryFactory';
import MeshSampler from 'js/core/MeshSampler';

// create text from extruding a shape created from a json text
export default class PointsPlanesText extends Text
{
    constructor(config = {}) { 
        super()


        this.material = new THREE.MeshPhongMaterial( {
            color: 0xFFAF2E,
            specular : 0xffffff,
            emissive : 0x212122,
            vertexColors: THREE.VertexColors,
            shininess: 20,
            bumpScale : 0.2,
            //flatShading : true,
            //side : THREE.DoubleSide,
            //opacity : 0.
            //map : (new THREE.TextureLoader()).load('525829239.jpg'),
            bumpMap : (new THREE.TextureLoader()).load('525829239.jpg')
        } );
        this.geometry = new THREE.BufferGeometry();
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
            curveSegments  :    4
        };

        if ( context.geometry ){ 
            context.geometry.dispose();
        }
        const ms = new MeshSampler();
        // we load a 3d font model
        fontToGeometryFactory.create_geometry({
            text : context.text,
            size : size,
            callback : (shapes) => {
                context.geometry = new THREE.ExtrudeGeometry( shapes, extrudeSettings );
                context.geometry.computeBoundingBox();
                const xMid = - 0.5 * (context.geometry.boundingBox.max.x - context.geometry.boundingBox.min.x );
                const yMid = - 0.5 * (context.geometry.boundingBox.max.y - context.geometry.boundingBox.min.y );
                const zMid = - 0.5 * (context.geometry.boundingBox.max.z - context.geometry.boundingBox.min.z );

                context.geometry.translate( xMid, yMid, zMid );
                const geo = ms.sample(context.geometry , 18000);

                context.create_shapes(geo, config.geometry);
                // we only change the geometry of the 3d object to save up memory
                //context.text_object.geometry = context.geometry;
            }
        });
    }

    get_points() {

    }

    create_shapes(points, geometry) {
        let attributes = points ;

        var point_length = attributes.length /3;

        const post_length = geometry.attributes.position.array.length/3;
        const extranded_attributes = new Float32Array(post_length * point_length * 3)

        var indices = [];
        var normals = [];
        var uv = [];
        var colors = []
        var color = new THREE.Color();
        for(let i = 0 ; i < point_length; i++) {
            //set scale for individual geometries
            const scale = 2 + Math.random() * 2;
            for(var j = 0 ; j < post_length; j++) {
                extranded_attributes[i * 3 * geometry.attributes.position.count + j * 3 ] =   ( scale * geometry.attributes.position.array[j * 3] + attributes[i * 3]);
                extranded_attributes[i * 3 * geometry.attributes.position.count + j * 3 + 1] =  ( scale * geometry.attributes.position.array[j * 3 + 1] + attributes[i * 3 + 1] );
                extranded_attributes[i * 3 * geometry.attributes.position.count + j * 3 + 2] = ( scale * geometry.attributes.position.array[j * 3 + 2] + attributes[i * 3 + 2] );
            }
            //copying geo data into points
            for (var j = 0; j < geometry.index.count; j++) {
                indices.push(i * geometry.attributes.position.count + geometry.index.array[j])
            }

            for (var j = 0; j < geometry.attributes.normal.array.length; j++) {
                normals.push(geometry.attributes.normal.array[j])
            }

            for (var j = 0; j < geometry.attributes.uv.array.length; j++) {
                uv.push(geometry.attributes.uv.array[j])
            }      

            // generating vertex color
            var rr = Math.random();
                color.setHSL(rr , .95, 0.5);

            for (var j = 0; j < post_length; j++) {
                colors.push( color.r , color.g, color.b );
            }
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
        this.text_object.geometry.computeVertexNormals ();

        this.text_object.geometry.computeBoundingSphere();
        this.text_object.geometry.computeBoundingBox();

        //context.text_object.geometry = context.geometry;
        

        this.t = 0
    }

    update(TIME, camera) {
        //this.lookAt(camera.position);
        if (this.text_object.geometry.attributes.position) {
        var i = this.text_object.geometry.attributes.position.array.length / 12;
        this.t++;
        while(i--) {
            const r = Math.sin(i % 100 * this.t * 0.005) * 0.1
            for (var j = 0 ; j < 12 ; j++) {
                this.text_object.geometry.attributes.position.array[i * 12 +j] = this.text_object.geometry.attributes.position.array[i * 12 +j] + r; 
            }
        }
                this.text_object.geometry.attributes.position.needsUpdate = true;   
        }
        ////this method update the text, as the first parameters will receive the time. See core/TIME module
    }

    get_size () {
        return this.geometry.boundingBox.getSize();
    }
}

