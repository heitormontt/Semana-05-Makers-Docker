"use client";
import { useState, useEffect } from 'react';
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator, collection, getDocs } from "firebase/firestore";

// A configuração pública não precisa de chaves reais para o emulador
const firebaseConfig = { projectId: "demo-semana6" };

// Inicializa o Firebase (evita duplicações no Next.js)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

// Conecta ao emulador se a variável estiver ativa
if (process.env.NEXT_PUBLIC_USE_EMULATOR === 'true') {
  try {
    connectFirestoreEmulator(db, '127.0.0.1', 8080);
  } catch (e) {
    // Ignora erro se já estiver ligado
  }
}

export default function Home() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (process.env.NEXT_PUBLIC_DATA_SOURCE === 'firestore') {
          // Busca os dados no Firestore Local (Etapa 3)
          const querySnapshot = await getDocs(collection(db, "items"));
          const itemsArray = [];
          querySnapshot.forEach((doc) => {
            itemsArray.push(doc.data());
          });
          // Mantém o mesmo formato JSON da API antiga da Semana 5
          setData({ status: "ok", items: itemsArray });
        } else {
          // Lógica Antiga da API (Etapa 2)
          const res = await fetch('/api/itens');
          if (!res.ok) throw new Error('Falha na resposta da API');
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
        setError(true);
      }
    };

    fetchData();
  }, []);

  if (error) {
    return (
      <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
        <h1>Ops! Dados indisponíveis.</h1>
        <p>O nosso servidor está em manutenção.</p>
      </div>
    );
  }

  if (!data) return <div style={{ padding: '2rem' }}>A carregar...</div>;

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Itens da Semana 5 (Via Firestore Local)</h1>
      <ul>
        {data.items?.map((item, idx) => <li key={idx}>{item.nome}</li>)}
      </ul>
    </div>
  );
}