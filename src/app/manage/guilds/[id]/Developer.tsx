'use client';
import { useEffect, useState } from "react";
import { ChartBarIcon, CodeBracketIcon, PencilIcon } from "@heroicons/react/24/outline";
import { regenerateApiKey } from "./actions";
import EditKeyDialog from "./_components/EditKeyDialog"
import ViewUsageDialog from "./_components/ViewUsageDialog";

export default function Developer({
    guildId,
    api
}: {
    guildId: string
    api: {
        apiKey: string | null
        apiKeyUsage: number
    },
}) {
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [usageDialogOpen, setUsageDialogOpen] = useState(false);

    return (
        <>
            <div className='bg-neutral-800 rounded shadow-lg w-full'>
                <div className='flex items-center space-x-4 px-4 py-2'>
                    <CodeBracketIcon className='size-6' />
                    <span>Developer API</span>
                </div>
                <div className='gap-4 grid grid-cols-1 md:grid-cols-2 py-2 px-4'>
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
            </div>

            <EditKeyDialog
                guildId={guildId}
                dialogOpen={editDialogOpen}
                setDialogOpen={setEditDialogOpen}
                api={api}
            />

            <ViewUsageDialog
                guildId={guildId}
                dialogOpen={usageDialogOpen}
                setDialogOpen={setUsageDialogOpen}
                api={api}
            />
        </>
    );
}