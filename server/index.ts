import { PrismaClient } from './generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import jwt from 'jsonwebtoken';

// Pobieramy bezpiecznie link do bazy i sekret z pliku .env
const connectionString = process.env.DATABASE_URL!;
const JWT_SECRET = process.env.JWT_SECRET!;

// Prisma 7 wymaga utworzenia adaptera z linkiem do bazy
const adapter = new PrismaPg({ connectionString });

// Tworzymy klienta bazy danych, wstrzykując do niego adapter
const prisma = new PrismaClient({ adapter });

const server = Bun.serve({
  port: 3000,
  async fetch(req) {
    const url = new URL(req.url);
    
    // Nagłówki CORS (żeby przeglądarka i React nie blokowały zapytań)
    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization", 
    };

    // Obsługa zapytań próbnych z przeglądarki (Preflight)
    if (req.method === "OPTIONS") {
      return new Response(null, { headers });
    }

    // 1. REJESTRACJA
    if (req.method === "POST" && url.pathname === "/api/auth/register") {
      try {
       const { email, name, phone, password } = (await req.json()) as any;

        // Sprawdzamy, czy użytkownik już istnieje
        const istniejacyUser = await prisma.user.findUnique({ where: { email } });
        if (istniejacyUser) {
          return new Response(JSON.stringify({ error: "Taki email jest już w bazie!" }), { 
            status: 400, headers: { ...headers, "Content-Type": "application/json" } 
          });
        }

        // Haszowanie hasła (Bun natywnie)
        const zahaszowaneHaslo = await Bun.password.hash(password);
        
        // Zapis do bazy
        const nowyUser = await prisma.user.create({
          data: {
            email,
            name,
            phone, 
            password: zahaszowaneHaslo
          }
        });

        return new Response(JSON.stringify({ 
          message: "Rejestracja udana!", userId: nowyUser.id 
        }), { status: 201, headers: { ...headers, "Content-Type": "application/json" } });
        
      } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: "Błąd serwera" }), { status: 500, headers });
      }
    }

    // 2. LOGOWANIE
    if (req.method === "POST" && url.pathname === "/api/auth/login") {
      try {
        const { email, password } = (await req.json()) as any;

        // Szukamy użytkownika
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
          return new Response(JSON.stringify({ error: "Nieprawidłowy email lub hasło" }), { 
            status: 401, headers: { ...headers, "Content-Type": "application/json" } 
          });
        }

        // Weryfikujemy hasło (Bun sam porównuje z hashem w bazie)
        const czyHasloPoprawne = await Bun.password.verify(password, user.password);
        if (!czyHasloPoprawne) {
          return new Response(JSON.stringify({ error: "Nieprawidłowy email lub hasło" }), { 
            status: 401, headers: { ...headers, "Content-Type": "application/json" } 
          });
        }

        // Generujemy Token JWT na 7 dni
        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

        return new Response(JSON.stringify({ 
          message: "Zalogowano pomyślnie!",
          token: token,
          user: { id: user.id, name: user.name, email: user.email }
        }), { status: 200, headers: { ...headers, "Content-Type": "application/json" } });
        
      } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: "Błąd serwera" }), { status: 500, headers });
      }
    }

    // 3. WYLOGOWANIE
    if (req.method === "POST" && url.pathname === "/api/auth/logout") {
       return new Response(JSON.stringify({ 
         message: "Wylogowano pomyślnie. Usuń token po stronie klienta." 
       }), { status: 200, headers: { ...headers, "Content-Type": "application/json" } });
    }


    if (req.method === "GET" && url.pathname === "/") {
      return new Response(JSON.stringify({ 
        message: "API Platformy działa poprawnie! Baza danych zsynchronizowana.",
        status: "OK"
      }), { 
        headers: { ...headers, "Content-Type": "application/json" }
      });
    }

    // Zwróć 404, jeśli ktoś wpisze zły adres w API
    return new Response("Nie znaleziono ścieżki", { status: 404, headers });
  },
});

console.log(`Serwer działa na porcie http://localhost:${server.port}`);