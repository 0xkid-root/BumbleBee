export interface SmartAccount {
  id: string;
  name: string;
  address: string;
  balance: string;
  type: 'EOA' | 'Smart';
}