'use client';

import { ReactNode } from 'react';
import { OCConnect, OCConnectProps } from '@opencampus/ocid-connect-js';

interface OCConnectWrapperProps {
  children: ReactNode;
  opts: OCConnectProps;
  sandboxMode?: boolean;
}

export default function OCConnectWrapper({ children, opts, sandboxMode }: OCConnectWrapperProps) {
  return (
    <OCConnect opts={opts} sandboxMode={sandboxMode}>
      {children}
    </OCConnect>
  );
}
