// src/components/AdminProductos.jsx
import { useState } from "react";
import Swal from "sweetalert2";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ClipLoader from "react-spinners/ClipLoader";
import {
    fetchProductos,
    crearProducto,
    actualizarProducto,
    eliminarProducto,
} from "../services/productos";
import usePaginacion from "../hooks/usePaginacion";
import useFiltrarProductos from "../hooks/useFiltrarProductos";
import AdminCrearProductoModal from "./AdminCrearProductoModal";
import AdminEditarProductoModal from "./AdminEditarProductoModal";

export default function AdminProductos() {
    const [showForm, setShowForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    
    // 
    const qc = useQueryClient();
    const { data: productos = [], isFetching } = useQuery({
        queryKey: ["productos"],
        queryFn: fetchProductos,
        initialData: () => qc.getQueryData(["productos"]) || [],
    });
    //
    const showSpinner = isFetching && productos.length === 0;

    const [form, setForm] = useState({
        nombre: "",
        descripcion: "",
        precio: "",
        stock: "",
        imagenUrl: "",
        activo: true,
    });
    
    const [editForm, setEditForm] = useState({
        id: "",
        nombre: "",
        descripcion: "",
        precio: "",
        stock: "",
        imagenUrl: "",
        activo: true,
    });

    const mCrear = useMutation({
        mutationFn: crearProducto,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["productos"] });
            setShowForm(false);
            setForm({
                nombre: "",
                descripcion: "",
                precio: "",
                stock: "",
                imagenUrl: "",
                activo: true,
            });
            Swal.fire("¡Creado!", "Producto agregado.", "success");
        },
        onError: (e) =>
            Swal.fire("Error", e.message || "No se pudo crear", "error"),
    });

    const mEditar = useMutation({
        mutationFn: actualizarProducto,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["productos"] });
            setShowEditForm(false);
            Swal.fire("¡Actualizado!", "Producto modificado.", "success");
        },
        onError: (e) =>
            Swal.fire("Error", e.message || "No se pudo actualizar", "error"),
    });

    const mEliminar = useMutation({
        mutationFn: eliminarProducto,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["productos"] });
            Swal.fire("¡Eliminado!", "Producto borrado.", "success");
        },
        onError: (e) =>
            Swal.fire("Error", e.message || "No se pudo eliminar", "error"),
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((f) => ({
            ...f,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleEditChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEditForm((f) => ({
            ...f,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        mCrear.mutate({
            ...form,
            precio: Number(form.precio),
            stock: Number(form.stock),
        });
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        mEditar.mutate({
            id: editForm.id,
            payload: {
                ...editForm,
                precio: Number(editForm.precio),
                stock: Number(editForm.stock),
            },
        });
    };

    const handleDelete = async (id) => {
        const confirm = await Swal.fire({
            title: "¿Eliminar producto?",
            text: "No podrás revertir esto.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#5A0D0D",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Eliminar",
            cancelButtonText: "Cancelar",
        });
        if (confirm.isConfirmed) mEliminar.mutate(id);
    };

    const onEdit = (prod) => {
        setEditForm({
            id: prod.id,
            nombre: prod.nombre || "",
            descripcion: prod.descripcion || "",
            precio: prod.precio ?? "",
            stock: prod.stock ?? "",
            imagenUrl: prod.imagenUrl || "",
            activo: !!prod.activo,
        });
        setShowEditForm(true);
    };
    // Filtro de productos
    const { listaFiltrada, busqueda, setBusqueda } =
        useFiltrarProductos(productos);
    // Paginación
    const { pagina, totalPaginas, paginaActual, setPaginaActual } =
        usePaginacion(listaFiltrada);

    return (
        <div className="home-crud">
            {/* HEADER */}
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
                        placeholder="Buscar producto"
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
                            maxWidth: 260,
                        }}
                    />
                </div>
                <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
                    <button
                        onClick={() => setShowForm(true)}
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
                    >
                        + Agregar producto
                    </button>
                </div>
            </div>

            {/* MODALES */}
            {showForm && (
                <AdminCrearProductoModal
                    form={form}
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                    onCancel={() => setShowForm(false)}
                />
            )}
            {showEditForm && (
                <AdminEditarProductoModal
                    editForm={editForm}
                    onChange={handleEditChange}
                    onSubmit={handleEditSubmit}
                    onCancel={() => setShowEditForm(false)}
                />
            )}

            {/* TABLA */}
            <table
                style={{
                    width: "100%",
                    background: "#fff",
                    borderCollapse: "collapse",
                    color: "#000000",
                }}
            >
                <thead>
                    <tr style={{ background: "#A9C499", color: "#fff" }}>
                        <th
                            style={{
                                padding: 12,
                                minWidth: 100,
                                width: 100,
                                textAlign: "left",
                            }}
                        >
                            Nombre
                        </th>
                        <th
                            style={{
                                padding: 12,
                                minWidth: 120,
                                width: 100,
                                textAlign: "left",
                            }}
                        >
                            Descripción
                        </th>
                        <th
                            style={{
                                padding: 12,
                                width: 40,
                                textAlign: "left",
                            }}
                        >
                            Precio
                        </th>
                        <th
                            style={{
                                padding: 12,
                                width: 80,
                                textAlign: "center",
                            }}
                        >
                            Stock
                        </th>
                        <th
                            style={{
                                padding: 12,
                                width: 80,
                                textAlign: "center",
                            }}
                        >
                            Activo
                        </th>
                        <th
                            style={{
                                padding: 12,
                                width: 80,
                                textAlign: "center",
                            }}
                        >
                            Acciones
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {pagina.length === 0 ? (
                        <tr>
                            <td
                                colSpan={6}
                                style={{ textAlign: "center", padding: 20 }}
                            >
                                {showSpinner ? (
                                    <span
                                        style={{
                                            display: "inline-flex",
                                            alignItems: "center",
                                            gap: 8,
                                        }}
                                    >
                                        <ClipLoader
                                            size={18}
                                            color="#bbb"
                                            speedMultiplier={0.9}
                                        />
                                    </span>
                                ) : (
                                    "Sin productos"
                                )}
                            </td>
                        </tr>
                    ) : (
                        pagina.map((prod) => (
                            <tr
                                key={prod.id}
                                style={{ borderBottom: "1px solid #222" }}
                            >
                                <td
                                    style={{
                                        padding: 10,
                                        textAlign: "left",
                                        verticalAlign: "middle",
                                    }}
                                >
                                    {prod.nombre}
                                </td>
                                <td
                                    style={{
                                        padding: 10,
                                        textAlign: "left",
                                        verticalAlign: "middle",
                                        maxWidth: 200,
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                    }}
                                    title={prod.descripcion}
                                >
                                    {prod.descripcion?.length > 90
                                        ? prod.descripcion.slice(0, 90) + "..."
                                        : prod.descripcion}
                                </td>
                                <td
                                    style={{
                                        padding: 10,
                                        textAlign: "left",
                                        verticalAlign: "middle",
                                    }}
                                >
                                    ₡{prod.precio}
                                </td>
                                <td
                                    style={{
                                        padding: 10,
                                        textAlign: "center",
                                        verticalAlign: "middle",
                                    }}
                                >
                                    {prod.stock}
                                </td>
                                <td
                                    style={{
                                        padding: 10,
                                        textAlign: "center",
                                        verticalAlign: "middle",
                                    }}
                                >
                                    {prod.activo ? "Sí" : "No"}
                                </td>
                                <td
                                    style={{
                                        padding: 10,
                                        textAlign: "center",
                                        verticalAlign: "middle",
                                    }}
                                >
                                    <button
                                        onClick={() => onEdit(prod)}
                                        style={{
                                            marginRight: 8,
                                            background: "#fff",
                                            color: "#FF9800",
                                            border: "none",
                                            borderRadius: 5,
                                            padding: "5px 8px",
                                            fontSize: 16,
                                            cursor: "pointer",
                                        }}
                                        title="Editar producto"
                                    >
                                        <i className="fas fa-edit"></i>
                                    </button>
                                    <button
                                        onClick={() => handleDelete(prod.id)}
                                        style={{
                                            background: "#fff",
                                            color: "#B71C1C",
                                            border: "none",
                                            borderRadius: 5,
                                            padding: "5px 8px",
                                            fontSize: 16,
                                            cursor: "pointer",
                                        }}
                                        title="Eliminar producto"
                                    >
                                        <i className="fas fa-trash-alt"></i>
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {/* PAGINACIÓN */}
            <div style={{ width: "100%", marginTop: 20 }}>
                <span
                    style={{
                        color: "#000000",
                        display: "block",
                        marginBottom: 8,
                        textAlign: "center",
                    }}
                >
                    Mostrando {pagina.length} de {listaFiltrada.length}
                </span>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: 4,
                    }}
                >
                    {Array.from({ length: totalPaginas }, (_, i) => (
                        <button
                            key={i}
                            onClick={() => setPaginaActual(i + 1)}
                            style={{
                                margin: "0 2px",
                                padding: "6px 12px",
                                borderRadius: 6,
                                background:
                                    paginaActual === i + 1 ? "#5EA743" : "#444",
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
