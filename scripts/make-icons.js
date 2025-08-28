// Decode base64 icon text files into real PNGs for PWA
const fs = require('fs');
const path = require('path');

const pairs = [
  { src: 'icons/icon-192.b64', out: 'icons/icon-192.png' },
  { src: 'icons/icon-512.b64', out: 'icons/icon-512.png' },
];

fs.mkdirSync('icons', { recursive: true });

for (const { src, out } of pairs) {
  const input = path.resolve(src);
  const output = path.resolve(out);
  const b64 = fs.readFileSync(input, 'utf8').trim();
  const buf = Buffer.from(b64, 'base64');
  fs.writeFileSync(output, buf);
  console.log(`✓ wrote ${out} (${buf.length} bytes)`);
}
