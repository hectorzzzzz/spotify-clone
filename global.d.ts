import type { SearchParams } from "next/dist/shared/lib/app-router-context";

declare module "next" {
  interface PageProps {
    searchParams?: Record<string, string | string[] | undefined>;
    params?: Record<string, string>;
  }
}