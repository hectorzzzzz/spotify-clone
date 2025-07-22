"use client"

import { useState, useEffect } from "react";
import AuthModal from "@/components/AuthModal";
import UploadModal from "@/components/UploadModal";
import SubscribeModal from "@/components/SubscribeModal";
import { ProductWithPrice } from "@/types";
import PlaylistModal from "@/components/PlaylistModal"
import DropDownModal from "@/components/DropdownModal";


interface ModalProviderProps {
    products: ProductWithPrice[];
}

const ModalProvider: React.FC<ModalProviderProps> = ({
    products
}) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect (() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <>
            <DropDownModal />
            <PlaylistModal />
            <AuthModal />
            <UploadModal />
            <SubscribeModal products={products}/>
        </>
    );
}

export default ModalProvider;