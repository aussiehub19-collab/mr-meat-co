import { MetadataRoute } from 'next';
import { SITE, CATEGORIES, PRODUCTS, POSTS, WHOLESALE_BULK_SUBCATEGORIES } from '@/config/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = `https://${SITE.domain}`;
  const now = new Date().toISOString();

  // Static core routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/shop/`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/seafood/`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/pet-food/`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/live-poultry/`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/christmas-ham/`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.75,
    },
    {
      url: `${baseUrl}/wholesale/`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/wholesale/bulk-meat-orders/`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/wholesale/contact-us/`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog/`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about/`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/checkout/`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact/`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/faq/`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/search/`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.5,
    },
  ];

  // Wholesale bulk subcategories
  const wholesaleSubRoutes: MetadataRoute.Sitemap = WHOLESALE_BULK_SUBCATEGORIES.map((sub) => ({
    url: `${baseUrl}/wholesale/bulk-meat-orders/${sub.slug}/`,
    lastModified: now,
    changeFrequency: 'daily',
    priority: 0.8,
  }));

  // Category pages
  const categoryRoutes: MetadataRoute.Sitemap = CATEGORIES.map((cat) => ({
    url: `${baseUrl}/shop/${cat.slug}/`,
    lastModified: now,
    changeFrequency: 'daily',
    priority: 0.85,
  }));

  // Product pages with images
  const productRoutes: MetadataRoute.Sitemap = PRODUCTS.map((p) => {
    let url = `${baseUrl}/shop/${p.category}/${p.slug}/`;
    const cat = (p.main_category || p.category || '').toLowerCase();
    const sub = (p.subcategory || '').toLowerCase().replace(/\s+/g, '-');
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
      changeFrequency: 'daily',
      priority: 0.9,
      images: [p.main_image || p.image],
    };
  });

  // Blog post pages
  const blogRoutes: MetadataRoute.Sitemap = POSTS.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}/`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.75,
    images: [post.image],
  }));

  return [...staticRoutes, ...wholesaleSubRoutes, ...categoryRoutes, ...productRoutes, ...blogRoutes];
}
