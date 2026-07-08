'use client';

import { useEffect } from 'react';

export function HideDevTools() {
  useEffect(() => {
    // Function to hide the dev tools button
    const hideDevTools = () => {
      try {
        // Hide the NEXTJS-PORTAL element which contains the dev tools
        const portal = document.querySelector('nextjs-portal') as HTMLElement | null;
        if (portal) {
          portal.style.display = 'none';
          portal.style.visibility = 'hidden';
          portal.style.pointerEvents = 'none';
        }

        // Also try hiding via portal children
        const portals = document.querySelectorAll('nextjs-portal, [class*="portal"]');
        portals.forEach((p) => {
          const children = p.querySelectorAll('button');
          children.forEach((btn: HTMLButtonElement) => {
            const ariaLabel = btn.getAttribute('aria-label');
            if (
              ariaLabel &&
              (ariaLabel.includes('Dev Tools') || ariaLabel.includes('Next.js'))
            ) {
              btn.style.display = 'none';
              btn.style.visibility = 'hidden';
              btn.style.pointerEvents = 'none';
              // Also hide parent if needed
              if (btn.parentElement) {
                (btn.parentElement as HTMLElement).style.display = 'none';
              }
            }
          });
        });

        // Also try using style attribute injection
        const style = document.createElement('style');
        style.textContent = `
          nextjs-portal,
          [data-nextjs-dev-tools-button],
          button[aria-label*="Dev Tools"],
          button[aria-label*="Open Next"],
          button[aria-label*="Close Next"] {
            display: none !important;
            visibility: hidden !important;
            pointer-events: none !important;
          }
        `;
        if (!document.querySelector('style[data-hide-devtools]')) {
          style.setAttribute('data-hide-devtools', 'true');
          document.head.appendChild(style);
        }
      } catch (e) {
        // Ignore errors
      }
    };

    // Run immediately
    hideDevTools();

    // Also run on every mutation to catch dynamically added elements
    const observer = new MutationObserver(() => {
      hideDevTools();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['aria-label', 'data-testid', 'title']
    });

    // Run periodically just to be sure
    const interval = setInterval(hideDevTools, 200);

    return () => {
      observer.disconnect();
      clearInterval(interval);
    };
  }, []);

  return null;
}
