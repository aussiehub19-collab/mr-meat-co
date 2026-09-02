import { MetadataRoute } from 'next';
import {
  SITE,
  CATEGORIES,
  PRODUCTS,
  POSTS,
  WHOLESALE_BULK_SUBCATEGORIES,
  abs,
  subcategorySlug,
} from '@/config/site';

const subSlug = subcategorySlug;

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = `https://${SITE.domain}`;
  const now = new Date().toISOString();

  // Static core routes (checkout + search are transactional — not indexed)
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/shop/`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/christmas-ham/`, lastModified: now, changeFrequency: 'weekly', priority: 0.75 },
    { url: `${baseUrl}/wholesale/`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/wholesale/bulk-meat-orders/`, lastModified: now, changeFrequency: 'daily', priority: 0.85 },
    { url: `${baseUrl}/wholesale/contact-us/`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/blog/`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/about/`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/contact/`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/faq/`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
  ];

  // Wholesale bulk subcategories
  const wholesaleSubRoutes: MetadataRoute.Sitemap = WHOLESALE_BULK_SUBCATEGORIES.map((sub) => ({
    url: `${baseUrl}/wholesale/bulk-meat-orders/${sub.slug}/`,
    lastModified: now,
    changeFrequency: 'daily',
    priority: 0.8,
  }));

  // Category pages — the canonical /{slug}/ form (matches the nav + PAGE_SEO)
  const categoryRoutes: MetadataRoute.Sitemap = CATEGORIES.map((cat) => ({
    url: `${baseUrl}/${cat.slug}/`,
    lastModified: now,
    changeFrequency: 'daily',
    priority: cat.slug === 'live-poultry' ? 0.7 : 0.85,
  }));

  // Subcategory listing pages — /{cat}/{sub}/ (keyword-optimised, previously missing)
  const subcategoryRoutes: MetadataRoute.Sitemap = CATEGORIES.flatMap((cat) =>
    (cat.subcategories || []).map((sub) => ({
      url: `${baseUrl}/${cat.slug}/${subSlug(sub)}/`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
  );

  // Product pages with absolute image URLs
  const productRoutes: MetadataRoute.Sitemap = PRODUCTS.map((p) => {
    let url = `${baseUrl}/shop/${p.category}/${p.slug}/`;
    const cat = (p.main_category || p.category || '').toLowerCase();
    const sub = subSlug(p.subcategory || '');
    if (cat === 'wholesale') {
      url = `${baseUrl}/wholesale/bulk-meat-orders/${sub}/${p.slug}/`;
    } else if (cat === 'seafood') {
      url = `${baseUrl}/seafood/${sub}/${p.slug}/`;
    } else if (cat === 'pet-food') {
      url = `${baseUrl}/pet-food/${sub}/${p.slug}/`;
    }

    return {
      url,
      lastModified: now,
      changeFrequency: 'daily' as const,
      priority: 0.9,
      images: [abs(p.main_image || p.image)],
    };
  });

  // Blog post pages with absolute image URLs
  const blogRoutes: MetadataRoute.Sitemap = POSTS.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}/`,
    lastModified: post.date ? new Date(post.date).toISOString() : now,
    changeFrequency: 'weekly',
    priority: 0.75,
    images: [abs(post.image)],
  }));

  return [
    ...staticRoutes,
    ...wholesaleSubRoutes,
    ...categoryRoutes,
    ...subcategoryRoutes,
    ...productRoutes,
    ...blogRoutes,
  ];
}
