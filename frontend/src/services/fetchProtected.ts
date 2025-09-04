export async function fetchProtected(endpoint: string) {
  const token = localStorage.getItem("token");
  const res = await fetch(`http://localhost:8080/api/${endpoint}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("인증 실패");
  return res.json();
}