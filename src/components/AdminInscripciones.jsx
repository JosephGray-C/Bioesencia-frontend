// src/components/AdminInscripciones.jsx
import { useEffect, useState, useCallback } from "react";
import Swal from "sweetalert2";

const API_URL = "http://localhost:8080/api/inscripciones";

export default function AdminInscripciones() {
  const [inscripciones, setInscripciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const porPagina = 10;

  const cargar = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}`);
      if (!res.ok) throw new Error("No se pudo cargar la lista de inscripciones.");
      const data = await res.json();
      setInscripciones(Array.isArray(data) ? data : []);
    } catch (e) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: e.message || "Ocurrió un problema al cargar.",
        confirmButtonColor: "#5A0D0D",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const handleVer = (i) => {
    const html = `
      <div style="text-align:left">
        <p><b>ID inscripción:</b> ${i?.id ?? "—"}</p>
        <p><b>Fecha inscripción:</b> ${i?.fechaInscripcion ? new Date(i.fechaInscripcion).toLocaleString() : "—"}</p>
        <hr/>
        <p><b>Taller:</b> ${i?.tallerNombre ?? "—"}</p>
        <p><b>Usuario:</b> ${i?.usuarioNombre ?? "—"} ${i?.usuarioApellido ?? ""}</p>
        <p><b>Email:</b> ${i?.usuarioEmail ?? "—"}</p>
        ${i?.estado ? `<hr/><p><b>Estado:</b> ${i.estado}</p>` : ""}
      </div>
    `;
    Swal.fire({
      title: "Detalle de inscripción",
      html,
      width: 600,
      confirmButtonColor: "#5EA743",
    });
  };

  const handleEliminar = async (id) => {
    const confirm = await Swal.fire({
      title: "¿Eliminar inscripción?",
      text: "No podrás revertir esta acción.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#B71C1C",
      cancelButtonColor: "#6c757d",
    });
    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(await res.text());
      setInscripciones((prev) => prev.filter((x) => x.id !== id));
      Swal.fire({
        icon: "success",
        title: "Eliminada",
        text: "La inscripción fue eliminada.",
        confirmButtonColor: "#5EA743",
      });
    } catch (e) {
      Swal.fire({
        icon: "error",
        title: "Error al eliminar",
        text: e.message || "Intenta nuevamente.",
        confirmButtonColor: "#5A0D0D",
      });
    }
  };

  // Filtro por texto (taller/usuario/email/estado)
  const filtros = busqueda.trim().toLowerCase();
  const listaFiltrada = inscripciones.filter((i) => {
    const a = [
      i?.fechaInscripcion,
      i?.tallerNombre,
      i?.usuarioNombre,
      i?.usuarioApellido,
      i?.usuarioEmail,
      i?.estado,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return a.includes(filtros);
  });

  // Paginación
  const totalPaginas = Math.ceil(listaFiltrada.length / porPagina) || 1;
  const indexIni = (paginaActual - 1) * porPagina;
  const page = listaFiltrada.slice(indexIni, indexIni + porPagina);

  useEffect(() => {
    if (paginaActual > totalPaginas) setPaginaActual(1);
  }, [totalPaginas, paginaActual]);

  return (
    <div className="home-crud">
      {/* HEADER acciones */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 14,
          gap: 18,
          width: "100%",
        }}
      >
        <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
          <input
            type="text"
            placeholder="Buscar por taller, usuario, email, estado…"
            value={busqueda}
            onChange={(e) => {
              setBusqueda(e.target.value);
              setPaginaActual(1);
            }}
            style={{
              padding: "10px 14px",
              borderRadius: 8,
              border: "1px solid #ccc",
              fontSize: 16,
              width: "100%",
              maxWidth: 320,
            }}
          />
        </div>
        <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
          <button
            onClick={cargar}
            style={{
              background: "#5EA743",
              color: "#fff",
              fontWeight: 700,
              border: "none",
              borderRadius: 8,
              padding: "10px 20px",
              fontSize: 16,
              cursor: "pointer",
            }}
            title="Refrescar"
          >
            ↻ Refrescar
          </button>
        </div>
      </div>

      {/* TABLA */}
      <table
        style={{
          width: "100%",
          background: "#23272f",
          borderCollapse: "collapse",
          color: "#fff",
        }}
      >
        <thead>
          <tr style={{ background: "#20232b" }}>
            <th style={{ padding: 12, textAlign: "left" }}>Fecha inscrip.</th>
            <th style={{ padding: 12, textAlign: "left" }}>Taller</th>
            <th style={{ padding: 12, textAlign: "left" }}>Nombre</th>
            <th style={{ padding: 12, textAlign: "left" }}>Apellido</th>
            <th style={{ padding: 12, textAlign: "left" }}>Email</th>
            <th style={{ padding: 12, textAlign: "center" }}>Estado</th>
            <th style={{ padding: 12, textAlign: "center" }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={7} style={{ textAlign: "center", padding: 20 }}>
                Cargando…
              </td>
            </tr>
          ) : page.length === 0 ? (
            <tr>
              <td colSpan={7} style={{ textAlign: "center", padding: 20 }}>
                No hay inscripciones
              </td>
            </tr>
          ) : (
            page.map((i) => (
              <tr key={i.id} style={{ borderBottom: "1px solid #222" }}>
                <td style={{ padding: 10, verticalAlign: "middle" }}>
                  {i?.fechaInscripcion
                    ? new Date(i.fechaInscripcion).toLocaleString()
                    : "—"}
                </td>
                <td
                  style={{
                    padding: 10,
                    verticalAlign: "middle",
                    maxWidth: 240,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                  title={i?.tallerNombre || ""}
                >
                  {i?.tallerNombre ?? "—"}
                </td>
                <td style={{ padding: 10, verticalAlign: "middle" }}>
                  {i?.usuarioNombre ?? "—"}
                </td>
                <td style={{ padding: 10, verticalAlign: "middle" }}>
                  {i?.usuarioApellido ?? "—"}
                </td>
                <td style={{ padding: 10, verticalAlign: "middle" }}>
                  {i?.usuarioEmail ?? "—"}
                </td>
                <td style={{ padding: 10, textAlign: "center", verticalAlign: "middle" }}>
                  {i?.estado ?? "—"}
                </td>
                <td style={{ padding: 10, textAlign: "center", verticalAlign: "middle" }}>
                  <button
                    onClick={() => handleVer(i)}
                    style={{
                      marginRight: 8,
                      background: "#fff",
                      color: "#1976D2",
                      border: "none",
                      borderRadius: 5,
                      padding: "5px 8px",
                      fontSize: 16,
                      cursor: "pointer",
                    }}
                    title="Ver detalle"
                  >
                    <i className="fas fa-eye"></i>
                  </button>
                  <button
                    onClick={() => handleEliminar(i.id)}
                    style={{
                      background: "#fff",
                      color: "#B71C1C",
                      border: "none",
                      borderRadius: 5,
                      padding: "5px 8px",
                      fontSize: 16,
                      cursor: "pointer",
                    }}
                    title="Eliminar"
                  >
                    <i className="fas fa-trash-alt"></i>
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* FOOTER + PAGINACIÓN */}
      <div style={{ width: "100%", marginTop: 20 }}>
        <span style={{ color: "#ccc", display: "block", marginBottom: 8, textAlign: "center" }}>
          Mostrando {page.length} de {listaFiltrada.length}
        </span>
        <div style={{ display: "flex", justifyContent: "center", gap: 4 }}>
          {Array.from({ length: totalPaginas }, (_, i) => (
            <button
              key={`pagina-${i + 1}`}
              onClick={() => setPaginaActual(i + 1)}
              style={{
                margin: "0 2px",
                padding: "6px 12px",
                borderRadius: 6,
                background: paginaActual === i + 1 ? "#5EA743" : "#444",
                color: "#fff",
                border: "none",
                cursor: "pointer",
              }}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}