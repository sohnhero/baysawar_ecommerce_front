// Direct import of the ESM bundle to bypass dependency tracing of problematic fflate node versions
const JSPDF_PATH = "jspdf/dist/jspdf.es.min.js";

const statusTranslations: Record<string, string> = {
  pending: "En attente",
  processing: "En cours",
  shipped: "Expédié",
  delivered: "Livré",
  cancelled: "Annulé"
};

export const generateDashboardReport = async (
  stats: any, 
  topProducts: any[], 
  recentOrders: any[], 
  timeRange: string,
  ordersByStatus?: Record<string, number>
) => {
  // @ts-ignore - Importing from dist/ directly to avoid build issues
  const { jsPDF } = await import(JSPDF_PATH);
  const { default: autoTable } = await import("jspdf-autotable");

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 40, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("BaysaWarr - Rapport de Performance", 15, 15);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Généré le: ${new Date().toLocaleString()}`, 15, 25);
  doc.text(`Période: ${timeRange === "all" ? "Historique complet" : timeRange}`, 15, 30);

  // Key Metrics
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(16);
  doc.text("Indicateurs Clés", 15, 55);

  const metricsData = [
    ["Chiffre d'Affaires réalisé (Livré)", `${stats?.totalRevenue?.toLocaleString() || 0} FCFA`],
    ["Total Commandes", `${stats?.totalOrders || 0}`],
    ["Catalogue Produits", `${stats?.totalProducts || 0}`],
    ["Base Membres", `${stats?.totalUsers || 0}`]
  ];

  autoTable(doc, {
    startY: 60,
    head: [["Indicateur", "Valeur"]],
    body: metricsData,
    theme: "striped",
    headStyles: { fillColor: [11, 159, 11] }, // brand-green
  });

  let currentY = (doc as any).lastAutoTable.finalY + 15;

  // Status Breakdown
  if (ordersByStatus && Object.keys(ordersByStatus).length > 0) {
    doc.text("Répartition des Commandes", 15, currentY);
    
    const statusData = Object.entries(ordersByStatus).map(([status, count]) => [
      statusTranslations[status] || status,
      count
    ]);

    autoTable(doc, {
      startY: currentY + 5,
      head: [["Statut", "Nombre"]],
      body: statusData,
      theme: "grid",
      headStyles: { fillColor: [30, 64, 175] }, // brand-blue
    });
    
    currentY = (doc as any).lastAutoTable.finalY + 15;
  }

  // Top Products
  doc.text("Top Produits", 15, currentY);

  const productData = topProducts.map(p => [
    p.name,
    p.category || "N/A",
    `${parseFloat(p.price).toLocaleString()} FCFA`,
    p.sales || 0
  ]);

  autoTable(doc, {
    startY: currentY + 5,
    head: [["Nom", "Catégorie", "Prix", "Ventes"]],
    body: productData,
    theme: "grid",
    headStyles: { fillColor: [15, 23, 42] },
  });

  // Recent Activity
  const ordersY = (doc as any).lastAutoTable.finalY + 15;
  doc.text("Dernières Activités", 15, ordersY);

  const orderData = recentOrders.map(o => [
    o.id.substring(0, 8).toUpperCase(),
    o.customer || "Client",
    o.date,
    `${parseFloat(o.amount).toLocaleString()} FCFA`,
    (statusTranslations[o.status] || o.status).toUpperCase()
  ]);

  autoTable(doc, {
    startY: ordersY + 5,
    head: [["ID", "Client", "Date", "Montant", "Statut"]],
    body: orderData,
    theme: "striped",
    headStyles: { fillColor: [51, 65, 85] }, // slate-700
  });

  doc.save(`rapport_baysawarr_${new Date().toISOString().split('T')[0]}.pdf`);
};

export const generateProductsReport = async (products: any[]) => {
  // @ts-ignore
  const { jsPDF } = await import(JSPDF_PATH);
  const { default: autoTable } = await import("jspdf-autotable");

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, pageWidth, 40, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.text("Catalogue Produits", 15, 25);
  doc.setFontSize(10);
  doc.text(`Total: ${products.length} articles`, 15, 35);

  const tableData = products.map(p => [
    p.name,
    p.category?.name || "N/A",
    `${parseFloat(p.price).toLocaleString()} FCFA`,
    p.stock || 0,
    p.active ? "Actif" : "Inactif"
  ]);

  autoTable(doc, {
    startY: 50,
    head: [["Nom", "Catégorie", "Prix", "Stock", "Statut"]],
    body: tableData,
    theme: "grid",
    headStyles: { fillColor: [11, 159, 11] },
  });

  doc.save(`catalogue_produits_${new Date().toISOString().split('T')[0]}.pdf`);
};

export const generateOrdersReport = async (orders: any[]) => {
  // @ts-ignore
  const { jsPDF } = await import(JSPDF_PATH);
  const { default: autoTable } = await import("jspdf-autotable");

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, pageWidth, 40, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.text("Rapport des Commandes", 15, 25);
  doc.setFontSize(10);
  doc.text(`Total: ${orders.length} commandes`, 15, 35);

  const tableData = orders.map(o => [
    o.id.substring(0, 8).toUpperCase(),
    o.user?.name || "Client",
    new Date(o.createdAt).toLocaleDateString(),
    `${parseFloat(o.totalAmount).toLocaleString()} FCFA`,
    (statusTranslations[o.status] || o.status).toUpperCase()
  ]);

  autoTable(doc, {
    startY: 50,
    head: [["ID", "Client", "Date", "Montant", "Statut"]],
    body: tableData,
    theme: "striped",
    headStyles: { fillColor: [30, 64, 175] }, // brand-blue
  });

  doc.save(`rapport_commandes_${new Date().toISOString().split('T')[0]}.pdf`);
};

export const generateUsersReport = async (users: any[]) => {
  // @ts-ignore
  const { jsPDF } = await import(JSPDF_PATH);
  const { default: autoTable } = await import("jspdf-autotable");

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, pageWidth, 40, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.text("Liste des Membres", 15, 25);
  doc.setFontSize(10);
  doc.text(`Total: ${users.length} utilisateurs`, 15, 35);

  const tableData = users.map(u => [
    u.name,
    u.email,
    u.phone || "—",
    u.role.toUpperCase(),
    `${(u.totalSpent || 0).toLocaleString()} FCFA`
  ]);

  autoTable(doc, {
    startY: 50,
    head: [["Nom", "Email", "Téléphone", "Rôle", "Dépensé"]],
    body: tableData,
    theme: "grid",
    headStyles: { fillColor: [126, 34, 206] }, // purple-700
  });

  doc.save(`liste_membres_${new Date().toISOString().split('T')[0]}.pdf`);
};

export const generateUsersCSV = (users: any[]) => {
  const headers = ["Nom", "Email", "Téléphone", "Rôle", "Total Dépensé (FCFA)"];
  const rows = users.map(u => [
    u.name,
    u.email,
    u.phone || "",
    u.role,
    u.totalSpent || 0
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map(r => r.join(","))
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `utilisateurs_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
