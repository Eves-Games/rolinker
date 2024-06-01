import { RoLinkerLogo } from "@/app/_components/RoLinkerLogo";
import Link from "next/link";

export async function Footer() {
    return (
        <footer className="max-w-screen-lg container footer p-10 text-base-content">
            <aside>
                <RoLinkerLogo className="size-12" />
                <p>Eve&apos;s Games SP.<br /><i>Illustrating the Corruption of the Natural World.</i></p>
            </aside>
            <nav>
                <h6 className="footer-title">RoLinker</h6>
                <Link href='/' className="link link-hover">Home</Link>
                <Link href='/commands' className="link link-hover">Commands</Link>
                <Link href='https://docs.rolinker.net' className="link link-hover">Documentation</Link>
            </nav>
            <nav>
                <h6 className="footer-title">Company</h6>
                <Link href='https://eves.gg' className="link link-hover">Eve&apos;s Games</Link>
                <Link href='https://eves.gg' className="link link-hover">Careers and Commissions</Link>
            </nav>
            <nav>
                <h6 className="footer-title">Legal</h6>
                <Link href='/terms-of-service' className="link link-hover">Terms of Service</Link>
                <Link href='/privacy-policy' className="link link-hover">Privacy Policy</Link>
            </nav>
        </footer>
    )
}