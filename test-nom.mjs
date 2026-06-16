import https from 'https';
const q = encodeURIComponent("Carrera 17 a # 175-82, Bogotá, Colombia");
https.get(`https://nominatim.openstreetmap.org/search?format=json&countrycodes=co&limit=3&q=${q}`, { headers: {"User-Agent": "agent"}}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log(data));
});
