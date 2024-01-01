"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const CatchAllPage = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the /main path when the page loads
    router.push('/pages');
  }, [router]);

  // This component will not render anything on the client side
  return null;
};

export default CatchAllPage;