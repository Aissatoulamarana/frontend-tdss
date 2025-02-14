// /src/app/dashboard/user/[id]/page.jsx

import React from 'react';
import API from 'src/utils/api';

// Fonction pour récupérer les données de l'utilisateur
async function getUserData(id) {
  const res = await fetch(API.userDetails(id), { cache: "no-store" });

  if (!res.ok) {
    return null; // Gérer les erreurs de récupération
  }

  return res.json();
}

export default async function UserDetails({ params }) {
  const { id } = params;
  const user = await getUserData(id);

  if (!user) return <p>Utilisateur introuvable</p>;

  return (
    <div>
      <h1>User Details</h1>
      <p><strong>Username:</strong> {user.username}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Phone Number:</strong> {user.phone_number}</p>
      <p><strong>Role:</strong> {user.role}</p>
    </div>
  );
}
