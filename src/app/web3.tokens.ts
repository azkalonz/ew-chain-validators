import { InjectionToken } from '@angular/core';
import Web3 from 'web3';

export const WEB3 = new InjectionToken<Web3>('web3', {
  providedIn: 'root',
  factory: () => {
    try {      
      const provider = new Web3.providers.HttpProvider("https://rpc.energyweb.org/"); 
      return new Web3(provider);
    } catch (err) {
      throw new Error('Non-Ethereum supported browser detected.');
    }
  }
});