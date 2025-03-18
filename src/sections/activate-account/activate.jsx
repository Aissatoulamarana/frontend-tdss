"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { paths } from "src/routes/paths";
import API from "src/utils/api";
import axios from "src/utils/axios";

const Activate = ({ uid, token }) => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!uid || !token) {
            setError("UUID ou Token manquant.");
            setLoading(false);
            return;
        }

        console.log("🔄 Envoi des données :", { uid, token }); // Debugging

        axios
            .post(
                API.activateAccount(),
                { uid, token },
                { headers: { "Content-Type": "application/json" } }
            )
            .then(() => {
                console.log("✅ Activation réussie, redirection...");
                // 🔄 Redirige vers la connexion avec un message de succès
                router.push(`${paths.auth.jwt.signIn}?activated=true`);
            })
            .catch((err) => {
                console.error("❌ Erreur API :", err.response?.data || err.message);
                setError("Une erreur est survenue lors de l'activation.");
            })
            .finally(() => setLoading(false));
    }, [uid, token, router]);

    return (
        <div style={{ textAlign: "center", marginTop: "2rem" }}>
            {loading ? (
                <p>Activation en cours...</p>
            ) : error ? (
                <p style={{ color: "red" }}>{error}</p>
            ) : (
                <p style={{ color: "green" }}>✅ Votre compte a été activé avec succès !</p>
            )}
        </div>
    );
};

export default Activate;
