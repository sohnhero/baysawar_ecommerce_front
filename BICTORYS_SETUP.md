# 🎯 Intégration Bictorys - Guide de Configuration

## 📋 Aperçu
Ce guide explique comment configurer et utiliser l'intégration Bictorys pour les paiements en ligne dans l'application Baysawarr e-commerce.

## 🚀 Fichiers Créés/Modifiés

### Fichiers Créés
```
src/lib/services/bictorys.ts                    # Service principal de Bictorys
src/components/payments/BictorysPaymentButton.tsx  # Composant de paiement
src/app/api/webhooks/bictorys/route.ts          # Endpoint webhook Bictorys
src/app/payment-status/page.tsx                 # Page de statut de paiement
.env.bictorys.example                           # Variables d'environnement exemple
```

### Fichiers Modifiés
```
src/app/checkout/page.tsx                       # Intégration Bictorys au checkout
```

## ⚙️ Configuration

### 1. Variables d'Environnement

Créez un fichier `.env.local` ou `.env.production` et ajoutez:

```env
# Bictorys Payment Integration
NEXT_PUBLIC_BICTORYS_PUBLIC_KEY=your_public_key_here
NEXT_PUBLIC_BICTORYS_API_URL=https://api.bictorys.com
BICTORYS_SECRET_KEY=your_secret_key_here
NEXT_PUBLIC_BICTORYS_MERCHANT_ID=your_merchant_id_here
NEXT_PUBLIC_BICTORYS_ENV=development
```

