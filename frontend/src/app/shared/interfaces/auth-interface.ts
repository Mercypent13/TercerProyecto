interface SignupData {
  nombre: string;
  correo_electronico: string;
  contrasena: string;
}

interface UserData {
  _id: string,
  nombre: string;
  correo_electronico: string;
  rol: string;
}

interface LoginData {
  correo_electronico: string;
  contrasena: string;
}

interface AuthResponse {
  message: string;
  token: string;
  data: {
    _id: string;
    nombre: string;
    correo_electronico: string;
    rol: string;
  };
}