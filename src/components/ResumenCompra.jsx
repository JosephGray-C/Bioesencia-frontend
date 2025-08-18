<<<<<<< HEAD
// src/components/ResumenCompra.jsx
=======
>>>>>>> 075d139 (FrontEnd completo responsive)
import React, { useMemo } from "react";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const API_CARRITO = "http://localhost:8080/api/carrito";
const API_ORDENES = "http://localhost:8080/api/ordenes";

async function fetchCarrito({ queryKey, signal }) {
<<<<<<< HEAD
    const [, userId] = queryKey;
    if (!userId) return [];
    const res = await fetch(`${API_CARRITO}/${userId}`, { signal });
    if (!res.ok) return [];
    const data = await res.json();
    return (data || []).filter(
        (item) => item?.producto && typeof item.producto.precio !== "undefined"
    );
}

async function postCrearOrden(payload) {
    const res = await fetch(API_ORDENES, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
}

export default function ResumenCompra() {
    const { user } = useUser();
    const navigate = useNavigate();
    const qc = useQueryClient();

    const { data: carrito = [] } = useQuery({
        queryKey: ["carrito", user?.id],
        queryFn: fetchCarrito,
        enabled: !!user?.id,
        initialData: () => qc.getQueryData(["carrito", user?.id]) || [],
        staleTime: 120_000,
        keepPreviousData: true,
        refetchOnWindowFocus: false,
    });

    const { subtotal, impuesto, total } = useMemo(() => {
        const sb = carrito.reduce(
            (acc, item) =>
                acc + Number(item.producto?.precio || 0) * Number(item.cantidad || 0),
            0
        );
        const tax = sb * 0.13;
        return { subtotal: sb, impuesto: tax, total: sb + tax };
    }, [carrito]);

    const mOrden = useMutation({
        mutationFn: postCrearOrden,
        onSuccess: (ordenGuardada) => {
            if (user?.id) qc.setQueryData(["carrito", user.id], []);

            Swal.fire({
                title: "Orden generada",
                text: "Te hemos enviado el PDF de tu orden de compra",
                icon: "success",
                confirmButtonText: "Finalizar",
                confirmButtonColor: "#5EA743",
            }).then(() => {
                navigate(`/orden/${ordenGuardada.codigoOrden}`);
            });
        },
        onError: (err) => {
            Swal.fire("Error", err.message || "No se pudo registrar la orden", "error");
        },
    });

    const confirmarOrden = () => {
        if (!user) {
            Swal.fire("Error", "Usuario no autenticado", "error");
            return;
        }
        if (carrito.length === 0) {
            Swal.fire("Atención", "Tu carrito está vacío.", "info");
            return;
        }
        const payload = {
            usuario: { id: user.id },
            items: carrito.map((item) => ({
                producto: { id: item.producto.id },
                cantidad: item.cantidad,
            })),
        };
        mOrden.mutate(payload);
    };

    if (!user) {
        return (
            <div style={{ background: "#23272f", padding: "40px 0", minHeight: "100vh" }}>
                <div
                    style={{
                        background: "#fff",
                        width: "90%",
                        maxWidth: "920px",
                        margin: "0 auto",
                        padding: "50px 60px",
                        boxShadow: "0 0 10px rgba(0,0,0,0.15)",
                        textAlign: "center",
                    }}
                >
                    <h3>Debes iniciar sesión para continuar</h3>
                </div>
            </div>
        );
    }

    return (
        <div style={{ background: "#23272f", padding: "40px 0", minHeight: "100vh" }}>
            <div
                style={{
                    background: "#fff",
                    width: "90%",
                    maxWidth: "920px",
                    margin: "0 auto",
                    padding: "50px 60px",
                    fontFamily: "Arial, sans-serif",
                    fontSize: 15,
                    boxShadow: "0 0 10px rgba(0,0,0,0.15)",
                }}
            >
                {/* Logo y datos empresa */}
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
                    <div>
                        <img
                            src="/imgs/LOGO_BIOESENCIA.jpg"
                            alt="Logo"
                            style={{ height: 80, marginBottom: 10 }}
                        />
                        <div style={{ fontSize: 18, fontWeight: "bold", color: "#5EA743" }}>BIOESENCIA</div>
                    </div>
                    <div style={{ fontSize: 14, textAlign: "right" }}>
                        <div>
                            <strong>Cédula:</strong> 1-1058-0435
                        </div>
                        <div>
                            <strong>Teléfono:</strong> +506 8362-1394
                        </div>
                        <div>
                            <strong>Correo:</strong> bioesenciacostarica@gmail.com
                        </div>
                        <div>
                            <strong>Código Postal:</strong> 10601
                        </div>
                    </div>
                </div>

                {/* Cliente */}
                <div
                    style={{
                        backgroundColor: "#ccc",
                        padding: "6px 10px",
                        fontWeight: "bold",
                        marginTop: 30,
                        marginBottom: 10,
                    }}
                >
                    Datos del Cliente
                </div>
                <table style={{ width: "100%", marginBottom: 20 }}>
                    <tbody>
                        <tr>
                            <td>
                                <strong>Nombre:</strong> {user?.nombre} {user?.apellido}
                            </td>
                            <td>
                                <strong>Email:</strong> {user?.email}
                            </td>
                        </tr>
                    </tbody>
                </table>

                {/* Productos */}
                <div
                    style={{
                        backgroundColor: "#ccc",
                        padding: "6px 10px",
                        fontWeight: "bold",
                        marginBottom: 10,
                    }}
                >
                    Productos
                </div>
                <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 20 }}>
                    <thead>
                        <tr style={{ background: "#f5f5f5" }}>
                            <th style={{ padding: 10, textAlign: "left" }}>Producto</th>
                            <th style={{ padding: 10 }}>Cantidad</th>
                            <th style={{ padding: 10 }}>Precio unitario</th>
                            <th style={{ padding: 10 }}>Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {carrito.map((item) => (
                            <tr key={item.id}>
                                <td style={{ padding: 10 }}>{item.producto.nombre}</td>
                                <td style={{ textAlign: "center" }}>{item.cantidad}</td>
                                <td style={{ textAlign: "center" }}>
                                    ₡{Number(item.producto.precio || 0).toFixed(2)}
                                </td>
                                <td style={{ textAlign: "center" }}>
                                    ₡{Number((item.producto.precio || 0) * (item.cantidad || 0)).toFixed(2)}
                                </td>
                            </tr>
                        ))}
                        {carrito.length === 0 && (
                            <tr>
                                <td colSpan={4} style={{ padding: 10, textAlign: "center", color: "#777" }}>
                                    No hay productos en el carrito.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* Totales */}
                <table style={{ width: "100%", fontSize: 15 }}>
                    <tbody>
                        <tr>
                            <td style={{ textAlign: "right", paddingRight: 12 }}>
                                <strong>Subtotal:</strong>
                            </td>
                            <td style={{ textAlign: "right" }}>₡{subtotal.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td style={{ textAlign: "right", paddingRight: 12 }}>
                                <strong>Impuestos:</strong>
                            </td>
                            <td style={{ textAlign: "right" }}>₡{impuesto.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td style={{ textAlign: "right", paddingRight: 12, fontSize: 16, fontWeight: 700 }}>
                                Total a pagar:
                            </td>
                            <td style={{ textAlign: "right", fontSize: 16, fontWeight: 700 }}>
                                ₡{total.toFixed(2)}
                            </td>
                        </tr>
                    </tbody>
                </table>

                {/* Botones */}
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 40 }}>
                    <button
                        onClick={() => navigate("/carrito")}
                        style={{
                            background: "#888",
                            color: "#fff",
                            padding: "10px 24px",
                            border: "none",
                            borderRadius: 8,
                            cursor: "pointer",
                        }}
                    >
                        Volver al carrito
                    </button>

                    <button
                        onClick={confirmarOrden}
                        disabled={carrito.length === 0 || mOrden.isPending}
                        style={{
                            background:
                                carrito.length === 0 || mOrden.isPending ? "#a8d29a" : "#5EA743",
                            color: "#fff",
                            padding: "10px 28px",
                            border: "none",
                            borderRadius: 8,
                            cursor:
                                carrito.length === 0 || mOrden.isPending ? "not-allowed" : "pointer",
                            fontWeight: 600,
                            opacity: carrito.length === 0 || mOrden.isPending ? 0.9 : 1,
                        }}
                        title={mOrden.isPending ? "Confirmando…" : "Confirmar Orden"}
                    >
                        {mOrden.isPending ? "Confirmando…" : "Confirmar Orden"}
                    </button>
                </div>
            </div>
        </div>
    );
}
=======
  const [, userId] = queryKey;
  if (!userId) return [];
  const res = await fetch(`${API_CARRITO}/${userId}`, { signal });
  if (!res.ok) return [];
  const data = await res.json();
  return (data || []).filter(
    (item) => item?.producto && typeof item.producto.precio !== "undefined"
  );
}

