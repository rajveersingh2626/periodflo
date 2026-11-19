import { Hono } from 'hono';

export interface RendezvousEntry {
  mailboxId: string;
  publicKey: string;
  expiresAt: number;
}

export class RelayServer {
  private rendezvousMap: Map<string, RendezvousEntry> = new Map();
  private mailboxes: Map<string, string> = new Map(); // mailboxId -> encryptedBlob
  private attemptCounts: Map<string, number> = new Map(); // ip/client -> failed count
  private readonly TTL_MS = 10 * 60 * 1000; // 10 minutes

  /**
   * Registers a 6-character code with ephemeral public key & mailbox
   */
  public registerRendezvous(
    code: string,
    entry: { mailboxId: string; publicKey: string }
  ): boolean {
    this.cleanExpired();
    this.rendezvousMap.set(code.toUpperCase(), {
      mailboxId: entry.mailboxId,
      publicKey: entry.publicKey,
      expiresAt: Date.now() + this.TTL_MS,
    });
    return true;
  }

  /**
   * Claims and consumes a rendezvous pairing package
   */
  public claimRendezvous(code: string): { mailboxId: string; publicKey: string } | null {
    this.cleanExpired();
    const upper = code.toUpperCase();
    const entry = this.rendezvousMap.get(upper);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.rendezvousMap.delete(upper);
      return null;
    }

    // Single-use: once claimed, delete rendezvous record
    this.rendezvousMap.delete(upper);
    return {
      mailboxId: entry.mailboxId,
      publicKey: entry.publicKey,
    };
  }

  /**
   * Checks if a client is rate limited (3 or more failed attempts)
   */
  public isRateLimited(clientIdentifier: string): boolean {
    const current = this.attemptCounts.get(clientIdentifier) || 0;
    return current >= 3;
  }

  /**
   * Records a failed pairing attempt for rate limiting
   */
  public recordFailedAttempt(clientIdentifier: string): void {
    const current = this.attemptCounts.get(clientIdentifier) || 0;
    this.attemptCounts.set(clientIdentifier, current + 1);
  }

  /**
   * Blind mailbox post: stores pure encrypted blob
   */
  public postMailbox(mailboxId: string, encryptedBlob: string): void {
    this.mailboxes.set(mailboxId, encryptedBlob);
  }

  /**
   * Blind mailbox get: retrieves encrypted blob
   */
  public getMailbox(mailboxId: string): string | null {
    return this.mailboxes.get(mailboxId) || null;
  }

  private cleanExpired(): void {
    const now = Date.now();
    for (const [code, entry] of this.rendezvousMap.entries()) {
      if (now > entry.expiresAt) {
        this.rendezvousMap.delete(code);
      }
    }
  }
}

export const relayServer = new RelayServer();

/**
 * Creates and configures the Hono HTTP Server for Cloudflare Workers / Node.js
 */
export function createRelayApp(serverInstance: RelayServer = relayServer): Hono {
  const app = new Hono();

  // Register ephemeral rendezvous
  app.post('/rendezvous', async (c) => {
    try {
      const body = await c.req.json();
      if (!body.code || !body.mailboxId || !body.publicKey) {
        return c.json({ error: 'Missing code, mailboxId, or publicKey' }, 400);
      }
      serverInstance.registerRendezvous(body.code, {
        mailboxId: body.mailboxId,
        publicKey: body.publicKey,
      });
      return c.json({ success: true, ttlMinutes: 10 });
    } catch {
      return c.json({ error: 'Invalid JSON payload' }, 400);
    }
  });

  // Claim rendezvous pairing code
  app.get('/rendezvous/:code', (c) => {
    const code = c.req.param('code');
    const clientId = c.req.header('x-forwarded-for') || 'local-client';

    if (serverInstance.isRateLimited(clientId)) {
      return c.json({ error: 'Too many failed pairing attempts. Please wait.' }, 429);
    }

    const claimed = serverInstance.claimRendezvous(code);
    if (!claimed) {
      serverInstance.recordFailedAttempt(clientId);
      return c.json({ error: 'Code not found, expired, or already claimed.' }, 404);
    }

    return c.json(claimed);
  });

  // Post blind ciphertext to mailbox
  app.post('/mailbox/:id', async (c) => {
    const mailboxId = c.req.param('id');
    try {
      const body = await c.req.json();
      if (!body.ciphertext) {
        return c.json({ error: 'Missing ciphertext blob' }, 400);
      }
      serverInstance.postMailbox(mailboxId, body.ciphertext);
      return c.json({ success: true });
    } catch {
      return c.json({ error: 'Invalid payload' }, 400);
    }
  });

  // Get blind ciphertext from mailbox
  app.get('/mailbox/:id', (c) => {
    const mailboxId = c.req.param('id');
    const blob = serverInstance.getMailbox(mailboxId);
    if (!blob) {
      return c.json({ error: 'Mailbox empty or not found' }, 404);
    }
    return c.json({ ciphertext: blob });
  });

  return app;
}
