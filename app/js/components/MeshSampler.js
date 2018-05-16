export default class MeshSampler 
{
  constructor()
  {

  }

  sample(geometry, sample_count)
  {
    let face_areas = [];

    var index_count = geometry.faces.length;
    let min_area = 99999999;
    for(let i=0; i< index_count; i++)
    {
        let area = this.get_face_area (geometry.faces[i], geometry.vertices);
        //let area = this.get_face_area (geometry.faces[i]);
        min_area = Math.min(area, min_area);
        face_areas.push(area);
    }


    let normalized_faces_array = this.get_uniform_face_distribution(face_areas, min_area);

    let selected_faces = this.select_random_faces(normalized_faces_array, sample_count);


    let sampled_points = this.sample_points_from_faces(selected_faces);

    console.log(sampled_points);

    return sampled_points;

  }


  sample_points_from_faces(faces)
  {
      let sampled_points = [];

      for(let i=0; i< faces.length; i++)
      {
          let face = faces[i];

          let w1 = Math.random();
          let w2 = Math.random();

          sampled_points.push(this.sample_point_in_face(w1, w2, face.a, face.b, face.c).clone());
      }
      return sampled_points;
  }

  select_random_faces(faces, amount)
  {
    let selected_faces = [];

    for(let i=0; i< amount; i++)
    {
      let random = parseInt(Math.random * (faces.length-1));
      let selected_face = faces[random];

      selected_faces.push(selected_face);
    }

    return selected_faces;
  }

  get_uniform_face_distribution(face_areas, minimum_area)
  {
      let extended_triangle_indices = [];
      for(let i=0; i< face_areas.length; i++)
      {
          face_areas[i] /= minimum_area;
          let repetitions_needed = parseInt(Math.round(face_areas[i]));

          for(let j=0; j< repetitions_needed; j++)
          {
              extended_triangle_indices.push(face_areas[i]);
          }
      }
      return extended_triangle_indices;
  }

  get_face_area(face, vertices)
  {
    let v1 = vertices[face.a].clone();
    let v2 = vertices[face.b].clone();
    let v3 = vertices[face.c].clone();

    return (v2.clone().sub(v1)).cross(v3.clone().sub(v1)).length/2;
  }

  sample_point_in_face( w1, w2, v1, v2, v3)
  {
      if(w1+w2 > 1)
      {
          w1 = 1.0 - w1;
          w2 = 1.0 - w2;
      }

      let w3 = 1.0 - (w1+w2);

      return v1.clone().multiplyScalar(w1).add(v2.clone().multiplyScalar(w2)).add(v3.clone().multiplyScalar(w3));
  }
}