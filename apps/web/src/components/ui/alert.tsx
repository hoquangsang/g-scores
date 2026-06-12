import type { ReactNode } from 'react';

export function Alert({ children }: { readonly children: ReactNode }) {
  return (
    <div className="alert" role="alert">
      {children}
    </div>
  );
}
