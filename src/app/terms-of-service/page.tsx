import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
};

export default function Page() {
  return (
    <section className="container prose max-w-screen-md">
      <h1>Terms of Service</h1>
      <p className="lead">Last Updated: 27/03/2024</p>
      <p>
        These Terms of Service (&quot;Terms&quot;) govern your access to and use
        of the RoLinker service provided by Eve&apos;s Games, SP
        (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;). By accessing or
        using our service, you agree to be bound by these Terms. If you disagree
        with any part of these terms, please do not use our service.
      </p>
      <h2>1. Introduction</h2>
      <p>
        RoLinker is a service that allows users to link their Discord and Roblox
        accounts and groups/guilds. By using RoLinker, you agree to these Terms
        and our Privacy Policy.
      </p>
      <h2>2. Use of Service</h2>
      <p>
        RoLinker provides an account linking service between Discord and Roblox.
        The service is intended for personal, non-commercial use. You agree to
        use the service only for lawful purposes and in accordance with these
        Terms.
      </p>
      <h2>3. User Responsibilities</h2>
      <p>
        You are responsible for maintaining the confidentiality of your account
        and password and for restricting access to your computer. You agree to
        accept responsibility for all activities that occur under your account
        or password.
      </p>
      <h2>4. Service Availability</h2>
      <p>
        We strive to ensure the availability of the service but do not guarantee
        uninterrupted service. Maintenance and updates may occasionally disrupt
        service availability. We reserve the right to modify, suspend, or
        discontinue the service at any time without notice.
      </p>
      <h2>5. Privacy Policy</h2>
      <p>
        Our Privacy Policy, which details how we handle user data, is available{" "}
        <Link href="/privacy-policy" className="link link-primary">
          here
        </Link>
        . By using RoLinker, you consent to the collection and use of your
        information as described in our Privacy Policy.
      </p>
      <h2>6. Changes to Terms</h2>
      <p>
        We reserve the right to modify these terms at any time. We will notify
        users of material changes by posting a notice on our website or sending
        an email. Your continued use of the service following any changes
        constitutes acceptance of the new terms.
      </p>
      <h2>7. Limitation of Liability</h2>
      <p>
        In no event shall RoLinker or its affiliates be liable for any direct,
        indirect, incidental, special, consequential or exemplary damages,
        including but not limited to, damages for loss of profits, goodwill,
        use, data or other intangible losses, resulting from your access to or
        use of or inability to access or use the service.
      </p>
      <h2>8. Governing Law</h2>
      <p>
        These Terms and Conditions are governed by the laws of Queensland,
        Australia, without regard to its conflict of law provisions. Any
        disputes arising in connection with these terms will be subject to the
        exclusive jurisdiction of the courts of Queensland, Australia.
      </p>
    </section>
  );
}
