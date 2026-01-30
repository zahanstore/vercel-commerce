'use client';

import { useState } from "react";
import { useRouter, usePathname } from 'next/navigation';

// 1. MUST include INR here to trigger your Qikink logic
const Currencies = [
  'USD',
  'INR', // Added this
  'EUR',
  'GBP',
  'CAD',
  'AUD',
  'JPY',
];

export function CurrencySelector({ currency }: { currency: string; }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (newCurrency: string) => {
    // 2. Logic to swap the currency in the path
    // pathParts looks like ["", "USD", "search"]
    const pathParts = pathname.split('/');
    
    // Replace the first segment (the currency) with the new one
    pathParts[1] = newCurrency;
    const newPath = pathParts.join('/') || `/${newCurrency}`;

    router.push(newPath);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          type="button"
          className="inline-flex h-11 justify-center items-center w-full rounded-md border border-neutral-200 dark:border-neutral-800 px-4 py-2 bg-white dark:bg-black text-sm font-medium text-gray-700 dark:text-gray-200 focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {currency}
          <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {isOpen && (
        <>
          {/* Overlay to close dropdown when clicking outside */}
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>
          
          <div className="origin-top-right absolute right-0 mt-2 w-32 rounded-md shadow-lg bg-white dark:bg-black ring-1 ring-black ring-opacity-5 z-20 border dark:border-neutral-800">
            <div className="py-1 max-h-60 overflow-auto">
              {Currencies.map((c) => (
                <button
                  key={c}
                  className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-neutral-900 ${
                    currency === c ? 'font-bold text-black dark:text-white' : 'text-gray-700 dark:text-gray-400'
                  }`}
                  onClick={() => handleSelect(c)}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

