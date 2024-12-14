"use client";

import NextLink from "next/dist/client/link";

import { Chip } from "@nextui-org/chip";

import type { TagWithNewsletters } from "@/types/newsletter";

import { NewsletterGrid } from "../components/tags/tag-grid";

export function TagSectionClient({ tag }: { tag: TagWithNewsletters }) {
  return (
    <section className="border-b border-gray-200 pb-12 last:border-0">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{tag.name}</h2>
        <NextLink href={`/tag/${encodeURIComponent(tag.slug)}`}>
          <Chip variant="solid" color="warning" className="cursor-pointer">
            {tag.count ?? 0} Newsletters
          </Chip>
        </NextLink>
      </div>

      <NewsletterGrid newsletters={tag.Newsletters.map(nt => nt.Newsletter)} />

      <div className="mt-6 text-center">
        <NextLink
          href={`/tag/${encodeURIComponent(tag.slug)}`}
          className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          View all {tag.count ?? 0} newsletters in {tag.name} →
        </NextLink>
      </div>
    </section>
  );
}