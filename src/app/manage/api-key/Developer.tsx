'use client';
import { useState } from "react";
import { ArrowTopRightOnSquareIcon, ChartBarIcon, ChevronDoubleUpIcon, CodeBracketIcon, PencilIcon, Bars2Icon } from "@heroicons/react/24/outline";
import EditKeyDialog from "./_components/EditKeyDialog"
import ViewUsageDialog from "./_components/ViewUsageDialog";
import PremiumDialog from "./_components/PremiumDialog";
import Link from "next/link";

export default function Page({
    keyData
}: {
    keyData: {
        userId: string;
        key: string;
        usage: number;
        premium: boolean;
    }
}) {
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [usageDialogOpen, setUsageDialogOpen] = useState(false);
    const [premiumDialogOpen, setPremiumDialogOpen] = useState(false);

    return (
        <>
            <div className='bg-neutral-800 rounded shadow-lg w-full px-4 py-2 space-y-4'>
                <div className='flex items-center space-x-4'>
                    <CodeBracketIcon className='size-6' />
                    <span>Developer API</span>
                </div>
                <div className='gap-4 grid grid-cols-1 md:grid-cols-2'>
                    <div className='space-y-2'>
                        <span>Key Usage</span>
                        <button onClick={() => setUsageDialogOpen(true)} className='flex justify-between space-x-4 w-full bg-neutral-700 hover:bg-neutral-600 rounded-lg py-2 px-4 shadow-lg'>
                            <span className='truncate'>View Key Usage</span>
                            <ChartBarIcon className='size-6 flex-shrink-0' aria-hidden='true' />
                        </button>
                    </div>
                    <div className='space-y-2'>
                        <span>API Key</span>
                        <button onClick={() => setEditDialogOpen(true)} className='flex justify-between space-x-4 w-full bg-neutral-700 hover:bg-neutral-600 rounded-lg py-2 px-4 shadow-lg'>
                            <span className='truncate'>Edit API Key</span>
                            <PencilIcon className='size-6 flex-shrink-0' aria-hidden='true' />
                        </button>
                    </div>
                </div>
                <p className='text-center'><Link href='/documentation' className='text-blue-500 hover:underline' target='_blank'>Documentation <ArrowTopRightOnSquareIcon className="size-5 inline-block" /></Link></p>
            </div>

            <div className='bg-neutral-800 rounded shadow-lg w-full px-4 py-2 space-y-4'>
                <div className='flex items-center space-x-4'>
                    <ChartBarIcon className='size-6' />
                    <span>Usage Plan</span>
                </div>
                <div className='gap-4 grid grid-cols-1 md:grid-cols-2'>
                    <div className='space-y-2'>
                        <h2 className='text-xl font-semibold'>Premium Plan {keyData.premium && '(Current)'}</h2>
                        <ul className='list-disc list-inside'>
                            <li className='font-semibold text-green-500'>Unlimited Requests</li>
                            <li>Access all Endpoints</li>
                            <li>1-on-1 Support</li>
                        </ul>
                        <button onClick={() => setPremiumDialogOpen(true)} className={`flex justify-between space-x-4 bg-indigo-700 rounded-lg py-2 px-4 shadow-lg ${keyData.premium ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-600'}`} disabled={keyData.premium}>
                            <span className='truncate'>Select Premium</span>
                            <ChevronDoubleUpIcon className='size-6 flex-shrink-0' aria-hidden='true' />
                        </button>
                    </div>
                    <div className='space-y-2'>
                        <h2 className='text-xl font-semibold'>Free Plan {!keyData.premium && '(Current)'}</h2>
                        <ul className='list-disc list-inside'>
                            <li>750 Requests Daily</li>
                            <li>Access all Endpoints</li>
                            <li>1-on-1 Support</li>
                        </ul>
                        <button className={`flex justify-between space-x-4 bg-neutral-700 rounded-lg py-2 px-4 shadow-lg ${!keyData.premium ? 'opacity-50 cursor-not-allowed' : 'hover:bg-neutral-600'}`} disabled={!keyData.premium}>
                            <span className='truncate'>Select Free</span>
                            <Bars2Icon className='size-6 flex-shrink-0' aria-hidden='true' />
                        </button>
                    </div>
                </div>
            </div>

            <EditKeyDialog
                keyData={keyData}
                dialogOpen={editDialogOpen}
                setDialogOpen={setEditDialogOpen}
            />

            <ViewUsageDialog
                keyData={keyData}
                dialogOpen={usageDialogOpen}
                setDialogOpen={setUsageDialogOpen}
            />

            {!keyData.premium && <PremiumDialog dialogOpen={premiumDialogOpen} setDialogOpen={setPremiumDialogOpen} />}
        </>
    );
}