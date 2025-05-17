import { ethers } from 'ethers';
import SocialPayments from "./SocialPaymentsTab.json"

interface ContractEvent {
    event: string;
    args: {
        tabId?: ethers.BigNumber;
        paymentRequestId?: ethers.BigNumber;
        [key: string]: any;
    };
}

interface ContractABI {
    abi: ethers.ContractInterface;
}

export class BlockchainService {
    private provider: ethers.providers.Web3Provider;
    private signer: ethers.Signer;
    private contract: ethers.Contract;
    private contractAddress: string;

    constructor(provider: ethers.providers.Web3Provider, contractAddress: string) {
        this.provider = provider;
        this.signer = provider.getSigner();
        this.contractAddress = contractAddress;
        this.contract = new ethers.Contract(
            contractAddress,
            SocialPayments as unknown as ethers.ContractInterface,
            this.signer
        );
    }

    // Tab Management Functions
    async createTab(name: string): Promise<number> {
        try {
            const tx = await this.contract.createTab(name);
            const receipt = await tx.wait();
            const event = receipt.events?.find((e: ContractEvent) => e.event === 'TabCreated');
            return event?.args?.tabId?.toNumber() || 0;
        } catch (error) {
            console.error('Error creating tab:', error);
            throw error;
        }
    }

    async addMember(tabId: number, memberAddress: string): Promise<void> {
        try {
            const tx = await this.contract.addMember(tabId, memberAddress);
            await tx.wait();
        } catch (error) {
            console.error('Error adding member:', error);
            throw error;
        }
    }

    async removeMember(tabId: number, memberAddress: string): Promise<void> {
        try {
            const tx = await this.contract.removeMember(tabId, memberAddress);
            await tx.wait();
        } catch (error) {
            console.error('Error removing member:', error);
            throw error;
        }
    }

    // Expense Management Functions
    async addExpense(
        tabId: number,
        amount: string,
        description: string,
        beneficiaries: string[]
    ): Promise<void> {
        try {
            const tx = await this.contract.addExpense(
                tabId,
                ethers.utils.parseEther(amount),
                description,
                beneficiaries,
                { value: ethers.utils.parseEther(amount) }
            );
            await tx.wait();
        } catch (error) {
            console.error('Error adding expense:', error);
            throw error;
        }
    }

    // Payment Request Functions
    async createPaymentRequest(
        tabId: number,
        recipient: string,
        amount: string
    ): Promise<number> {
        try {
            const tx = await this.contract.createPaymentRequest(
                tabId,
                recipient,
                ethers.utils.parseEther(amount)
            );
            const receipt = await tx.wait();
            const event = receipt.events?.find((e: ContractEvent) => e.event === 'PaymentRequestCreated');
            return event?.args?.paymentRequestId?.toNumber() || 0;
        } catch (error) {
            console.error('Error creating payment request:', error);
            throw error;
        }
    }

    async payPaymentRequest(tabId: number, requestId: number): Promise<void> {
        try {
            const tx = await this.contract.payPaymentRequest(tabId, requestId);
            await tx.wait();
        } catch (error) {
            console.error('Error paying payment request:', error);
            throw error;
        }
    }

    // Stream Management Functions
    async setupStream(
        tabId: number,
        recipient: string,
        amountPerSecond: string,
        durationSeconds: number
    ): Promise<void> {
        try {
            const tx = await this.contract.setupStream(
                tabId,
                recipient,
                ethers.utils.parseEther(amountPerSecond),
                durationSeconds
            );
            await tx.wait();
        } catch (error) {
            console.error('Error setting up stream:', error);
            throw error;
        }
    }

    async releaseStream(tabId: number): Promise<void> {
        try {
            const tx = await this.contract.releaseStream(tabId);
            await tx.wait();
        } catch (error) {
            console.error('Error releasing stream:', error);
            throw error;
        }
    }

    async cancelStream(tabId: number): Promise<void> {
        try {
            const tx = await this.contract.cancelStream(tabId);
            await tx.wait();
        } catch (error) {
            console.error('Error cancelling stream:', error);
            throw error;
        }
    }

    // View Functions
    async getTab(tabId: number): Promise<{
        name: string;
        creator: string;
        balance: string;
        memberCount: number;
        isActive: boolean;
    }> {
        try {
            const [name, creator, balance, memberCount, isActive] = await this.contract.getTab(tabId);
            return {
                name,
                creator,
                balance: ethers.utils.formatEther(balance),
                memberCount: memberCount.toNumber(),
                isActive
            };
        } catch (error) {
            console.error('Error getting tab:', error);
            throw error;
        }
    }

    async getTabMembers(tabId: number): Promise<string[]> {
        try {
            return await this.contract.getTabMembers(tabId);
        } catch (error) {
            console.error('Error getting tab members:', error);
            throw error;
        }
    }

    async getUserTabs(userAddress: string): Promise<number[]> {
        try {
            const tabIds = await this.contract.getUserTabs(userAddress);
            return tabIds.map((id: ethers.BigNumber) => id.toNumber());
        } catch (error) {
            console.error('Error getting user tabs:', error);
            throw error;
        }
    }

    // Helper function to get contract instance
    getContract(): ethers.Contract {
        return this.contract;
    }
}