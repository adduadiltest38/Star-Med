import { useMemo, useState } from 'react';
import { Search, TestTube, X } from 'lucide-react';

interface Props {
  categories: readonly { name: string; tests: readonly string[] }[];
  enquiryHref: string;
}

/** Client-side filter for the laboratory test catalogue. */
export default function LabTestFinder({ categories, enquiryHref }: Props) {
  const [q, setQ] = useState('');
  const [active, setActive] = useState<string>('All');

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return categories
      .filter((c) => active === 'All' || c.name === active)
      .map((c) => ({ ...c, tests: c.tests.filter((t) => !needle || t.toLowerCase().includes(needle)) }))
      .filter((c) => c.tests.length > 0);
  }, [q, active, categories]);

  const count = results.reduce((n, c) => n + c.tests.length, 0);

  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-sm">
          <label htmlFor="lab-search" className="sr-only">
            Search tests
          </label>
          <Search className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted" aria-hidden="true" />
          <input
            id="lab-search"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search a test, e.g. HbA1c"
            className="h-13 w-full rounded-full border border-line bg-white py-3.5 pr-11 pl-12 text-ink shadow-soft focus:border-brand-400 focus:ring-4 focus:ring-brand-100 focus:outline-none"
          />
          {q && (
            <button
              type="button"
              onClick={() => setQ('')}
              className="absolute top-1/2 right-2 grid size-9 -translate-y-1/2 place-items-center rounded-full text-muted hover:bg-surface"
              aria-label="Clear search"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          )}
        </div>
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 lg:mx-0 lg:flex-wrap lg:px-0" role="group" aria-label="Filter by category">
          {['All', ...categories.map((c) => c.name)].map((name) => (
            <button
              key={name}
              type="button"
              aria-pressed={active === name}
              onClick={() => setActive(name)}
              className={`h-10 shrink-0 rounded-full px-4 text-sm font-semibold transition ${
                active === name ? 'bg-teal-600 text-white shadow-soft' : 'border border-line bg-white text-ink-soft hover:border-teal-200 hover:text-teal-700'
              }`}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-6 text-sm text-muted" aria-live="polite">
        {count} {count === 1 ? 'test' : 'tests'} shown
      </p>

      {results.length > 0 ? (
        <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((c) => (
            <section key={c.name} className="rounded-3xl border border-line/70 bg-white p-6 shadow-soft" aria-label={c.name}>
              <h3 className="text-lg font-bold text-ink">{c.name}</h3>
              <ul className="mt-4 space-y-2.5">
                {c.tests.map((t) => (
                  <li key={t} className="flex items-start gap-2.5 text-ink-soft">
                    <TestTube className="mt-0.5 size-4 shrink-0 text-teal-600" aria-hidden="true" />
                    {t}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      ) : (
        <div className="mt-4 rounded-3xl border-2 border-dashed border-line p-10 text-center">
          <p className="font-semibold text-ink">No matching tests in this list.</p>
          <p className="mt-2 text-ink-soft">
            The test you need may still be available.{' '}
            <a href={enquiryHref} className="font-semibold text-brand-700 underline-offset-4 hover:underline">
              Ask the laboratory
            </a>
            .
          </p>
        </div>
      )}
    </div>
  );
}
