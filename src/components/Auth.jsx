// src/components/Auth.jsx
import React, { useState } from "react";
import Swal from "sweetalert2";
import { useLogin, usePreRegistro, useVerificarRegistro } from "../hooks/useAuth";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

function Auth() {
  // Estados para login
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Estados para registro
  const [signupName, setSignupName] = useState("");
  const [signupLastName, setSignupLastName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  // Estados de verificación
  const [showCodeForm, setShowCodeForm] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [usuarioPendiente, setUsuarioPendiente] = useState(null);
  const [registroLoading, setRegistroLoading] = useState(false);

  const { setUser } = useUser();
  const navigate = useNavigate();

  // Mutations
  const loginMutation = useLogin();
  const preRegistroMutation = usePreRegistro();
  const verificarRegistroMutation = useVerificarRegistro();

  // Handlers
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) return;

    loginMutation.mutate(
        { email: loginEmail, password: loginPassword },
        {
          onSuccess: async () => {
            // Refresca usuario global tras login (y persiste en sessionStorage desde el contexto)
            const res = await fetch("http://localhost:8080/api/usuarios/me", { credentials: "include" });
            if (res.ok) {
              const data = await res.json();
              setUser(data); // <- persistente
              Swal.fire({
                icon: "success",
                title: `Bienvenido, ${data.nombre}!`,
              });
              setTimeout(() => {
                if (data.rol === "ADMIN") {
                  navigate("/admin");
                } else {
                  navigate("/");
                }
              }, 1200);
            } else {
              Swal.fire({
                icon: "error",
                title: "Error al cargar datos de usuario",
              });
            }
          },
          onError: (error) => {
            Swal.fire({
              icon: "error",
              title: "Error al iniciar sesión",
              text: error.message,
            });
          },
        }
    );
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setRegistroLoading(true);

    const nuevoUsuario = {
      nombre: signupName,
      apellido: signupLastName,
      email: signupEmail,
      password: signupPassword,
    };
    setUsuarioPendiente(nuevoUsuario);

    preRegistroMutation.mutate(nuevoUsuario, {
      onSuccess: () => {
        setRegistroLoading(false);
        setShowCodeForm(true);
      },
      onError: (error) => {
        setRegistroLoading(false);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.message,
        });
      },
    });
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!verificationCode || !usuarioPendiente) {
      Swal.fire({
        icon: "warning",
        title: "Código requerido",
        text: "Por favor ingresa el código de verificación.",
      });
      return;
    }

    verificarRegistroMutation.mutate(
        { email: usuarioPendiente.email, codigo: verificationCode },
        {
          onSuccess: () => {
            Swal.fire({
              icon: "success",
              title: "Registro exitoso",
              text: "¡Ahora puedes iniciar sesión!",
            });
            // Resetea formulario y vista
            setShowCodeForm(false);
            setSignupName("");
            setSignupLastName("");
            setSignupEmail("");
            setSignupPassword("");
            setVerificationCode("");
            setUsuarioPendiente(null);
            const flip = document.getElementById("flip");
            if (flip) flip.checked = false;
          },
          onError: (error) => {
            Swal.fire({
              icon: "error",
              title: "Código incorrecto",
              text: error.message,
            });
          },
        }
    );
  };

  // Mostrar el form de registro de nuevo si el usuario se equivocó
  const volverRegistro = (e) => {
    e.preventDefault();
    setShowCodeForm(false);
    setVerificationCode("");
  };

  return (
      <div className="auth-bg">
        <div className="container">
          {/* El input checkbox controla el flip */}
          <input type="checkbox" id="flip" />
          <div className="cover">
            <div className="front">
              <img src="/imgs/logSignimg.jpg" alt="" />
              <div className="text">
              <span className="text-1">
                Cada nuevo encuentro <br /> es una oportunidad de sanar
              </span>
                <span className="text-2">Conecta con tu bienestar</span>
              </div>
            </div>
            <div className="back">
              <img src="/imgs/logSignimg.jpg" alt="" />
              <div className="text">
              <span className="text-1">
                El equilibrio interior <br /> comienza con un paso
              </span>
                <span className="text-2">Comienza con Biosencia</span>
              </div>
            </div>
          </div>

          <div className="forms">
            <div className="form-content">
              {/* LOGIN FORM */}
              <div className="login-form">
                <div className="title">Iniciar Sesión</div>
                <form id="loginForm" onSubmit={handleLogin}>
                  <div className="input-boxes">
                    <div className="input-box">
                      <i className="fas fa-envelope"></i>
                      <input
                          type="text"
                          placeholder="Ingresa tu correo"
                          id="loginEmail"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          required
                      />
                    </div>
                    <div className="input-box">
                      <i className="fas fa-lock"></i>
                      <input
                          type="password"
                          placeholder="Ingresa tu contraseña"
                          id="loginPassword"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          required
                      />
                    </div>
                    <div className="text">
                      <button
                          type="button"
                          className="forgotpassword"
                          style={{
                            background: "none",
                            border: "none",
                            padding: 0,
                            margin: 0,
                            color: "inherit",
                            cursor: "pointer",
                          }}
                      >
                        ¿Olvidaste tu contraseña?
                      </button>
                    </div>
                    <div className="button input-box">
                      <input
                          type="submit"
                          value={loginMutation.isLoading ? "Cargando..." : "Iniciar sesión"}
                          disabled={loginMutation.isLoading}
                      />
                    </div>
                    <div className="text sign-up-text">
                      ¿No tienes una cuenta? <label htmlFor="flip">Regístrate ahora</label>
                    </div>
                  </div>
                </form>
              </div>

              {/* SIGNUP FORM y VERIFICACIÓN */}
              <div className="signup-form">
                <div className="title">Registro</div>

                <form
                    id="signupForm"
                    onSubmit={handleSignup}
                    style={{ display: showCodeForm ? "none" : "block" }}
                >
                  <div className="input-boxes">
                    <div className="input-box">
                      <i className="fas fa-user"></i>
                      <input
                          type="text"
                          placeholder="Ingresa tu nombre"
                          id="signupName"
                          value={signupName}
                          onChange={(e) => setSignupName(e.target.value)}
                          required
                      />
                    </div>
                    <div className="input-box">
                      <i className="fas fa-user"></i>
                      <input
                          type="text"
                          placeholder="Ingresa tu apellido"
                          id="signupLastName"
                          value={signupLastName}
                          onChange={(e) => setSignupLastName(e.target.value)}
                          required
                      />
                    </div>
                    <div className="input-box">
                      <i className="fas fa-envelope"></i>
                      <input
                          type="text"
                          placeholder="Ingresa tu correo"
                          id="signupEmail"
                          value={signupEmail}
                          onChange={(e) => setSignupEmail(e.target.value)}
                          required
                      />
                    </div>
                    <div className="input-box">
                      <i className="fas fa-lock"></i>
                      <input
                          type="password"
                          placeholder="Ingresa tu contraseña"
                          id="signupPassword"
                          value={signupPassword}
                          onChange={(e) => setSignupPassword(e.target.value)}
                          required
                      />
                    </div>
                    <div className="button input-box">
                      <input
                          type="submit"
                          value={registroLoading || preRegistroMutation.isLoading ? "Enviando..." : "Registrarse"}
                          disabled={registroLoading || preRegistroMutation.isLoading}
                      />
                    </div>
                    <div className="text sign-up-text">
                      ¿Ya tienes una cuenta? <label htmlFor="flip">Inicia sesión</label>
                    </div>
                  </div>
                </form>

                {(registroLoading || preRegistroMutation.isLoading) && (
                    <div id="registroMensaje" style={{ textAlign: "center", marginTop: 10 }}>
                      <div className="spinner"></div>
                      <p id="registroTexto">Enviando código...</p>
                    </div>
                )}

                <div className="code-form" id="codeForm" style={{ display: showCodeForm ? "block" : "none" }}>
                  <div className="title">Verifica tu correo</div>
                  <form id="verifyForm" onSubmit={handleVerify}>
                    <div className="input-boxes">
                      <div className="input-box">
                        <i className="fas fa-key"></i>
                        <input
                            type="text"
                            placeholder="Código de verificación"
                            id="verificationCode"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                            required
                        />
                      </div>
                      <div className="button input-box">
                        <input
                            type="submit"
                            value={verificarRegistroMutation.isLoading ? "Verificando..." : "Verificar Código"}
                            disabled={verificarRegistroMutation.isLoading}
                        />
                      </div>
                      <div className="text sign-up-text">
                        ¿Te equivocaste?{" "}
                        <button
                            type="button"
                            id="volverRegistro"
                            onClick={volverRegistro}
                            style={{
                              background: "none",
                              border: "none",
                              padding: 0,
                              margin: 0,
                              color: "inherit",
                              cursor: "pointer",
                            }}
                        >
                          Volver
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
              {/* /signup-form */}
            </div>
          </div>
        </div>
      </div>
  );
}

export default Auth;
