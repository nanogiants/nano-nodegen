import axios, { AxiosInstance } from 'axios';

class Client {
  private client: AxiosInstance;
  constructor() {
    this.client = axios.create({
      baseURL: 'https://api.github.com',
    });
  }

  async getLicenses() {
    const { data } = await this.client.get('licenses');
    return data;
  }

  async getLicense(key: string) {
    const { data } = await this.client.get(`licenses/${key}`);
    return data;
  }
}

export const GithubClient = new Client();
