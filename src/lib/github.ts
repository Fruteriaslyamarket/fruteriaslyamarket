const API = "https://api.github.com";

export async function getFileSha(
  token: string,
  repo: string,
  path: string,
  branch = "main",
): Promise<string> {
  const res = await fetch(`${API}/repos/${repo}/contents/${path}?ref=${branch}&t=${Date.now()}`, {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json" },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`GitHub ${res.status}: no se pudo leer el archivo`);
  const data = await res.json();
  return data.sha as string;
}

export async function uploadImage(
  token: string,
  repo: string,
  file: File,
  branch = "main",
): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${ext}`;
  const path = `public/images/${filename}`;

  const base64 = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const res = await fetch(`${API}/repos/${repo}/contents/${path}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message: "admin: subir imagen", content: base64, branch }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`GitHub ${res.status}: ${(err as { message?: string }).message ?? "error al subir"}`);
  }
  return `https://raw.githubusercontent.com/${repo}/${branch}/${path}`;
}

export async function updateFile(
  token: string,
  repo: string,
  path: string,
  content: string,
  sha: string,
  message: string,
  branch = "main",
): Promise<void> {
  const encoded = btoa(unescape(encodeURIComponent(content)));
  const res = await fetch(`${API}/repos/${repo}/contents/${path}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message, content: encoded, sha, branch }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`GitHub ${res.status}: ${(err as { message?: string }).message ?? "error al guardar"}`);
  }
}
