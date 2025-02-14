'use client';

import { useEffect } from 'react';
import { CONFIG } from 'src/config-global';

import { useRouter } from 'src/routes/hooks';

// ----------------------------------------------------------------------

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    router.push(CONFIG.auth.redirectPath);
  }, [router]);

  return null;
}
