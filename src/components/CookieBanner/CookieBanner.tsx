'use client';

import { FC, useEffect, useState } from 'react';
import Modal from '@/components/Modal';
import { useModal } from '@/context/EmergencyProvider';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const MODAL_NAME = 'cookie-banner';
const POLICY_URL = '/politica-privacidad';
const COOKIE_CONSENT_KEY = 'ajudaDanaCookieConsentAccepted';

const CookieBanner: FC = () => {
  const { toggleModal } = useModal();
  const pathname = usePathname();
  const [hasConsent, setHasConsent] = useState(false);

  useEffect(() => {
    // Check for consent in localStorage when the component mounts
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    setHasConsent(Boolean(consent));
  }, []);

  const handleAcceptCookies = () => {
    // Set consent in localStorage and close the modal
    localStorage.setItem(COOKIE_CONSENT_KEY, 'true');
    setHasConsent(true);
    toggleModal(MODAL_NAME, false);
  };

  const handleRejectCookies = () => {
    // Redirect to Google if cookies are rejected
    window.location.href = 'https://www.google.com';
  };

  useEffect(() => {
    // Show the modal only if consent is not given and we're not on the policy page
    if (!hasConsent && pathname !== POLICY_URL) {
      toggleModal(MODAL_NAME, true);
    } else {
      toggleModal(MODAL_NAME, false);
    }
  }, [hasConsent, pathname]);

  if (hasConsent) return null; // Do not render the modal if consent is already given

  return (
    <Modal id={MODAL_NAME} allowClose={false}>
      <div className="bg-yellow-50 p-4 rounded">
        <h2 className="text-yellow-800 font-semibold mb-4">Política de Cookies</h2>
        <p className="text-yellow-800">
          Usamos cookies para mejorar su experiencia. Al aceptar, usted está de acuerdo con nuestra{' '}
          <Link href={POLICY_URL} className="text-yellow-900 font-semibold underline">
            política de cookies
          </Link>
          .
        </p>
        <div className="mt-4 flex justify-end space-x-4">
          <button
            onClick={handleRejectCookies}
            className="flex-1 bg-red-500 text-white py-3 px-4 rounded-lg font-semibold"
          >
            Rechazar
          </button>
          <button
            onClick={handleAcceptCookies}
            className="flex-1 bg-green-500 text-white py-3 px-4 rounded-lg font-semibold"
          >
            Aceptar
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default CookieBanner;
