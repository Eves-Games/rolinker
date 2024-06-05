import RoLinker from "@/components/RoLinker.svg";
import Link from "next/link";
import Image from "next/image";

export async function Footer() {
  return (
    <footer className="container footer max-w-screen-lg p-10 text-base-content">
      <aside>
        <Image
          src={RoLinker}
          alt="RoLinker Logo"
          className="size-12"
          width={100}
          height={100}
        />
        <p>
          Eve&apos;s Games SP.
          <br />
          <i>Illustrating the Corruption of the Natural World.</i>
        </p>
      </aside>
      <nav>
        <h6 className="footer-title">RoLinker</h6>
        <Link href="/" className="link-hover link">
          Home
        </Link>
        <Link href="/commands" className="link-hover link">
          Commands
        </Link>
        <Link href="https://docs.rolinker.net" className="link-hover link">
          Documentation
        </Link>
      </nav>
      <nav>
        <h6 className="footer-title">Company</h6>
        <Link href="https://eves.gg" className="link-hover link">
          Eve&apos;s Games
        </Link>
        <Link href="https://eves.gg" className="link-hover link">
          Careers and Commissions
        </Link>
      </nav>
      <nav>
        <h6 className="footer-title">Legal</h6>
        <Link href="/terms-of-service" className="link-hover link">
          Terms of Service
        </Link>
        <Link href="/privacy-policy" className="link-hover link">
          Privacy Policy
        </Link>
      </nav>
    </footer>
  );
}
