
export function formatTimeAmPm(time) {
    if (!time) return "";
    // time viene como "HH:MM"
    const [h, m] = time.split(":").map(Number);
    const ampm = h >= 12 ? "PM" : "AM";
    const hora12 = h % 12 === 0 ? 12 : h % 12;
    // el retorno es algo como "9:00 AM"
    return `${hora12}:${m.toString().padStart(2, "0")} ${ampm}`;
}

export function convertDateToTimeAmPm(date) {
    if (!date) return "";
    // horaStr puede venir como "2025-08-18 09:00:00" o "2025-08-18T09:00:00"
    const match = date.match(/(\d{2}):(\d{2})(?::\d{2})?/);
    if (!match) return date;
    let h = parseInt(match[1], 10);
    let m = match[2];
    const ampm = h >= 12 ? "PM" : "AM";
    const hora12 = h % 12 === 0 ? 12 : h % 12;
    // el retorno es algo como "9:00 AM"
    return `${hora12}:${m} ${ampm}`;
}

export function formatoFechaHoraAmPm(fechaStr) {
    if (!fechaStr) return "—";
    // fechaStr puede venir como "2025-08-18 09:00:00" o "2025-08-18T09:00:00"
    const fecha = new Date(fechaStr);
    const fechaLocal = fecha.toLocaleDateString();
    let horas = fecha.getHours();
    const minutos = fecha.getMinutes().toString().padStart(2, "0");
    const ampm = horas >= 12 ? "PM" : "AM";
    horas = horas % 12 || 12;
    // el retorno es algo como "18/8/2025 9:00 AM"
    return `${fechaLocal} ${horas}:${minutos} ${ampm}`;
}

export function formatoHoraAmPm(fechaStr) {
    if (!fechaStr) return "—";
    // fechaStr puede venir como "2025-08-18 09:00:00" o "2025-08-18T09:00:00"
    const fecha = new Date(fechaStr);
    let horas = fecha.getHours();
    const minutos = fecha.getMinutes().toString().padStart(2, "0");
    const ampm = horas >= 12 ? "PM" : "AM";
    horas = horas % 12 || 12;
    // el retorno es algo como "9:00 AM"
    return `${horas}:${minutos} ${ampm}`;
}

export function formatoFecha(fechaStr) {
    if (!fechaStr) return "—";
    // fechaStr puede venir como "2025-08-18 09:00:00" o "2025-08-18T09:00:00"
    const fecha = new Date(fechaStr);
    // el retorno es algo como "18/8/2025"
    return fecha.toLocaleDateString();
}

export function formatDateTimeLocal(fecha, hora) {
    if (!fecha) return "—";
    // fecha es un objeto Date y hora es una cadena "HH:MM"
    const fechaStr = fecha.toISOString().split("T")[0];
    // el retorno es algo como "2025-08-18T09:00"
    return `${fechaStr}T${hora}`;
}

export function dateFormat(date) {
    if (!date) return "—";
    return date.toISOString().split("T")[0]; // "2025-08-18"
}