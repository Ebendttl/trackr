'use client';
import DocNav from '@/components/docs/DocNav';

/**
 * Shared App Router layout shell for developer docs portal.
 */
export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[var(--surface-void)] text-[var(--text-primary)]">
      <DocNav />
      <div className="flex-1 overflow-y-auto h-screen p-12 pr-24 font-sans leading-relaxed max-w-4xl">
        {children}
      </div>
    </div>
  );
}
