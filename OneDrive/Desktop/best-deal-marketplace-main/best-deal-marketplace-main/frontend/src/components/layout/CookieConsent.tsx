import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { init, getConsent, setConsent } from '@/lib/metaPixel';

export function CookieConsent() {
  const [consent, setConsentState] = useState<boolean>(getConsent());
  const [visible, setVisible] = useState<boolean>(!getConsent());

  useEffect(() => {
    if (consent) {
      init();
    }
  }, [consent]);

  const accept = () => {
    setConsent(true);
    setConsentState(true);
    setVisible(false);
  };

  const toggle = (checked: boolean) => {
    setConsent(checked);
    setConsentState(checked);
    if (checked) init();
  };

  return (
    <>
      {visible && (
        <div className="fixed bottom-4 left-4 right-4 z-50 rounded-xl bg-card border border-border/50 p-4 shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              We use cookies to measure performance and improve ads. Enable tracking to help us optimize. You can disable anytime.
            </p>
            <div className="flex items-center gap-2">
              <Switch checked={consent} onCheckedChange={toggle} />
              <Button className="gradient-primary text-primary-foreground" onClick={accept}>
                Accept
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

