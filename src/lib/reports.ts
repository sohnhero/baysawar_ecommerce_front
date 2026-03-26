import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generateDashboardReport = (stats: any, topProducts: any[], recentOrders: any[], timeRange: string) => {
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
  doc.text("Métriques Clés", 15, 55);

  const metricsData = [
    ["Total Ventes", `${stats?.totalRevenue?.toLocaleString() || 0} FCFA`],
    ["Commandes", `${stats?.totalOrders || 0}`],
    ["Produits", `${stats?.totalProducts || 0}`],
    ["Membres", `${stats?.totalUsers || 0}`]
  ];

  autoTable(doc, {
    startY: 60,
    head: [["Indicateur", "Valeur"]],
    body: metricsData,
    theme: "striped",
    headStyles: { fillColor: [11, 159, 11] }, // brand-green
  });

  // Top Products
  const finalY = (doc as any).lastAutoTable.finalY + 15;
  doc.text("Top Produits", 15, finalY);

  const productData = topProducts.map(p => [
    p.name,
    p.category || "N/A",
    `${parseFloat(p.price).toLocaleString()} FCFA`,
    p.orderCount || 0
  ]);

  autoTable(doc, {
    startY: finalY + 5,
    head: [["Nom", "Catégorie", "Prix", "Ventes"]],
    body: productData,
    theme: "grid",
    headStyles: { fillColor: [15, 23, 42] },
  });

  // Recent Orders
  const ordersY = (doc as any).lastAutoTable.finalY + 15;
  doc.text("Dernières Activités", 15, ordersY);

  const orderData = recentOrders.map(o => [
    o.id.substring(0, 8).toUpperCase(),
    o.user?.name || "Client",
    new Date(o.createdAt).toLocaleDateString(),
    `${parseFloat(o.totalAmount).toLocaleString()} FCFA`,
    o.status.toUpperCase()
  ]);

  autoTable(doc, {
    startY: ordersY + 5,
    head: [["ID", "Client", "Date", "Montant", "Statut"]],
    body: orderData,
    theme: "striped",
    headStyles: { fillColor: [30, 64, 175] }, // brand-blue
  });

  doc.save(`rapport_baysawarr_${new Date().toISOString().split('T')[0]}.pdf`);
};

export const generateProductsReport = (products: any[]) => {
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

export const generateOrdersReport = (orders: any[]) => {
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
    o.status.toUpperCase()
  ]);

  autoTable(doc, {
    startY: 50,
    head: [["ID", "Client", "Date", "Montant", "Statut"]],
    body: tableData,
    theme: "striped",
    headStyles: { fillColor: [30, 64, 175] },
  });

  doc.save(`rapport_commandes_${new Date().toISOString().split('T')[0]}.pdf`);
};

export const generateUsersReport = (users: any[]) => {
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
