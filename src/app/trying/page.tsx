'use client';

import AddressMap, { AddressAndTown } from '@/components/AddressMap';

export default function TryingPage() {
  const onNewAddress = (addressAndTown: AddressAndTown) => {
    console.log(addressAndTown);
  };

  return <AddressMap onNewAddressCallback={onNewAddress} />;
}