**Où obtenir ces clés:**
1. Accédez à [Tableau de bord Bictorys](https://dashboard.bictorys.com)
2. Allez dans les paramètres API
3. Générez les clés publique et secrète
4. Copiez-les dans le fichier d'environnement

### 2. Installation des Dépendances

```bash
# Aucune dépendance supplémentaire requise
# L'intégration utilise les packages existants:
# - next/navigation
# - framer-motion (déjà installé)
# - react-toastify (déjà installé)
```

### 3. Configuration du Webhook

Pour configurer le webhook Bictorys:

1. Allez dans le dashboard Bictorys
2. Dans les paramètres webhook, ajoutez:
   - **URL**: `https://votre-domaine.com/api/webhooks/bictorys`
   - **Événements**: Payment Success, Payment Failure
   - **Authentification**: Signature HMAC-SHA256

L'endpoint webhook gère automatiquement:
- ✅ Vérification de la signature
- ✅ Mise à jour du statut de commande
- ✅ Logs d'événements

## 🎨 Utilisation

### Intégration au Checkout

Le flux de paiement intègre automatiquement Bictorys:

1. **Étape 1**: Informations de livraison
2. **Étape 2**: Sélection du mode d'expédition
3. **Étape 3**: Sélection de la méthode de paiement
   - Option "Bictorys" ajoutée
4. **Étape 4**: Récapitulatif
   - Si Bictorys sélectionné → Bouton Bictorys spécifique
   - Si autre méthode → Bouton de confirmation standard

### Composant BictorysPaymentButton

```tsx
import { BictorysPaymentButton } from "@/components/payments/BictorysPaymentButton";

<BictorysPaymentButton
  amount={1500}                    // Montant en XOF
  orderId="ORD-123456"             // ID de commande
  customerName="Amadou Diallo"     // Nom client
  customerEmail="user@example.com" // Email client
  customerPhone="77123456789"      // Téléphone client
  onPaymentInitiated={(transactionId) => {
    console.log("Paiement initié:", transactionId);
  }}
/>
```

### Service Bictorys

```tsx
import { 
  initializeBictorysPayment, 
  verifyBictorysPayment 
} from "@/lib/services/bictorys";

// Initialiser un paiement
const paymentSession = await initializeBictorysPayment({
  amount: 1500,
  currency: "XOF",
  orderId: "ORD-123",
  description: "Commande #ORD-123",
  customerName: "Amadou Diallo",
  customerEmail: "user@example.com",
  customerPhone: "77123456789",
  successUrl: "https://votre-domaine.com/payment-status?status=success",
  failureUrl: "https://votre-domaine.com/payment-status?status=failure",
  callbackUrl: "https://votre-domaine.com/api/webhooks/bictorys"
});

// window.location.href = paymentSession.paymentUrl;

// Vérifier le statut d'un paiement
const paymentStatus = await verifyBictorysPayment(transactionId);
```

## 🔒 Sécurité

### Bonnes Pratiques Implémentées

✅ **Clés d'API:**
- Clés secrètes jamais exposées au client
- Variables sensibles protégées côté serveur

✅ **Validation des Webhooks:**
- Signature HMAC-SHA256 vérifiée
- Protection contre les requêtes non autorisées

✅ **Données Client:**
- Communications HTTPS obligatoires
- Pas de stockage de données bancaires
- Conformité PCI DSS

## 📱 Workflow de Paiement

```
1. Client sélectionne "Bictorys" au checkout
   ↓
2. Formulaire de livraison et détails validés
   ↓
3. Commande créée en base de données
   ↓
4. Session de paiement Bictorys initialisée
   ↓
5. Client redirigé vers Bictorys
   ↓
6. Paiement effectué sur Bictorys
   ↓
7. Webhook Bictorys confirme le paiement
   ↓
8. Statut de commande mis à jour
   ↓
9. Client redirigé vers page de confirmation
```

## 🧪 Testing

### Mode Test

Pour tester l'intégration:

```bash
# 1. Configurez l'environnement de test
NEXT_PUBLIC_BICTORYS_ENV=development

# 2. Utilisez les credentials de test Bictorys
NEXT_PUBLIC_BICTORYS_PUBLIC_KEY=test_pk_...
BICTORYS_SECRET_KEY=test_sk_...

# 3. Lancez le serveur de développement
npm run dev

# 4. Naviguez vers /checkout et testez le flux
```

### Cartes de Test Bictorys

Bictorys fournit des numéros de carte test:
- **N° de carte**: `4111 1111 1111 1111`
- **Expiration**: `12/25`
- **CVV**: `123`

## 📞 Support & Débogage

### Logs

Les logs de débogage sont disponibles:

```tsx
// Développement
console.log("Bictorys payment initialized:", response);

// Production
// Les logs détaillés sont désactivés pour la sécurité
```

### Webhook Testing

Pour tester les webhooks localement:

```bash
# Utiliser ngrok pour exposer votre serveur local
ngrok http 3000

# Mettre à jour l'URL webhook dans Bictorys dashboard
# https://your-ngrok-url/api/webhooks/bictorys
```

### Vérification de Configuration

```bash
# Vérifier les variables d'environnement
echo $NEXT_PUBLIC_BICTORYS_PUBLIC_KEY

# Tester l'endpoint webhook
curl -X POST http://localhost:3000/api/webhooks/bictorys \
  -H "Content-Type: application/json" \
  -H "x-bictorys-signature: test-signature" \
  -d '{"transactionId":"test","orderId":"123","status":"success"}'
```

## 🐛 Troubleshooting

### "Bictorys public key is not configured"
- Vérifiez que `NEXT_PUBLIC_BICTORYS_PUBLIC_KEY` est défini
- Rechargez le serveur après modification des variables

### "Failed to initialize payment"
- Vérifiez les credentials Bictorys
- Vérifiez la connectivité vers l'API Bictorys
- Vérifiez les logs du serveur

### Webhook signature invalide
- Vérifiez que `BICTORYS_SECRET_KEY` est correct
- Assurez-vous que le payload n'est pas modifié avant la vérification
- Consultez la documentation Bictorys sur le format de signature

## 📚 Ressources Utiles

- [Documentation Bictorys API](https://developer.bictorys.com/docs)
- [Dashboard Bictorys](https://dashboard.bictorys.com)
- [Guides de Paiement](https://developer.bictorys.com/guides)
- [Status Webhook](https://developer.bictorys.com/webhooks)

## ✅ Checklist Avant Production

- [ ] Clés API Bictorys en production configurées
- [ ] Webhook URL mise à jour vers le domaine de production
- [ ] Variables d'environnement sécurisées
- [ ] Tests de paiement complets validés
- [ ] Logs d'erreurs configurés
- [ ] Page de confirmation testée
- [ ] Gestion des erreurs validée
- [ ] Récupération de contrat réservation validée

## 📧 Contact

Pour toute question ou support:
- Email technique: support@baysawarr.com
- Dashboard Bictorys: https://dashboard.bictorys.com/support
