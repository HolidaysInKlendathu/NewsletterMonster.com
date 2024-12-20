// app/[brandname]/[newsletterId]/page.tsx
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";

import EmailContent from "@/app/components/brand/newsletter/email-content";
import EmailHeader from "@/app/components/brand/newsletter/email-header";
import EmailToolbar from "@/app/components/brand/newsletter/email-toolbar";
import ThreeColumnLayout from "@/app/components/layouts/three-column-layout";
import prisma from "@/lib/prisma";

import {
  NewsletterStructuredData,
  generateNewsletterMetadata,
} from "../../../components/brand/seo/newsletter-detail-seo";

// Type definitions
type NewsletterDetail = {
  newsletter_id: number;
  user_id: string | null;
  sender: string | null;
  published_at: Date | null;
  subject: string | null;
  html_file_url: string | null;
  full_screenshot_url: string | null;
  top_screenshot_url: string | null;
  likes_count: number | null;
  you_rocks_count: number | null;
  created_at: Date | null;
  products_link: string | null;
  summary: string | null;
  NewsletterTag: {
    Tag: {
      id: number;
      name: string;
    };
  }[];
};

// Helper function to format brand name
function formatBrandName(brandname: string): string {
  return brandname
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// Data fetching function
async function getNewsletter(newsletterId: string): Promise<NewsletterDetail | null> {
  if (!newsletterId || isNaN(Number(newsletterId))) {
    console.error("Invalid newsletter ID:", newsletterId);
    return null;
  }

  try {
    const newsletter = await prisma.newsletter.findUnique({
      where: {
        newsletter_id: parseInt(newsletterId),
      },
      select: {
        newsletter_id: true,
        user_id: true,
        sender: true,
        published_at: true,
        subject: true,
        html_file_url: true,
        full_screenshot_url: true,
        top_screenshot_url: true,
        likes_count: true,
        you_rocks_count: true,
        created_at: true,
        products_link: true,
        summary: true,
        NewsletterTag: {
          select: {
            Tag: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    return newsletter;
  } catch (error) {
    console.error("Error fetching newsletter:", error);
    return null;
  }
}

// Metadata generation
export async function generateMetadata({
  params,
}: {
  params: { brandname: string; newsletterId: string };
}): Promise<Metadata> {
  const newsletter = await getNewsletter(params.newsletterId);
  if (!newsletter) return notFound();

  const brandDisplayName = formatBrandName(params.brandname);
  const currentUrl = `https://newslettermonster.com/${params.brandname}/${params.newsletterId}`;

  return generateNewsletterMetadata({
    newsletter,
    brandname: params.brandname,
    brandDisplayName,
    currentUrl,
  });
}

// Main page component
export default async function NewsletterPage({
  params,
}: {
  params: { brandname: string; newsletterId: string };
}) {
  const newsletter = await getNewsletter(params.newsletterId);
  if (!newsletter) notFound();

  const brandDisplayName = formatBrandName(params.brandname);
  const currentUrl = `https://newslettermonster.com/${params.brandname}/${params.newsletterId}`;

  // Generate structured data
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://newslettermonster.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: brandDisplayName,
        item: `https://newslettermonster.com/${params.brandname}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: newsletter.subject || "Newsletter",
        item: currentUrl,
      },
    ],
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: brandDisplayName,
    url: `https://newslettermonster.com/${params.brandname}`,
    sameAs: [`https://newslettermonster.com/${params.brandname}`],
  };

  return (
    <>
      {/* SEO Structured Data */}
      <NewsletterStructuredData
        newsletter={newsletter}
        brandname={params.brandname}
        brandDisplayName={brandDisplayName}
        currentUrl={currentUrl}
      />

      {/* Additional Schema.org structured data */}
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Script
        id="organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />

      <ThreeColumnLayout>
        {/* Main content with email-like interface */}
        <article
          className="mx-auto w-full max-w-4xl overflow-hidden rounded-lg border shadow-sm"
          itemScope
          itemType="https://schema.org/Article"
        >
          {/* Email header */}
          <EmailHeader
            subject={newsletter.subject}
            sender={newsletter.sender}
            brandname={params.brandname}
            date={newsletter.created_at}
          />

          {/* Email toolbar */}
          <EmailToolbar
            likesCount={newsletter.likes_count || 0}
            isLiked={false}
            currentUrl={currentUrl}
            subject={newsletter.subject}
            summary={newsletter.summary}
          />

          {/* Email content */}
          <EmailContent
            summary={newsletter.summary}
            fullScreenshotUrl={newsletter.full_screenshot_url}
            htmlFileUrl={newsletter.html_file_url}
            subject={newsletter.subject}
            tags={newsletter.NewsletterTag}
            productsLink={newsletter.products_link}
          />

          {/* SEO metadata */}
          <meta itemProp="datePublished" content={newsletter.created_at?.toISOString()} />
          <meta itemProp="publisher" content="NewsletterMonster" />
          <meta itemProp="author" content={brandDisplayName} />
          {newsletter.summary && <meta itemProp="description" content={newsletter.summary} />}
        </article>
      </ThreeColumnLayout>
    </>
  );
}
