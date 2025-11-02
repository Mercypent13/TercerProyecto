export interface Category {
  _id: string;
  nombre: string;
  descripcion: string;
}

export interface TopObra {
  _id: string;
  titulo: string;
  url_imagen: string;
  averageRating: number;
  autor: {
    nombre: string;
    _id: string;
  };
}

export interface Obra {
  _id: string;
  titulo: string;
  url_imagen: string;
  averageRating: number;
  autor: {
    nombre: string;
    _id: string;
  },
  categorias: [string],
  ratings: {
    user: string,
    score: string
  },
  fecha_creacion: Date,
  fecha_actualizacion: Date
}