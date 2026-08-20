# Auth.md

## Site: The Meat Cart — Sydney Craft Butcher

## Agent Registration
No authentication required. All product catalog and butcher resources are publicly accessible.

## Public Resources
| Resource | URL |
|---|---|
| Product Catalog | https://themeatcart.com.au/shop/ |
| Wholesale Inquiries | https://themeatcart.com.au/wholesale/ |
| Butchery Blog | https://themeatcart.com.au/blog/ |
| FAQ | https://themeatcart.com.au/faq/ |
| MCP Streamable HTTP Endpoint | https://themeatcart.com.au/api/mcp |

## Authentication

```json
{
  "agent_auth": {
    "register_uri": null,
    "identity_types_supported": ["none"],
    "credential_types_supported": ["none"],
    "notes": "No authentication required. All resources are public."
  }
}
```

## Ordering
Human-in-the-loop required. Agents may browse catalog, search items, and prepare prefilled order draft URLs.
Orders are finalized and completed by a human via WhatsApp or the direct order form.
