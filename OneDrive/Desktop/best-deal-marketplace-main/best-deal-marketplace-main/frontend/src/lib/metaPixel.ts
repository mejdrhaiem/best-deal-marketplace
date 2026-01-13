// Meta Pixel integration with GDPR-style consent and event tracking
// Provides: init, track, getConsent, setConsent, generateEventId
// Ensures currency TND and content_type "product" for e-commerce events

type FbqBase = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void;
  queue: unknown[][];
  loaded?: boolean;
  version?: string;
};

declare global {
  interface Window {
    fbq?: FbqBase;
  }
}

const CONSENT_KEY = 'trackingConsent';
const PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID as string | undefined;

export function getConsent(): boolean {
  try {
    return localStorage.getItem(CONSENT_KEY) === 'true';
  } catch {
    return false;
  }
}

export function setConsent(value: boolean) {
  try {
    localStorage.setItem(CONSENT_KEY, value ? 'true' : 'false');
    if (!value) {
      // Optional: revoke consent in pixel if already initialized
      if (window.fbq) {
        window.fbq('consent', 'revoke');
      }
    }
  } catch {
    // ignore
  }
}

function loadPixelScript() {
  if (document.getElementById('facebook-pixel-script')) return;
  const script = document.createElement('script');
  script.id = 'facebook-pixel-script';
  script.async = true;
  script.src = 'https://connect.facebook.net/en_US/fbevents.js';
  document.head.appendChild(script);
}

export function init() {
  if (!getConsent()) return;
  if (!PIXEL_ID) return;

  if (window.fbq) {
    return;
  }

  // Base fbq bootstrap (meta pixel base code minimal)
  const fbq = ((...args: unknown[]) => {
    if (fbq.callMethod) {
      fbq.callMethod(...args);
    } else {
      fbq.queue.push(args);
    }
  }) as FbqBase;
  fbq.queue = [];
  fbq.loaded = true;
  fbq.version = '2.0';
  window.fbq = fbq;

  loadPixelScript();

  window.fbq('consent', 'grant');
  window.fbq('init', PIXEL_ID);
}

type TrackParams = {
  content_ids?: (string | number)[];
  content_type?: 'product';
  value?: number;
  currency?: 'TND';
  contents?: Array<{ id: string | number; quantity?: number; item_price?: number }>;
};

export function track(eventName: 'PageView' | 'ViewContent' | 'AddToCart' | 'InitiateCheckout' | 'Purchase', params: TrackParams = {}, eventId?: string) {
  if (!getConsent()) return;
  if (!window.fbq) init();
  if (!window.fbq) return;

  const payload: TrackParams = {
    ...params,
    content_type: 'product',
    currency: 'TND',
  };

  if (eventId) {
    window.fbq('track', eventName, payload, { eventID: eventId });
  } else {
    window.fbq('track', eventName, payload);
  }
}

export function generateEventId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}
