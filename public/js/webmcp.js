(function () {
  if (typeof navigator === 'undefined' || !navigator.modelContext) return;
  navigator.modelContext.provideContext({
    tools: [
      {
        name: "search_products",
        description: "Search Mr Meat & Co products by keyword (e.g. beef mince), category, or price",
        inputSchema: { type: "object", properties: { query: { type: "string" }, category: { type: "string" }, max_price: { type: "number" } } },
        execute: async ({ query, category, max_price }) => {
          const params = new URLSearchParams();
          if (query) params.set('q', query);
          if (category) params.set('category', category);
          if (max_price) params.set('max_price', max_price.toString());
          const res = await fetch(`https://mrmeatandco.com.au/api/search?${params}`);
          return res.json();
        }
      },
      {
        name: "browse_products",
        description: "Browse butcher products by category",
        inputSchema: { type: "object", properties: { category: { type: "string" } } },
        execute: async ({ category }) => {
          const url = category ? `https://mrmeatandco.com.au/shop/${category}/` : `https://mrmeatandco.com.au/shop/`;
          window.location.href = url;
          return { url };
        }
      },
      {
        name: "order_via_whatsapp",
        description: "Initiate a Sydney WhatsApp butcher order. Minimum order $300 AUD. Human completes.",
        inputSchema: { type: "object", properties: { message: { type: "string" } } },
        execute: async ({ message }) => {
          const url = message ? `https://wa.me/61420126562?text=${encodeURIComponent(message)}` : `https://wa.me/61420126562`;
          window.open(url, '_blank');
          return { url };
        }
      },
      {
        name: "get_wholesale_info",
        description: "Get Sydney wholesale restaurant meat pricing and bulk ordering options",
        inputSchema: { type: "object", properties: {} },
        execute: async () => {
          window.location.href = `https://mrmeatandco.com.au/wholesale/`;
          return { url: `https://mrmeatandco.com.au/wholesale/` };
        }
      },
      {
        name: "contact",
        description: "Contact Sydney butchers for product questions or delivery support",
        inputSchema: { type: "object", properties: {} },
        execute: async () => {
          window.location.href = `https://mrmeatandco.com.au/contact/`;
          return { url: `https://mrmeatandco.com.au/contact/` };
        }
      }
    ]
  });
})();
