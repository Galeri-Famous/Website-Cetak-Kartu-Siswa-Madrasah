
import fetch from 'node-fetch';
import { JSDOM } from 'jsdom';

export default async function handler(req, res) {
  const { nisn } = req.query;
  if (!nisn) return res.status(400).json({ error: 'NISN is required' });

  try {
    const url = `https://nisn.data.kemdikbud.go.id/index.php/Cindex/formcaribynisn?nisn=${nisn}&submit=Search`;
    const response = await fetch(url);
    const html = await response.text();
    const dom = new JSDOM(html);
    const document = dom.window.document;
    const dataRows = Array.from(document.querySelectorAll(".table-bordered tr"));
    const data = {};
    dataRows.forEach(row => {
      const cells = row.querySelectorAll('td');
      if (cells.length === 2) {
        const label = cells[0].textContent.trim();
        const value = cells[1].textContent.trim();
        if (label.includes('Nama')) data.nama = value;
        if (label.includes('Tempat Lahir')) data.ttl = value;
        if (label.includes('Jenis Kelamin')) data.jk = value;
        if (label.includes('Alamat')) data.alamat = value;
      }
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil data dari Kemendikbud' });
  }
}
