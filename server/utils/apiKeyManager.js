class ApiKeyManager {
  constructor(apiKeys) {
    this.apiKeys = apiKeys.filter(key => key && key.trim() !== '');
    this.currentIndex = 0;
    this.keyStatus = new Map();
    
    // Initialize all keys as available
    this.apiKeys.forEach(key => {
      this.keyStatus.set(key, {
        isBlocked: false,
        blockedUntil: null,
        requestCount: 0,
        lastUsed: null
      });
    });
  }

  getCurrentKey() {
    if (this.apiKeys.length === 0) {
      throw new Error('No API keys available');
    }

    // Find next available key starting from current index
    let attempts = 0;
    while (attempts < this.apiKeys.length) {
      const key = this.apiKeys[this.currentIndex];
      const status = this.keyStatus.get(key);
      
      // Check if key is available (not blocked or block period expired)
      if (!status.isBlocked || (status.blockedUntil && Date.now() > status.blockedUntil)) {
        if (status.isBlocked && Date.now() > status.blockedUntil) {
          // Unblock the key
          status.isBlocked = false;
          status.blockedUntil = null;
        }
        
        status.lastUsed = Date.now();
        status.requestCount++;
        return key;
      }
      
      // Move to next key
      this.currentIndex = (this.currentIndex + 1) % this.apiKeys.length;
      attempts++;
    }
    
    // All keys are blocked, return current key anyway (last resort)
    return this.apiKeys[this.currentIndex];
  }

  markKeyAsBlocked(key, blockDurationMinutes = 60) {
    const status = this.keyStatus.get(key);
    if (status) {
      status.isBlocked = true;
      status.blockedUntil = Date.now() + (blockDurationMinutes * 60 * 1000);
      // Move to next key
      this.rotateToNextKey();
    }
  }

  rotateToNextKey() {
    this.currentIndex = (this.currentIndex + 1) % this.apiKeys.length;
  }

  maskKey(key) {
    if (!key || key.length < 8) return '*';
    return key.substring(0, 4) + '*' + key.substring(key.length - 4);
  }

  getStatus() {
    const status = {
      totalKeys: this.apiKeys.length,
      currentIndex: this.currentIndex,
      keys: []
    };

    this.apiKeys.forEach((key, index) => {
      const keyStatus = this.keyStatus.get(key);
      status.keys.push({
        index,
        masked: this.maskKey(key),
        isBlocked: keyStatus.isBlocked,
        blockedUntil: keyStatus.blockedUntil,
        requestCount: keyStatus.requestCount,
        lastUsed: keyStatus.lastUsed,
        isCurrent: index === this.currentIndex
      });
    });

    return status;
  }

  // Reset all blocked keys (useful for testing or manual reset)
  resetAllKeys() {
    this.apiKeys.forEach(key => {
      const status = this.keyStatus.get(key);
      status.isBlocked = false;
      status.blockedUntil = null;
    });
  }
}

export default ApiKeyManager;