import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { init, track } from '@/lib/metaPixel';

export function MetaPixelRouter() {
  const location = useLocation();

  useEffect(() => {
    init();
    track('PageView');
  }, [location.pathname, location.search]);

  return null;
}

