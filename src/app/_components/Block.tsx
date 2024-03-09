import Link from "next/link";

export const Block: React.FC<{ href?: string, className?: string, children?: React.ReactNode }> = ({ href, className, children }) => {
    return href ? (
        <Link href={href} className={className + ' bg-neutral-800 rounded shadow-lg hover:bg-neutral-700'}>
            {children}
        </Link>
    ) : (
        <div className={className + ' bg-neutral-800 rounded shadow-lg'}>
            {children}
        </div>
    );
};

export default Block;