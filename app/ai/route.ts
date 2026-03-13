export async function POST(request: Request) {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiBaseUrl) {
    return new Response("NEXT_PUBLIC_API_URL nao configurada.", {
      status: 500,
    });
  }

  const body = await request.text();
  const requestHeaders = new Headers();

  request.headers.forEach((value, key) => {
    if (key === "host" || key === "content-length") {
      return;
    }

    requestHeaders.set(key, value);
  });

  const response = await fetch(`${apiBaseUrl}/ai`, {
    method: "POST",
    headers: requestHeaders,
    body,
  });

  return new Response(response.body, {
    status: response.status,
    headers: response.headers,
  });
}
