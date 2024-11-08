'use client';
import SignUp from '@/components/auth/SignUp';
import { useRouter, useSearchParams } from 'next/navigation';
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
  const params = useSearchParams();
  console.log(params);
  return <SignUp onBackButtonClicked={() => router.push('/')} />;
}
