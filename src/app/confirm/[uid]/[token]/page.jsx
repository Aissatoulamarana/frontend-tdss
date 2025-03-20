"use client";

import { useParams } from "next/navigation";
import Activate from "src/sections/activate-account/activate";

const ConfirmPage = () => {
    const { uid, token } = useParams();


    return <Activate uid={uid} token={token} />;
};

export default ConfirmPage;
