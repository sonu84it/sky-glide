const fs = require('fs');
const path = require('path');

test('squirrel image path is local', () => {
  const css = fs.readFileSync(path.join(__dirname, 'style.css'), 'utf8');
  expect(css).toMatch(/background:\s*url\('assets\/squirrel_right\.svg'\)/);
});
