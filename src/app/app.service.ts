import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as CryptoJS from 'crypto-js';

@Injectable()
export class AppService {
    
    public validatorsList:any = {};
    public validatorsListKey:string = 'validatorsData@energyweb#1141';

    constructor(private  httpClient:HttpClient) {
        let decryptedData = CryptoJS.AES.decrypt('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', this.validatorsListKey)        
        if (decryptedData) {
            let decryptedValidators = JSON.parse(decryptedData.toString(CryptoJS.enc.Utf8)).validators;
            if (decryptedValidators.length > 0){
                let genesisValidator: any = decryptedValidators[0];
                decryptedValidators.shift();
                decryptedValidators.sort(this.getSortOrder());
                decryptedValidators.unshift(genesisValidator)
                this.validatorsList = decryptedValidators;   
            }
        }        
    }

    public retrieveValidators(): any {
        let promise = new Promise(function(resolve, reject) {            
            if (this.validatorsList){                
                resolve(this.validatorsList);
            } else {
                reject();
            }
        }.bind(this));          
        return promise;
    }

    private getSortOrder() {        
        return function(a, b) {    
            if (a['name'] > b['name']) {    
                return 1;    
            } else if (a['name'] < b['name']) {    
                return -1;    
            }    
            return 0;    
        }    
    }

}
