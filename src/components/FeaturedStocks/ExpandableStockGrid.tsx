'use client';

import { Children, ReactNode, useState } from 'react';

type ExpandableStockGridProps = {
  children: ReactNode;
  columns: string;
  initialItems: number;
};

export function ExpandableStockGrid({
  children,
  columns,
  initialItems,
}: ExpandableStockGridProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const items = Children.toArray(children);
  const visibleItems = isExpanded ? items : items.slice(0, initialItems);
  const canExpand = items.length > initialItems;

  return (
    <>
      <div className='flex items-center justify-between'>
        <h2 className='font-bold text-primary'>Ações em destaque</h2>
        {canExpand && (
          <button
            type='button'
            aria-expanded={isExpanded}
            onClick={() => setIsExpanded((current) => !current)}
            className='text-sm font-semibold text-green-600 hover:text-green-800'
          >
            {isExpanded ? 'Ver menos' : 'Ver todos'}
          </button>
        )}
      </div>

      <div
        className={`flex snap-x snap-mandatory gap-3 overflow-x-auto pb-3 lg:grid lg:gap-5 lg:overflow-visible lg:pb-0 ${columns}`}
      >
        {visibleItems}
      </div>
    </>
  );
}
