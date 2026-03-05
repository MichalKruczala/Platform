import { PrismaClient } from './generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

// Pobieramy bezpiecznie link do bazy z pliku .env (lub z ustawień Rendera)
const connectionString = process.env.DATABASE_URL!;

// Prisma 7 wymaga utworzenia adaptera z linkiem do bazy
const adapter = new PrismaPg({ connectionString });

// Tworzymy klienta bazy danych, wstrzykując do niego adapter
const prisma = new PrismaClient({ adapter });

const server = Bun.serve({
  port: 3000,
  async fetch(req) {
    const url = new URL(req.url);
    
    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (req.method === "OPTIONS") {
      return new Response(null, { headers });
    }

    // 1. POBIERANIE DANYCH Z BAZY (GET)
    if (req.method === "GET" && url.pathname === "/") {
      // Pobieramy wszystkie wiadomości z bazy (najnowsze na górze)
      const wszystkieWiadomosci = await prisma.message.findMany({
        orderBy: { createdAt: 'desc' }
      });
      
      return new Response(JSON.stringify({ 
        message: "Oto dane z bazy Neon!",
        wiadomosci: wszystkieWiadomosci
      }), { 
        headers: { ...headers, "Content-Type": "application/json" }
      });
    }

    // 2. ZAPISYWANIE DO BAZY (POST)
    if (req.method === "POST" && url.pathname === "/api/wiadomosc") {
      const body = await req.json(); 
      
      // Zapisujemy nową wiadomość w tabeli Message
      const nowaWiadomosc = await prisma.message.create({
        data: {
          text: body.mojTekst
        }
      });

      console.log("Zapisano w bazie:", nowaWiadomosc);
      
      return new Response(JSON.stringify({ 
        odpowiedz: `Sukces! Zapisano w bazie: "${nowaWiadomosc.text}" 🎉` 
      }), { 
        headers: { ...headers, "Content-Type": "application/json" }
      });
    }

    return new Response("Nie znaleziono", { status: 404, headers });
  },
});

console.log(`Serwer działa na porcie http://localhost:${server.port}`);