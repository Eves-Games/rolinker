import React from 'react';
import { Dialog, Listbox } from '@headlessui/react';
import { Guild } from '@prisma/client/edge';
import { CheckIcon, ChevronUpDownIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { generateApiKey } from '../actions';
import { mutate } from 'swr';

interface CreateApiKeyDialogProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    guilds: Guild[];
    apiGuilds: Guild[];
    selectedGuild: Guild | null;
    setSelectedGuild: (guild: Guild | null) => void;
};

export default function ViewKeyDialog({ isOpen, setIsOpen, guilds, apiGuilds, selectedGuild, setSelectedGuild }: CreateApiKeyDialogProps) {
    return (
        <Dialog open={isOpen} onClose={() => setIsOpen(false)} className='fixed inset-0 flex items-center justify-center z-50 px-4'>
          <Dialog.Overlay className='fixed inset-0 bg-black opacity-30' />
          <div className='space-y-4 relative bg-neutral-800 rounded-lg max-w-lg w-fit mx-auto px-6 py-4 shadow-lg'>
            <div className='flex space-x-4 justify-between items-center'>
              <Dialog.Title className='text-2xl font-bold'>Create API Key</Dialog.Title>
              <button onClick={() => setIsOpen(false)} className='p-2 text-gray-400 hover:text-gray-200'>
                <XMarkIcon className='size-6' />
              </button>
            </div>
    
            <Dialog.Description>
              This will create an API key for the selected Discord guild.
            </Dialog.Description>
    
            <div className='space-y-2 relative'>
              <span>Discord Servers</span>
              <Listbox value={selectedGuild} onChange={setSelectedGuild}>
                <Listbox.Button className='w-full flex justify-between rounded-lg bg-neutral-700 hover:bg-neutral-600 py-2 px-4 shadow-lg'>
                  <span className='truncate'>{selectedGuild?.name}</span>
                  <ChevronUpDownIcon className='size-6' aria-hidden='true' />
                </Listbox.Button>
                <Listbox.Options className='absolute mt-2 max-h-60 w-full overflow-auto rounded-lg bg-neutral-700 shadow-lg'>
                  {guilds.filter(guild => !apiGuilds.some(apiGuild => apiGuild.id === guild.id)).map((guild, index) => (
                    <Listbox.Option as='button' key={index} className='flex items-center justify-between w-full gap-4 px-4 py-2 ui-active:bg-neutral-600 rounded-lg' value={guild}>
                      {({ selected }) => (
                        <>
                          <span className='block truncate'>{guild.name}</span>
                          {selected && <CheckIcon className='size-6' aria-hidden='true' />}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Listbox>
            </div>
    
            <p className='text-sm'>Please note that there is a daily limit of 750 uses for the API key. <span className='line-through'>If you require more, you can upgrade after key creation.</span></p>
            <p className='text-sm'>Refer to our <a href='/terms-of-service' className='text-blue-400 hover:underline'>Terms of Service</a> for more information.</p>
    
            <form onSubmit={async (e) => {
              e.preventDefault();
              setIsOpen(false);
              await generateApiKey(selectedGuild!.id);
              mutate(`/api/users/authenticated/guilds?includeApiKeys=true`);
            }}>
              <button className='bg-green-700 py-2 px-4 rounded-lg hover:bg-green-600'>
                Create Key
              </button>
            </form>
          </div>
        </Dialog>
      );
}