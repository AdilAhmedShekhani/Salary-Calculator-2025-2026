let report = {};

function calculateTax() {
  const name = document.getElementById("name").value.trim();
  const ms = parseFloat(document.getElementById("salary").value);
  const jm = parseInt(document.getElementById("joining").value);
  if (!name || isNaN(ms) || ms <= 0) return alert("Enter valid inputs");

  const months = 7 - jm + (jm <= 6 ? 0 : 12);
  const annual = ms * months;

  let tax = 0;
  if (annual <= 600000) tax = 0;
  else if (annual <= 1200000) tax = (annual - 600000) * 0.01;
  else if (annual <= 2200000) tax = 6000 + (annual - 1200000) * 0.11;
  else if (annual <= 3200000) tax = 116000 + (annual - 2200000) * 0.23;
  else if (annual <= 4100000) tax = 346000 + (annual - 3200000) * 0.3;
  else tax = 616000 + (annual - 4100000) * 0.35;

  const monthlyTax = tax / months;
  const monthlySalaryAfterTax = ms - monthlyTax;

  report = { name, ms, jm, months, annual, tax, monthlyTax, monthlySalaryAfterTax };

  document.getElementById("resultArea").innerHTML = `
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Monthly Salary:</strong> Rs. ${ms.toLocaleString()}</p>
    <p><strong>Joining Month:</strong> ${getMonth(jm)}</p>
    <p><strong>Months Worked:</strong> ${months}</p>
    <p><strong>Annual Salary:</strong> Rs. ${annual.toLocaleString()}</p>
    <p><strong>Total Tax:</strong> Rs. ${tax.toFixed(2).toLocaleString()}</p>
    <p><strong>Monthly Tax Deduction:</strong> Rs. ${monthlyTax.toFixed(2).toLocaleString()}</p>
    <p><strong>Monthly Salary After Tax:</strong> Rs. ${monthlySalaryAfterTax.toFixed(2).toLocaleString()}</p>
  `;
  document.getElementById("output").style.display = "block";
  document.getElementById("msg").innerText = "";
}

function getMonth(m) {
  return [
    "",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ][m];
}

async function downloadPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  try {
    doc.setFontSize(16);
    doc.text("Tax Report – Adil Ahmed Shekhani", 20, 20);
    const r = report;
    let y = 40;
    doc.setFontSize(12);
    doc.text(`Name: ${r.name}`, 20, y); y += 10;
    doc.text(`Monthly Salary: Rs. ${r.ms.toLocaleString()}`, 20, y); y += 10;
    doc.text(`Joining Month: ${getMonth(r.jm)}`, 20, y); y += 10;
    doc.text(`Months Worked: ${r.months}`, 20, y); y += 10;
    doc.text(`Annual Salary: Rs. ${r.annual.toLocaleString()}`, 20, y); y += 10;
    doc.text(`Total Tax: Rs. ${r.tax.toFixed(2).toLocaleString()}`, 20, y); y += 10;
    doc.text(`Monthly Tax Deduction: Rs. ${r.monthlyTax.toFixed(2).toLocaleString()}`, 20, y); y += 10;
    doc.text(`Monthly Salary After Tax: Rs. ${r.monthlySalaryAfterTax.toFixed(2).toLocaleString()}`, 20, y); y += 20;
    doc.setTextColor("#0077b5");
    doc.textWithLink("Made by Adil Ahmed Shekhani", 20, y, {
      url: "https://pk.linkedin.com/in/adilahmedshekhani",
    });
    doc.save("Tax_Report.pdf");
    document.getElementById("msg").innerText = "✅ PDF downloaded";
  } catch (e) {
    alert("❌ Error generating PDF.");
    console.error(e);
  }
}

function exportExcel() {
  const r = report;
  const wb = XLSX.utils.book_new();
  const data = [
    ["Field", "Value", "Formula"],
    ["Name", r.name, ""],
    ["Monthly Salary", r.ms, ""],
    ["Joining Month", getMonth(r.jm), ""],
    ["Months Worked", r.months, ""],
    ["Annual Salary", r.annual, `=B2*B4`],
    ["Total Tax", r.tax, ""],
    ["Monthly Tax Deduction", r.monthlyTax, `=B6/B4`],
    ["Monthly Salary After Tax", r.monthlySalaryAfterTax, `=B2-B7`],
  ];
  const ws = XLSX.utils.aoa_to_sheet(data);
  XLSX.utils.book_append_sheet(wb, ws, "TaxReport");
  XLSX.writeFile(wb, "Tax_Report.xlsx");
  document.getElementById("msg").innerText = "✅ Excel downloaded";
}

function sendByEmail() {
  const r = report;
  const body = `
Name: ${r.name}
Monthly Salary: Rs. ${r.ms.toLocaleString()}
Joining Month: ${getMonth(r.jm)}
Months Worked: ${r.months}
Annual Salary: Rs. ${r.annual.toLocaleString()}
Total Tax: Rs. ${r.tax.toFixed(2).toLocaleString()}
Monthly Tax Deduction: Rs. ${r.monthlyTax.toFixed(2).toLocaleString()}
Monthly Salary After Tax: Rs. ${r.monthlySalaryAfterTax.toFixed(2).toLocaleString()}

Made by Adil Ahmed Shekhani – https://pk.linkedin.com/in/adilahmedshekhani
  `;
  window.location.href = `mailto:?subject=Tax Report for ${r.name}&body=${encodeURIComponent(body)}`;
}