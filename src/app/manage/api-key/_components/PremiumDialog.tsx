'use client';

import { Dialog } from "@headlessui/react";
import { ArrowPathIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import useSWR from "swr";

const stripePromise = loadStripe('pk_live_51NRFvmDju7hY58JXcc2QF9TfIzvsZLRCP8zVTPEIWn5CbrivwzFPu4eFE8HaCLsF8am73H6axCa87pPs68C7sSXy00mfa9sQ8s');
const fetcher = async () => {
    const res = await fetch("/api/embedded-checkout", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ priceId: "price_1P1i0ADju7hY58JXekQ3iDre" }),
    });
    const data = await res.json();
    return data.client_secret;
};

export default function PremiumDialog({
    dialogOpen,
    setDialogOpen
}: {
    dialogOpen: boolean;
    setDialogOpen: (open: boolean) => void;
}) {
    const { data: clientSecret, error } = useSWR("/api/embedded-checkout", fetcher);

    if (error) {
        return <span>Failed to load client secret</span>;
    }

    const options = {
        clientSecret: clientSecret,
    };

    return (
        <Dialog open={dialogOpen} onClose={setDialogOpen} className='fixed inset-0 flex items-center justify-center z-50 px-4'>
            <Dialog.Overlay className='fixed inset-0 bg-black opacity-30' />
            <div className='space-y-4 relative bg-neutral-800 rounded-lg px-6 py-4 shadow-lg'>
                <div className='flex space-x-4 justify-between items-center'>
                    <Dialog.Title className='text-2xl font-bold'>Buy Premium</Dialog.Title>
                    <button onClick={() => setDialogOpen(false)} className='p-2 text-gray-400 hover:text-gray-200'>
                        <XMarkIcon className='size-6' />
                    </button>
                </div>

                <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
                    <EmbeddedCheckout className='rounded-lg bg-white p-2 shadow-lg' />
                </EmbeddedCheckoutProvider>
            </div>
        </Dialog>
    );
}