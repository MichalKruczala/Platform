const server = Bun.serve({
  port: 3000,
  async fetch(req) {
    const url = new URL(req.url);
    
    // Konfiguracja CORS - pozwala Reactowi na komunikację z serwerem
    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    // Przeglądarka najpierw pyta, czy może wysłać POST (tzw. preflight request)
    if (req.method === "OPTIONS") {
      return new Response(null, { headers });
    }

    // 1. Zwykłe pobranie danych (GET)
    if (req.method === "GET" && url.pathname === "/") {
      return new Response(JSON.stringify({ message: "Cześć z serwera Bun na Macu!" }), { 
        headers: { ...headers, "Content-Type": "application/json" }
      });
    }

    // 2. Odbieranie danych od Reacta (POST)
    if (req.method === "POST" && url.pathname === "/api/wiadomosc") {
      const body = await req.json(); // Pobieramy to, co wysłał React
      console.log("Serwer otrzymał dane:", body); // To wyświetli się w terminalu VS Code
      
      return new Response(JSON.stringify({ 
        odpowiedz: `Serwer odebrał Twoją wiadomość: "${body.mojTekst}"! 🎉` 
      }), { 
        headers: { ...headers, "Content-Type": "application/json" }
      });
    }

    // Jeśli zapytanie trafi w złe miejsce
    return new Response("Nie znaleziono", { status: 404, headers });
  },
});

console.log(`Serwer działa na porcie http://localhost:${server.port}`);