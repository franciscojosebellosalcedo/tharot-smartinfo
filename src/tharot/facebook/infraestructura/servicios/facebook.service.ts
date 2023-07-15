import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class FacebookService {
  private accessToken = process.env.ACCESS_TOKEN_FACE; //'EAADwaLS6ZBzYBAJKvwVNIvbhZCOW86hFgOX7cAZAksTGLzaKiAweGYBoECDVwU4Ct2OiZC5GLjdQwMEQUCNKYlLXGDamTU46xpgMNfohTXYCgZBwVwfPTE5p0ZCoO1BmzMxrKQuyMpDZBEw7rItaDzZBFQiEdGiZCagZCiWOGLScqK1kDX8uZBq3iDl7uTVDbiI8CMcEGZBOTuKi4UxXutmXZAIQw';
  
  constructor() {
    
  }

  async getPages() {
    const url = `https://graph.facebook.com/v17.0/me/accounts`;
    
    const headers = {
      'Content-Type': 'application/json', 
      'Authorization': `Bearer ${this.accessToken}`, 
    };
    
    const {data:datos} = await axios.get(url, { headers });
    const {data} = datos 
    const response = data.map(item=>{return {name:item.name, id:item.id, toke:item.access_token}})
    if (data) {
      return response;
    }    
    return response;
  }

  async getLeadgenForms(pageId: string, tokenPage:string) {
    const url = `https://graph.facebook.com/v17.0/${pageId}/leadgen_forms`;
    
    const headers = {
      'Content-Type': 'application/json', 
      'Authorization': `Bearer ${tokenPage}`, 
    };
    
    const {data:datos} = await axios.get(url, { headers });
    const {data} = datos 
    //const response = data.map(item=>{return {name:item.name, id:item.id, toke:item.access_token}})
    if (data) {
      return data;
    }    
    return data;
  }

  async getLeads(formId: string) {
    const url = `https://graph.facebook.com/v17.0/${formId}/leads`;
    
    const headers = {
      'Content-Type': 'application/json', 
      'Authorization': `Bearer ${this.accessToken}`,
    };
    
    const {data:datos} = await axios.get(url, { headers });
    const {data} = datos 
    if (data) {
      return data;
    }    
    return data;
  }
}
