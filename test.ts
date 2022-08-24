import { createHash, randomBytes } from 'crypto';
import { v1 } from 'uuid';
const a = createHash('sha256').update(v1()).digest('hex');
console.log(a);
const b = randomBytes(4).toString('hex') + Date.now().toString(18);
console.log(b.toUpperCase());
