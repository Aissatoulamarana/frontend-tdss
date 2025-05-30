export const checkPassportExistence = async (passportNumber) => {
  try {
    const response = await fetch(`/api/check-passport?passportNumber=${passportNumber}`);
    const data = await response.json();
    return data.exists; // Renvoie vrai si le passeport existe, faux sinon
  } catch (error) {
    console.error('Erreur lors de la vérification du passeport', error);
    return false; // Si une erreur se produit, on suppose que le passeport n'existe pas
  }
};
