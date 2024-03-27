import { TrashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function Page() {
	return (
		<section className='container space-y-4 mt-4 mb-16 max-w-screen-md'>
			<h1 className='font-bold text-3xl mb-4'>Privacy Policy</h1>
			<p>Last Updated: 16/01/2024</p>
			<p>At Eve&#39;s Games, SP, the operator of RoLinker, we highly value the privacy of our users. This Privacy Policy outlines the collection, usage, and sharing of personal information gathered from users of the RoLinker service. By accessing or utilizing the RoLinker service, you explicitly acknowledge that you have reviewed, comprehended, and accepted the terms of this Privacy Policy. If you disagree with any part of this policy, you are not authorized to access or use the RoLinker service. Should you have any inquiries or concerns, please feel free to reach out to us.</p>
			<hr/>
			<h2 className="text-2xl font-semibold">Information Collection</h2>
			<p>RoLinker collects minimal user data necessary for providing our linking services.</p>
			<p>We collect the following information from users:</p>
			<ul className='list-disc list-inside'>
				<li>The IDs of the Roblox accounts being linked</li>
				<li>The Roblox groups of all the linked Roblox accounts</li>
				<li>The ID/Profile of the signed-in Discord account (Accessed whilst signed-in)</li>
				<li>The Discord servers of the signed-in Discord account (Accessed whilst signed-in)</li>
			</ul>
			<h3 className="text-xl font-semibold">Deletion of personal information</h3>
			<p>Users can delete specific components of their personal information at any time during usage of this service.</p>
			<p>We provide these methods to remove specific pieces of personal information:</p>
			<h4 className='font-semibold'>Roblox Accounts</h4>
			<ul className='list-disc list-inside'>
				<li>Navigate to the <Link className='text-blue-500 hover:underline' href='/manage/accounts'>manage accounts page</Link></li>
				<li>Click <TrashIcon className='size-5 stroke-red-500 inline-block' /> next to the intended Roblox account</li>
			</ul>
			<h4 className='font-semibold'>Roblox Groups</h4>
			<ul className='list-disc list-inside'>
				<li>Navigate to the <Link className='text-blue-500 hover:underline' href='/manage/guilds'>manage guilds page</Link></li>
				<li>Click on whichever Discord guild has intended the Roblox group linked too it</li>
				<li>Open the group options disclosure</li>
				<li>Select &#39;none&#39; from the Roblox group listbox</li>
			</ul>
			<h4 className='font-semibold'>Discord Guilds</h4>
			<ul className='list-disc list-inside'>
				<li>Kick RoLinker bot from the intended Discord server(s)</li>
			</ul>
			<h4 className='font-semibold'>Discord Account</h4>
			<ul className='list-disc list-inside'>
				<li>Assure all Roblox accounts, groups, and Discord guilds linked to the intended Discord account have been deleted</li>
				<li>Sign-out of this website</li>
			</ul>
			<p>By deleting all pieces of information, all personal information about you is deleted.</p>
			<hr/>
			<h2 className="text-2xl font-semibold">Use of Information</h2>
			<p>The collected information is solely used for the purpose of linking your Discord and Roblox accounts and groups/guilds. It helps us ensure secure and efficient account linking.</p>
			<hr/>
			<h2 className="text-2xl font-semibold">Data Security</h2>
			<p>We implement robust security measures to protect your data from unauthorized access, alteration, or destruction. Our commitment to data security is unwavering, and we continuously update our security practices to safeguard your information.</p>
			<hr/>
			<h2 className="text-2xl font-semibold">Changes to This Policy</h2>
			<p>We may update this Privacy Policy from time to time. Updates will be posted in the <Link className='text-blue-500 hover:underline' href='https://discord.gg/CJDuGzwFX4'>Discord support server</Link>, we encourage you to review it periodically. Your continued use of RoLinker after any changes signifies your acceptance of our updated policy.</p>
		</section>
	);
}
