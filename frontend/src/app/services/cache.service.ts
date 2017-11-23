/**
 * This service will be used for application cache
 */
import { Injectable } from '@angular/core';

@Injectable()
export class CacheService {
  private _cache: Map<string, any> = new Map();

  /**
   * check if there is a value in our store
   */
  has(key: string): boolean {
    let _key: string = this.normalizeKey(key);
    return this._cache.has(_key);
  }

  /**
   * store our state
   */
  set(key: string, value: any): void {
    let _key: string = this.normalizeKey(key);
    this._cache.set(_key, value);
  }

  /**
   * get our cached value
   */
  get(key: string): any {
    let _key: string = this.normalizeKey(key);
    return this._cache.get(_key);
  }

  /**
   * release memory refs
   */
  clear(): void {
    this._cache.clear();
  }

  /**
   * release memory refs for perticular entry
   */
  remove(key: string): void {
    let _key: string = this.normalizeKey(key);
    if (this._cache.has(key)) {
      this._cache.delete(_key);
    }
  }

  /**
   * create normalize keys, just return valid keys at the moment
   */
  private normalizeKey(key: string): string {
    if (this.isInvalidValue(key)) {
      throw new Error("Please provide a valid key to save in the CacheService");
    }
    return key;
  }

  private isInvalidValue(key: any): boolean {
    return key === null ||
      key === undefined ||
      key === 0 ||
      key === "" ||
      typeof key === "boolean" ||
      Number.isNaN(<number>key);
  }
}
