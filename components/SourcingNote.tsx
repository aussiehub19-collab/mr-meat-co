import React from 'react';

type Variant = 'meat' | 'poultry' | 'petfood' | 'seafood';

/**
 * One-line sourcing / standards note with outbound authority links. Sits
 * under the page intro on category, subcategory, landing and wholesale
 * pages — a genuine transparency signal that also carries the outbound
 * DoFollow links SEO tools look for.
 */
export function SourcingNote({ variant = 'meat' }: { variant?: Variant }) {
  const A = ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-red-400 underline underline-offset-2 hover:text-red-300"
    >
      {children}
    </a>
  );

  return (
    <p className="text-xs text-gray-400 leading-relaxed max-w-3xl">
      {variant === 'poultry' ? (
        <>
          Live poultry is sourced from a partner farm in NSW — birds are vaccinated and sexed where stated, and kept to
          the biosecurity guidance on the{' '}
          <A href="https://www.dpi.nsw.gov.au/animals-and-livestock/poultry-and-birds">NSW DPI poultry pages</A>. Meat and
          eggs are handled to{' '}
          <A href="https://www.foodstandards.gov.au/">Food Standards Australia &amp; New Zealand</A> requirements.
        </>
      ) : variant === 'petfood' ? (
        <>
          Our raw pet range is made from human-grade meat, kept completely separate from the retail range, and handled to{' '}
          <A href="https://www.foodstandards.gov.au/">Food Standards Australia &amp; New Zealand</A> hygiene standards.
        </>
      ) : variant === 'seafood' ? (
        <>
          Seafood is sourced from Australian fisheries and snap-frozen at the source. Species labelling follows the{' '}
          <A href="https://www.fish.gov.au/">Australian fish names standard</A>, and all product is handled to{' '}
          <A href="https://www.foodstandards.gov.au/">Food Standards Australia &amp; New Zealand</A> requirements.
        </>
      ) : (
        <>
          Our beef and lamb are graded for eating quality under{' '}
          <A href="https://www.mla.com.au/marketing-beef-and-lamb/meat-standards-australia/">Meat Standards Australia</A>{' '}
          and cut to <A href="https://www.ausmeat.com.au/">AUS-MEAT</A> language; everything is ground and cut fresh in
          Alexandria and handled to{' '}
          <A href="https://www.foodstandards.gov.au/">Food Standards Australia &amp; New Zealand</A> requirements.
        </>
      )}
    </p>
  );
}
