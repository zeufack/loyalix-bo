import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000/api/v1';

interface ApiClientOptions {
  baseURL?: string;
}

export class ApiClient {
  private baseURL: string;
  private accessToken: string | null = null;

  constructor(options?: ApiClientOptions) {
    this.baseURL = options?.baseURL || API_BASE_URL;
  }

  private async request<T>(
    method: string,
    endpoint: string,
    data?: Record<string, unknown>
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }

    const response = await fetch(url, {
      method,
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error ${response.status}: ${errorText}`);
    }

    // Handle empty responses
    const text = await response.text();
    if (!text) {
      return {} as T;
    }

    return JSON.parse(text) as T;
  }

  // Authentication
  async login(email: string, password: string): Promise<void> {
    const response = await this.request<{ accessToken: string }>(
      'POST',
      '/auth/login',
      { email, password }
    );
    this.accessToken = response.accessToken;
  }

  setAccessToken(token: string): void {
    this.accessToken = token;
  }

  // User operations
  async createUser(data: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }): Promise<{ id: string; email: string }> {
    return this.request('POST', '/users', data);
  }

  async getUser(id: string): Promise<{ id: string; email: string }> {
    return this.request('GET', `/users/${id}`);
  }

  async getUserByEmail(email: string): Promise<{ id: string; email: string } | null> {
    const response = await this.request<{ items: { id: string; email: string }[] }>(
      'GET',
      `/users?search=${encodeURIComponent(email)}&limit=1`
    );
    return response.items?.find((u) => u.email === email) || null;
  }

  async deleteUser(id: string): Promise<void> {
    await this.request('DELETE', `/users/${id}`);
  }

  // Business operations
  async createBusiness(data: {
    name: string;
    description?: string;
  }): Promise<{ id: string; name: string }> {
    return this.request('POST', '/business', data);
  }

  async deleteBusiness(id: string): Promise<void> {
    await this.request('DELETE', `/business/${id}`);
  }

  // Customer operations
  async createCustomer(data: {
    firstName: string;
    lastName: string;
    email: string;
  }): Promise<{ id: string }> {
    return this.request('POST', '/customer', data);
  }

  async deleteCustomer(id: string): Promise<void> {
    await this.request('DELETE', `/customer/${id}`);
  }

  // Generic CRUD operations
  async create<T>(endpoint: string, data: Record<string, unknown>): Promise<T> {
    return this.request('POST', endpoint, data);
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request('GET', endpoint);
  }

  async update<T>(endpoint: string, data: Record<string, unknown>): Promise<T> {
    return this.request('PATCH', endpoint, data);
  }

  async delete(endpoint: string): Promise<void> {
    await this.request('DELETE', endpoint);
  }

  // Cleanup utilities
  async cleanupTestUsers(): Promise<number> {
    let deleted = 0;
    try {
      const response = await this.request<{ items: { id: string; email: string }[] }>(
        'GET',
        '/users?limit=100'
      );
      const testUsers = response.items?.filter((u) =>
        u.email.toLowerCase().includes('e2e-test')
      ) || [];

      for (const user of testUsers) {
        try {
          await this.deleteUser(user.id);
          deleted++;
        } catch (error) {
          console.warn(`Failed to delete user ${user.id}:`, error);
        }
      }
    } catch (error) {
      console.warn('Failed to cleanup test users:', error);
    }
    return deleted;
  }

  async cleanupTestBusinesses(): Promise<number> {
    let deleted = 0;
    try {
      const response = await this.request<{ items: { id: string; name: string }[] }>(
        'GET',
        '/business?limit=100'
      );
      const testBusinesses = response.items?.filter((b) =>
        b.name.toLowerCase().includes('e2e')
      ) || [];

      for (const business of testBusinesses) {
        try {
          await this.deleteBusiness(business.id);
          deleted++;
        } catch (error) {
          console.warn(`Failed to delete business ${business.id}:`, error);
        }
      }
    } catch (error) {
      console.warn('Failed to cleanup test businesses:', error);
    }
    return deleted;
  }

  // Generic cleanup by entity type
  async cleanupByPrefix(
    endpoint: string,
    searchField: string,
    prefix: string
  ): Promise<number> {
    let deleted = 0;
    try {
      const response = await this.request<{ items: { id: string; [key: string]: unknown }[] }>(
        'GET',
        `${endpoint}?limit=100`
      );
      const testItems = response.items?.filter((item) => {
        const fieldValue = item[searchField];
        return typeof fieldValue === 'string' && fieldValue.toLowerCase().includes(prefix.toLowerCase());
      }) || [];

      for (const item of testItems) {
        try {
          await this.delete(`${endpoint}/${item.id}`);
          deleted++;
        } catch (error) {
          console.warn(`Failed to delete ${endpoint}/${item.id}:`, error);
        }
      }
    } catch (error) {
      console.warn(`Failed to cleanup ${endpoint}:`, error);
    }
    return deleted;
  }
}

// Singleton instance for convenience
let apiClientInstance: ApiClient | null = null;

export async function getApiClient(): Promise<ApiClient> {
  if (!apiClientInstance) {
    apiClientInstance = new ApiClient();
    const email = process.env.TEST_USER_EMAIL || 'admin@loyalix.test';
    const password = process.env.TEST_USER_PASSWORD || 'Admin123!@#';
    await apiClientInstance.login(email, password);
  }
  return apiClientInstance;
}
