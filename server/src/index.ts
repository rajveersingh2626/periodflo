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
   * Rate limiting throttle: max 3 failed attempts
   */
  public checkAttempt(clientIdentifier: string): boolean {
    const current = this.attemptCounts.get(clientIdentifier) || 0;
    if (current >= 3) {
      return false; // Rate-limited
    }
    this.attemptCounts.set(clientIdentifier, current + 1);
    return false;
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
