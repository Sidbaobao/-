import Link from "next/link";
import { ButtonHTMLAttributes, ReactNode } from "react";

type PrimaryButtonLinkProps = {
  href: string;
  children: ReactNode;
};

type PrimaryButtonButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
};

const sharedClassName =
  "inline-flex items-center justify-center rounded-full bg-slateBlue px-5 py-3 text-sm font-semibold text-white hover:bg-[#3f5ce0] disabled:cursor-not-allowed disabled:opacity-60";

export function PrimaryButtonLink({ href, children }: PrimaryButtonLinkProps) {
  return (
    <Link href={href} className={sharedClassName}>
      {children}
    </Link>
  );
}

export function PrimaryButton({ children, className = "", ...props }: PrimaryButtonButtonProps) {
  return (
    <button {...props} className={`${sharedClassName} ${className}`.trim()}>
      {children}
    </button>
  );
}
