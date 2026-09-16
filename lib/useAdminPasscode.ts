"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "mmc-admin-passcode";

export function useAdminPasscode() {
  const [passcode, setPasscode] = useState<string | null>(null);
  const [verified, setVerified] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const verify = useCallback(async (candidate: string): Promise<boolean> => {
    setChecking(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/verify", {
        headers: { "X-Admin-Passcode": candidate },
      });
      if (res.ok) {
        setPasscode(candidate);
        setVerified(true);
        try {
          localStorage.setItem(STORAGE_KEY, candidate);
        } catch {
          /* private-browsing etc — verified state still holds for this session */
        }
        return true;
      }
      setError("Incorrect passcode.");
      return false;
    } catch {
      setError("Could not reach the server — try again.");
      return false;
    } finally {
      setChecking(false);
    }
  }, []);

  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    if (stored) {
      verify(stored).finally(() => setChecking(false));
    } else {
      setChecking(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const logout = useCallback(() => {
    setPasscode(null);
    setVerified(false);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  return { passcode, verified, checking, error, verify, logout };
}
