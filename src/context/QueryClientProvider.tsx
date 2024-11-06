'use client';

import { PropsWithChildren, useState } from 'react';
import { QueryClient, QueryClientProvider as TanstackQueryClientProvider } from '@tanstack/react-query';

export const QueryClientProvider = ({ children }: PropsWithChildren) => {
  const [client] = useState(new QueryClient());

  return <TanstackQueryClientProvider client={client}>{children}</TanstackQueryClientProvider>;
};
