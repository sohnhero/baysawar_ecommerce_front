"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, XCircle, Clock, ShoppingBag, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { api } from "@/lib/api";

type VerifiedStatus = "paid" | "failed" | "pending" | "loading" | "error";

interface VerifyResponse {
  orderId: string;
  paymentStatus: string;
  orderStatus: string;
}

function PaymentStatusContent() {
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const [verifiedStatus, setVerifiedStatus] = useState<VerifiedStatus>("loading");
  const [pollCount, setPollCount] = useState(0);

  const orderId = searchParams.get("orderId");
  const urlStatus = searchParams.get("status");
  const shortId = orderId ? orderId.substring(0, 8).toUpperCase() : null;

  const verify = useCallback(async () => {
    if (!orderId) {
      setVerifiedStatus(urlStatus === "success" ? "paid" : urlStatus === "error" ? "failed" : "error");
      return;
    }

    try {
      const data = await api.get<VerifyResponse>(`/payment/verify/${orderId}`);
      const status = data.paymentStatus;

      if (status === "paid") {
        setVerifiedStatus("paid");
      } else if (status === "failed" || status === "cancelled") {
        setVerifiedStatus("failed");
      } else {
        setVerifiedStatus("pending");
      }
    } catch {
      // Si l'endpoint échoue (non connecté, etc.), on se rabat sur le param URL
      setVerifiedStatus(urlStatus === "success" ? "paid" : urlStatus === "error" ? "failed" : "error");
    }
  }, [orderId, urlStatus]);

  // Vérification initiale au montage
  useEffect(() => {
    setMounted(true);
    verify();
  }, [verify]);

  // Polling toutes les 3s si le statut est encore "pending"
  useEffect(() => {
    if (verifiedStatus !== "pending" || pollCount >= 10) return;
    const timer = setTimeout(() => {
      setPollCount((c) => c + 1);
      verify();
    }, 3000);
    return () => clearTimeout(timer);
  }, [verifiedStatus, pollCount, verify]);

  if (!mounted || verifiedStatus === "loading") {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-surface">
        <div className="text-center">
          <Loader2 size={48} className="animate-spin text-brand-green mx-auto mb-4" />
          <p className="text-muted text-sm font-medium">Vérification du paiement...</p>
        </div>
      </div>
    );
  }

  if (verifiedStatus === "paid") {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-surface px-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-background rounded-[40px] border border-border-color p-12 text-center shadow-sm max-w-md w-full"
        >
          <div className="w-24 h-24 bg-brand-green/10 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle size={52} className="text-brand-green" />
          </div>
          <h1 className="font-heading font-black text-3xl mb-3">Paiement réussi !</h1>
          {shortId && (
            <p className="text-muted mb-2 text-sm">
              Commande <span className="font-bold text-brand-blue">#{shortId}</span>
            </p>
          )}
          <p className="text-muted text-sm mb-10 max-w-xs mx-auto">
            Votre paiement a été confirmé. Nous vous contacterons par téléphone d&apos;ici 15 minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/account/orders"
              className="flex-1 py-4 bg-surface border border-border-color rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-background transition-all"
            >
              Suivre ma commande
            </Link>
            <Link
              href="/shop"
              className="flex-1 py-4 bg-brand-green text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-brand-green/20 hover:bg-brand-green-light transition-all"
            >
              Continuer
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  if (verifiedStatus === "failed") {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-surface px-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-background rounded-[40px] border border-border-color p-12 text-center shadow-sm max-w-md w-full"
        >
          <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-8">
            <XCircle size={52} className="text-red-500" />
          </div>
          <h1 className="font-heading font-black text-3xl mb-3">Paiement échoué</h1>
          {shortId && (
            <p className="text-muted mb-2 text-sm">
              Commande <span className="font-bold text-brand-blue">#{shortId}</span>
            </p>
          )}
          <p className="text-muted text-sm mb-10 max-w-xs mx-auto">
            Le paiement n&apos;a pas pu être traité. Votre commande est en attente — réessayez ou choisissez un autre mode de paiement.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/checkout"
              className="flex-1 py-4 bg-brand-green text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-brand-green/20 hover:bg-brand-green-light transition-all"
            >
              Réessayer
            </Link>
            <Link
              href="/shop"
              className="flex-1 py-4 bg-surface border border-border-color rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-background transition-all"
            >
              Retour boutique
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // pending — polling en cours (max 30s) ou erreur de vérification
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-surface px-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-background rounded-[40px] border border-border-color p-12 text-center shadow-sm max-w-md w-full"
      >
        <div className="w-24 h-24 bg-brand-blue/10 rounded-full flex items-center justify-center mx-auto mb-8">
          {pollCount < 10 ? (
            <Loader2 size={52} className="text-brand-blue animate-spin" />
          ) : (
            <Clock size={52} className="text-brand-blue" />
          )}
        </div>
        <h1 className="font-heading font-black text-3xl mb-3">Paiement en attente</h1>
        {shortId && (
          <p className="text-muted mb-2 text-sm">
            Commande <span className="font-bold text-brand-blue">#{shortId}</span>
          </p>
        )}
        <p className="text-muted text-sm mb-10 max-w-xs mx-auto">
          {pollCount < 10
            ? "Vérification en cours, merci de patienter..."
            : "Le paiement prend plus de temps que prévu. Consultez vos commandes pour le suivi."}
        </p>
        <Link
          href="/account/orders"
          className="flex-1 py-4 bg-brand-green text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-brand-green/20 hover:bg-brand-green-light transition-all flex items-center justify-center gap-2"
        >
          <ShoppingBag size={16} /> Mes commandes
        </Link>
      </motion.div>
    </div>
  );
}

export default function PaymentStatusPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[80vh] flex items-center justify-center bg-surface">
        <Loader2 size={48} className="animate-spin text-brand-green" />
      </div>
    }>
      <PaymentStatusContent />
    </Suspense>
  );
}
