const API = "https://api.github.com";

export async function getFileSha(
  token: string,
  repo: string,
  path: string,
  branch = "main",
): Promise<string> {
  const res = await fetch(`${API}/repos/${repo}/contents/${path}?ref=${branch}`, {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json" },
  });
  if (!res.ok) throw new Error(`GitHub ${res.status}: no se pudo leer el archivo`);
  const data = await res.json();
  return data.sha as string;
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
