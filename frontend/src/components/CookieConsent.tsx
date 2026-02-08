"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/Button";

const CONSENT_KEY = "sz_cookie_consent";

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_KEY);
    if (!consent) {
      const timer = setTimeout(() => setShowBanner(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(CONSENT_KEY, "accepted");
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t-2 border-terracotta-light shadow-warm-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex-1 text-sm text-warm-gray">
            <p>
              <strong className="text-clay-brown">Използваме бисквитки</strong>{" "}
              за да подобрим Вашето изживяване при използване на сайта. Те
              помагат за функционалността на сайта и за запазване на артикулите
              във Вашата количка.
            </p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <Button onClick={handleAccept} size="sm">
              Разбрах
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
