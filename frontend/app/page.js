"use client";
import { useState, useEffect } from 'react';

export default function Home() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Simula a chamada à API que seria feita ao backend da Semana 5
    fetch('/api/itens')
      .then((res) => {
        if (!res.ok) throw new Error('Falha na resposta da API');
        return res.json();
      })
      .then((json) => setData(json))
      .catch((err) => {
        console.error("Erro ao procurar dados:", err);
        // Ativa o estado de erro amigável exigido na Etapa 2
        setError(true);
      });
  }, []);

  // Exibição da mensagem amigável caso o backend não responda
  if (error) {
    return (
      <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
        <h1>Ops! Dados indisponíveis.</h1>
        <p>O nosso servidor está em manutenção. Tente novamente mais tarde.</p>
      </div>
    );
  }

  if (!data) return <div style={{ padding: '2rem' }}>A carregar...</div>;

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Itens da Semana 5</h1>
      <ul>
        {data.items?.map((item, idx) => <li key={idx}>{item.nome}</li>)}
      </ul>
    </div>
  );
}