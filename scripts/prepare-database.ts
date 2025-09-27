import { spawnSync } from 'node:child_process';

const rawProvider = (
  process.env.DATABASE_PROVIDER || 'postgresql'
).toLowerCase();
const provider = rawProvider === 'postgres' ? 'postgresql' : rawProvider;

if (!['postgresql', 'sqlite'].includes(provider)) {
  throw new Error(
    `Unsupported DATABASE_PROVIDER "${rawProvider}". Use "postgresql" or "sqlite".`
  );
}

// Ensure downstream Prisma commands see the normalized value.
process.env.DATABASE_PROVIDER = provider;

function run(command: string, args: string[]) {
  const result = spawnSync(command, args, {
    stdio: 'inherit',
    env: process.env,
  });

  if (result.status !== 0) {
    throw new Error(`Command failed: ${command} ${args.join(' ')}`);
  }
}

console.log(`[database] Using provider: ${provider}`);

console.log('[database] Generating Prisma client');
run('bunx', ['prisma', 'generate']);

if (provider === 'sqlite') {
  console.log('[database] Applying schema with prisma db push (SQLite)');
  run('bunx', ['prisma', 'db', 'push']);
} else {
  console.log('[database] Applying migrations with prisma migrate deploy');
  run('bunx', ['prisma', 'migrate', 'deploy']);
}
