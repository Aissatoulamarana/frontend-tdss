"use client";

import { useParams } from "next/navigation";
import Activate from "src/sections/activate-account/activate";

const ConfirmPage = () => {
    const { uid, token } = useParams();

    console.log("UUID récupéré :", uid);  // Debug
    console.log("Token récupéré :", token); // Debug

    return <Activate uid={uid} token={token} />;
};

export default ConfirmPage;