async function postCrearOrden(payload) {
  const res = await fetch(API_ORDENES, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export default function ResumenCompra() {
  const { user } = useUser();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data: carrito = [] } = useQuery({
    queryKey: ["carrito", user?.id],
    queryFn: fetchCarrito,
    enabled: !!user?.id,
    initialData: () => qc.getQueryData(["carrito", user?.id]) || [],
    staleTime: 120_000,
    keepPreviousData: true,
    refetchOnWindowFocus: false,
  });

  const { subtotal, impuesto, total } = useMemo(() => {
    const sb = carrito.reduce(
      (acc, item) =>
        acc + Number(item.producto?.precio || 0) * Number(item.cantidad || 0),
      0
    );
    const tax = sb * 0.13;
    return { subtotal: sb, impuesto: tax, total: sb + tax };
  }, [carrito]);

  const mOrden = useMutation({
    mutationFn: postCrearOrden,
    onSuccess: (ordenGuardada) => {
      if (user?.id) qc.setQueryData(["carrito", user.id], []);
      Swal.fire({
        title: "Orden generada",
        text: "Te hemos enviado el PDF de tu orden de compra",
        icon: "success",
        confirmButtonText: "Finalizar",
        confirmButtonColor: "#5EA743",
      }).then(() => {
        navigate(`/orden/${ordenGuardada.codigoOrden}`);
      });
    },
    onError: (err) => {
      Swal.fire("Error", err.message || "No se pudo registrar la orden", "error");
    },
  });

  const confirmarOrden = () => {
    if (!user) return Swal.fire("Error", "Usuario no autenticado", "error");
    if (carrito.length === 0) return Swal.fire("Atención", "Tu carrito está vacío.", "info");

    const payload = {
      usuario: { id: user.id },
      items: carrito.map((item) => ({
        producto: { id: item.producto.id },
        cantidad: item.cantidad,
      })),
    };
    mOrden.mutate(payload);
  };

  return (
    <div className="rc-page">
      <style>{styles}</style>

      {!user ? (
        <div className="rc-card">
          <h3>Debes iniciar sesión para continuar</h3>
        </div>
      ) : (
        <div className="rc-card">
          {/* Encabezado */}
          <div className="rc-header">
            <div className="rc-brand">
              <img src="/imgs/LOGO_BIOESENCIA.jpg" alt="Logo" />
              <div className="rc-brand-name">BIOESENCIA</div>
            </div>
            <div className="rc-company-info">
              <div><strong>Cédula:</strong> 1-1058-0435</div>
              <div><strong>Teléfono:</strong> +506 8362-1394</div>
              <div><strong>Correo:</strong> bioesenciacostarica@gmail.com</div>
              <div><strong>Código Postal:</strong> 10601</div>
            </div>
          </div>

          {/* Cliente */}
          <div className="rc-section-title">Datos del Cliente</div>
          <div className="rc-two-col">
            <div><strong>Nombre:</strong> {user?.nombre} {user?.apellido}</div>
            <div><strong>Email:</strong> {user?.email}</div>
          </div>

          {/* Productos */}
          <div className="rc-section-title">Productos</div>

          {/* Tabla/Lista responsive */}
          <div className="rc-table-wrap">
            <table className="rc-table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Precio unitario</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {carrito.map((item) => {
                  const pu = Number(item.producto.precio || 0).toFixed(2);
                  const st = Number((item.producto.precio || 0) * (item.cantidad || 0)).toFixed(2);
                  return (
                    <tr key={item.id}>
                      <td data-label="Producto">{item.producto.nombre}</td>
                      <td data-label="Cantidad" className="txt-center">{item.cantidad}</td>
                      <td data-label="Precio unitario" className="txt-right">₡{pu}</td>
                      <td data-label="Subtotal" className="txt-right">₡{st}</td>
                    </tr>
                  );
                })}
                {carrito.length === 0 && (
                  <tr>
                    <td colSpan={4} className="rc-empty">No hay productos en el carrito.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Totales */}
          <div className="rc-totals">
            <div className="rc-totals-row">
              <span>Subtotal:</span>
              <strong>₡{subtotal.toFixed(2)}</strong>
            </div>
            <div className="rc-totals-row">
              <span>Impuestos:</span>
              <strong>₡{impuesto.toFixed(2)}</strong>
            </div>
            <div className="rc-totals-row rc-total-final">
              <span>Total a pagar:</span>
              <strong>₡{total.toFixed(2)}</strong>
            </div>
          </div>

          {/* Botones */}
          <div className="rc-actions">
            <button className="rc-btn rc-btn-gray" onClick={() => navigate("/carrito")}>
              Volver al carrito
            </button>
            <button
              className="rc-btn rc-btn-green"
              onClick={confirmarOrden}
              disabled={carrito.length === 0 || mOrden.isPending}
              title={mOrden.isPending ? "Confirmando…" : "Confirmar Orden"}
            >
              {mOrden.isPending ? "Confirmando…" : "Confirmar Orden"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = `
:root{
  --biosencia-black:#23272f;
  --biosencia-wine:#5A0D0D;
  --biosencia-green:#A9C499;
}

/* Página: fondo BLANCO */
.rc-page{
    margin-top:5dvh;
  background:#fff;
  padding: 16px 10px;
  display:flex;
  justify-content:center;
}

/* Card Factura */
.rc-card{
  background:#fff;
  width:100%;
  max-width:760px;         /* <= más estrecha en desktop */
  margin: 0 auto;
  padding: 20px 16px;
  box-shadow: 0 2px 12px rgba(0,0,0,.08);
  font-family: Arial, sans-serif;
  color:#222;
  border-radius: 12px;
}

/* Header */
.rc-header{
  display:flex; justify-content:space-between; gap:12px; margin-bottom:12px;
}
.rc-brand img{ height:56px; display:block; margin-bottom:6px; }
.rc-brand-name{ font-size:16px; font-weight:800; color:#5EA743; }
.rc-company-info{ font-size:13px; text-align:right; }

/* Secciones */
.rc-section-title{
  background:#e6e6e6; padding:6px 10px; font-weight:700; margin:14px 0 8px; border-radius:6px;
}

/* Datos cliente */
.rc-two-col{ display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:4px; font-size:14px; }

/* Tabla */
.rc-table-wrap{ width:100%; border:1px solid #00000012; border-radius:10px; overflow:hidden; }
.rc-table{ width:100%; border-collapse:collapse; }
.rc-table thead tr{ background:#f7f7f7; }
.rc-table th, .rc-table td{ padding:10px; border-bottom:1px solid #00000010; text-align:left; font-size:14px; }
.rc-table tbody tr:last-child td{ border-bottom:none; }
.rc-empty{ text-align:center; color:#777; padding: 12px; }
.txt-center{text-align:center;} .txt-right{text-align:right;}

/* Totales */
.rc-totals{ margin-top: 12px; display:grid; gap:6px; }
.rc-totals-row{ display:flex; justify-content:space-between; align-items:center; font-size:14px; }
.rc-total-final{ font-size:15px; font-weight:800; }

/* Botones */
.rc-actions{ display:flex; gap:10px; justify-content:space-between; margin-top:18px; flex-wrap:wrap; }
.rc-btn{ border:none; border-radius:10px; padding:10px 18px; cursor:pointer; font-weight:700; font-size:14px; }
.rc-btn-gray{ background:#888; color:#fff; }
.rc-btn-green{ background:#5EA743; color:#fff; }
.rc-btn:disabled{ opacity:.7; cursor:not-allowed; }

/* ====== Responsive (márgenes compactos en móvil) ====== */
@media (max-width: 720px){
  .rc-page{ padding: 8px 6px; }             /* menos margen exterior */
  .rc-card{ padding:12px 10px; border-radius:10px; }

  .rc-header{ flex-direction:column; align-items:flex-start; gap:6px; margin-bottom:10px; }
  .rc-brand img{ height:48px; margin-bottom:4px; }
  .rc-brand-name{ font-size:15px; }
  .rc-company-info{ text-align:left; font-size:12.5px; }

  .rc-section-title{ margin:10px 0 6px; padding:5px 8px; }
  .rc-two-col{ grid-template-columns:1fr; gap:6px; font-size:13.5px; }

  /* Tabla -> Lista */
  .rc-table thead{ display:none; }
  .rc-table, .rc-table tbody, .rc-table tr, .rc-table td{ display:block; width:100%; }
  .rc-table tr{ border-bottom:1px solid #00000010; padding:6px 8px; }
  .rc-table td{
    border:none; padding:5px 0; display:flex; justify-content:space-between; gap:10px; font-size:13.5px;
  }
  .rc-table td::before{
    content: attr(data-label);
    font-weight:700; color:#555;
  }
  .txt-right, .txt-center{ text-align:right; }

  /* Botones 100% en móvil */
  .rc-actions{ flex-direction:column; gap:8px; }
  .rc-actions .rc-btn{ width:100%; }
}
`;
>>>>>>> 075d139 (FrontEnd completo responsive)
