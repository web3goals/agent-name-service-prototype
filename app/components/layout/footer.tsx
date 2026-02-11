"use client";

import { appConfig } from "@/config/app";
import Link from "next/link";
import { Button } from "../ui/button";

export function Footer() {
  return (
    <footer className="bg-background border-t py-2 md:py-0">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 md:h-16">
        <p className="text-balance text-center md:text-left text-sm leading-loose text-muted-foreground">
          Built by
          <Link href={appConfig.developer.url} target="_blank">
            <Button variant="link" className="px-1 py-0">
              {appConfig.developer.name}
            </Button>
          </Link>
          © 2026
        </p>
      </div>
    </footer>
  );
}
