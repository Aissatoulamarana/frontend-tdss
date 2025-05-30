import React, { useState } from 'react';

export function Image() {
  // État pour stocker l'image sélectionnée
  const [image, setImage] = useState(null);

  // Fonction pour gérer le changement de fichier
  const handleImageChange = (event) => {
    const file = event.target.files[0]; // Récupère le premier fichier sélectionné
    if (file) {
      const reader = new FileReader();

      // Lire l'image en tant qu'URL de données
      reader.onloadend = () => {
        setImage(reader.result); // Met à jour l'état avec l'URL de l'image
      };

      // Lire le fichier en tant qu'URL de données
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <h1>Uploader une image</h1>

      {/* Formulaire pour télécharger une image */}
      <input type="file" accept="image/*" onChange={handleImageChange} />

      {/* Afficher l'image si elle est sélectionnée */}
      {image && <img src={image} alt="Uploaded Preview" width="300" />}
    </div>
  );
}
