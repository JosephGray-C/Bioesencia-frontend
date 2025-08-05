import { useMutation } from "@tanstack/react-query";

// Login
export function useLogin() {
  return useMutation({
    mutationFn: async (data) => {
      const response = await fetch('http://localhost:8080/api/usuarios/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include'
      });
      if (!response.ok) throw new Error(await response.text());
      return response.json();
    }
  });
}

// Pre-registro (envía código)
export function usePreRegistro() {
  return useMutation({
    mutationFn: async (usuario) => {
      const response = await fetch('http://localhost:8080/api/usuarios/pre-registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(usuario),
      });
      if (!response.ok) throw new Error(await response.text());
      return response.text();
    }
  });
}

// Verificar código
export function useVerificarRegistro() {
  return useMutation({
    mutationFn: async ({ email, codigo }) => {
      const response = await fetch('http://localhost:8080/api/usuarios/verificar-registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, codigo }),
      });
      if (!response.ok) throw new Error(await response.text());
      return response.text();
    }
  });
}

// Logout (centralizado)
export function useLogout() {
  return useMutation({
    mutationFn: async () => {
      const response = await fetch("http://localhost:8080/api/usuarios/logout", {
        method: "POST",
        credentials: "include"
      });
      if (!response.ok) throw new Error(await response.text());
      return true;
    }
  });
}
