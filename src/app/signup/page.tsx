'use client';

import SignUp from '@/components/auth/SignUp';
import { useRouter } from 'next/navigation';
import React, { Suspense } from 'react';

export default function SignUpPage() {
  return (
    <Suspense>
      <SignUpComponent />
    </Suspense>
  );
}

function SignUpComponent() {
  const router = useRouter();
  return <SignUp onBackButtonClicked={() => router.push('/')} />;
}
