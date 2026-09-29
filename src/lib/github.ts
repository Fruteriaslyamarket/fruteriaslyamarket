// Cliente de los endpoints del servidor (/api/*). El token de GitHub vive solo
// en el servidor; el navegador nunca lo ve. Se autentica enviando la contraseña
// del admin en la cabecera x-admin-password sobre HTTPS.

async function post(path: string, password: string, body: unknown) {
  const res = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-admin-password": password },
    body: JSON.stringify(body),
  });
  const data = (await res.json().catch(() => ({}))) as { error?: string; url?: string };
  if (!res.ok) throw new Error(data.error || `Error ${res.status}`);
  return data;
}

export async function adminLogin(password: string): Promise<void> {
  const res = await fetch("/api/admin-login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });
  const data = (await res.json().catch(() => ({}))) as { error?: string };
  if (!res.ok) throw new Error(data.error || "Error al iniciar sesión");
}

export async function saveProducts(products: unknown, password: string): Promise<void> {
  await post("/api/save-products", password, { products });
}

export async function triggerRedeploy(password: string): Promise<void> {
  await post("/api/redeploy", password, {});
}

export async function uploadImage(file: File, password: string): Promise<string> {
  const base64 = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
  const ext = file.name.split(".").pop() || "jpg";
  const { url } = await post("/api/upload-image", password, { base64, ext });
  if (!url) throw new Error("El servidor no devolvió la URL de la imagen");
  return url;
}
