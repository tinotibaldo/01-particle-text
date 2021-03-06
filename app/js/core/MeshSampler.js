export default class MeshSampler 
{
	constructor()
	{
    this.vh1 = new THREE.Vector3();
    this.vh2 = new THREE.Vector3();
    this.vh0 = new THREE.Vector3();
	}

	sample(geometry, sample_count)
	{
		let face_areas = [];


    let min_area = 99999999;
    for(let i=0; i< geometry.faces.length; i++)
    {
        let area = this.get_face_area (geometry.faces[i], geometry.vertices);
        min_area = Math.min(area, min_area);
        face_areas.push(area);
    }

    let normalized_faces_array = this.get_uniform_face_distribution(face_areas, min_area, geometry.faces);
    let selected_faces = this.select_random_faces(normalized_faces_array, sample_count);
    let sampled_points = this.sample_points_from_faces(selected_faces, geometry.vertices);

    return sampled_points;

	}


	sample_points_from_faces(faces, vertices)
  {
      let sampled_points = [];
      for(let i=0; i< faces.length; i++)
      {
          let face = faces[i];

          let w1 = Math.random();
          let w2 = Math.random();
          var res = this.sample_point_in_face(w1, w2, vertices[face.a], vertices[face.b], vertices[face.c]);
          // now returns a buffer geometry
          sampled_points.push(res.x, res.y, res.z);
      }
      return sampled_points;
  }

	select_random_faces(faces, amount)
  {
    let selected_faces = [];
    for(let i=0; i< amount; i++)
    {
    	let random = parseInt(Math.random() * (faces.length-1));
      let selected_face = faces[random];

      selected_faces.push(selected_face);
    }

    return selected_faces;
  }

	get_uniform_face_distribution(face_areas, minimum_area, faces)
  {
      let extended_triangle_indices = [];
      for(let i=0; i< face_areas.length; i++)
      {
          face_areas[i] /= minimum_area;
          let repetitions_needed = parseInt(Math.round(face_areas[i]));
          for(let j=0; j< repetitions_needed; j++)
          {
              extended_triangle_indices.push(faces[i]);
          }
      }
      return extended_triangle_indices;
  }

  get_face_area(face, vertices)
  {
  	let v1 = vertices[face.a];
  	let v2 = vertices[face.b];
  	let v3 = vertices[face.c];

    this.vh1.copy(v2).sub(v1);
    this.vh2.copy(v3).sub(v1);

  	return this.vh1.cross(this.vh2).length()/2;
  }

  sample_point_in_face( w1, w2, v1, v2, v3)
  {
      if(w1+w2 > 1)
      {
          w1 = 1.0 - w1;
          w2 = 1.0 - w2;
      }

      let w3 = 1.0 - (w1+w2);

      this.vh1.copy(v3);
      this.vh2.copy(v2);
      this.vh0.copy(v1);
      return this.vh0.multiplyScalar(w1).add(this.vh2.multiplyScalar(w2)).add(this.vh1.multiplyScalar(w3));
  }
}