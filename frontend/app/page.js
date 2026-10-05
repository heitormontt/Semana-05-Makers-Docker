"use client";
import { useState, useEffect } from 'react';
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

// Chaves forçadas (ignora o .env para evitar erros de cache)
const firebaseConfig = {
  apiKey: "AIzaSyAUrWZao8M5MMqO2TZBW-tx27gNvGG8rNI",
  authDomain: "semana-06-heitor.firebaseapp.com",
  projectId: "semana-06-heitor",
  storageBucket: "semana-06-heitor.firebasestorage.app",
  messagingSenderId: "640045858452",
  appId: "1:640045858452:web:5086973ae7428ceab5fe81"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export default function Home() {
  const [data, setData] = useState(null);
  const [debug, setDebug] = useState("A ligar à base de dados...");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "items"));
        const itemsArray = [];
        querySnapshot.forEach((doc) => {
          itemsArray.push(doc.data());
        });
        
        setDebug(`Sucesso! Encontrou ${itemsArray.length} itens na nuvem.`);
        setData({ items: itemsArray });
      } catch (err) {
        setDebug("ERRO DO FIREBASE: " + err.message);
        setData({ items: [] });
      }
    };
    fetchData();
  }, []);

  if (!data) return <div style={{ padding: '2rem' }}>A carregar... <br/>Status: {debug}</div>;

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Itens da Semana 5</h1>
      <p style={{ color: 'blue', fontWeight: 'bold' }}>Diagnóstico: {debug}</p>
      <ul>
        {data.items.length === 0 && <li style={{ color: 'red' }}>A coleção foi lida, mas não tem nenhum documento chamado "items" com dados.</li>}
        
        {data.items.map((item, idx) => (
          <li key={idx}>{item.nome ? item.nome : "⚠️️ Item encontrado, mas sem o campo 'nome'!"}</li>
        ))}
      </ul>
    </div>
  );
}