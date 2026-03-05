import { useEffect, useState } from 'react';

function App() {
  // Stan dla danych z serwera
  const [serverMessage, setServerMessage] = useState<string>("Ładowanie danych z serwera...");

  // Nowe stany dla formularza
  const [inputText, setInputText] = useState<string>(""); // Przechowuje wpisywany tekst
  const [serverResponse, setServerResponse] = useState<string>(""); // Przechowuje odpowiedź po wysłaniu

  // Pobieranie początkowej wiadomości (GET)
  useEffect(() => {
    fetch('https://bun-backend-e2f2.onrender.com')
      .then((response) => response.json())
      .then((data) => setServerMessage(data.message))
      .catch(() => setServerMessage("Błąd połączenia z serwerem 😢"));
  }, []);

  // Funkcja wysyłająca dane do serwera (POST)
  const handleSendData = async () => {
    if (!inputText) return; // Nie wysyłaj, jeśli pole jest puste

    try {
      const response = await fetch('https://bun-backend-e2f2.onrender.com/api/wiadomosc', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Wysyłamy tekst w formacie JSON pod kluczem "mojTekst"
        body: JSON.stringify({ mojTekst: inputText }),
      });

      const data = await response.json();
      setServerResponse(data.odpowiedz); // Zapisujemy odpowiedź serwera
      setInputText(""); // Czyścimy pole tekstowe po wysłaniu
    } catch (error) {
      console.error("Błąd wysyłania:", error);
      setServerResponse("Nie udało się wysłać danych.");
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '50px', fontFamily: 'sans-serif' }}>
      <h1>Mój Fullstackowy Projekt 🚀</h1>

      {/* Sekcja GET */}
      <div style={{ margin: '20px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', maxWidth: '400px' }}>
        <h3>Wiadomość z backendu (GET):</h3>
        <p style={{ fontSize: '18px', color: '#007bff' }}>{serverMessage}</p>
      </div>

      {/* Sekcja POST */}
      <div style={{ margin: '20px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', maxWidth: '400px', backgroundColor: '#f9f9f9' }}>
        <h3>Wyślij coś do serwera (POST):</h3>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)} // Aktualizuje stan przy każdym naciśnięciu klawisza
          placeholder="Wpisz cokolwiek..."
          style={{ padding: '10px', width: '70%', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <button
          onClick={handleSendData}
          style={{ padding: '10px 15px', marginLeft: '10px', cursor: 'pointer', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          Wyślij
        </button>

        {/* Wyświetlanie odpowiedzi po wysłaniu */}
        {serverResponse && (
          <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#e2f0e5', border: '1px solid #28a745', borderRadius: '4px' }}>
            <strong>Odpowiedź:</strong> {serverResponse}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;