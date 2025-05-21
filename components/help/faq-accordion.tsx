"use client"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const faqItems = [
  {
    question: "How do I connect my wallet?",
    answer:
      'To connect your wallet, click on the "Connect Wallet" button in the top right corner of the dashboard. You can choose from several wallet providers including MetaMask, WalletConnect, and Coinbase Wallet. Follow the prompts to complete the connection process.',
  },
  {
    question: "How do I send crypto to another address?",
    answer:
      "To send crypto, navigate to the Wallet page, select the asset you want to send, and click the \"Send\" button. Enter the recipient's address, the amount you want to send, and confirm the transaction. You'll need to approve the transaction in your connected wallet.",
  },
  {
    question: "What are the transaction fees?",
    answer:
      "Transaction fees vary depending on the blockchain network and current network congestion. Bumblebee charges a small service fee of 0.1% per transaction, with a minimum of $0.50 and a maximum of $10. Network fees are displayed before you confirm any transaction.",
  },
  {
    question: "How do I set up automated trading strategies?",
    answer:
      'To set up automated trading, go to the Automation section in the sidebar. Click "Create New Strategy" and choose from templates like DCA (Dollar Cost Averaging), limit orders, or custom strategies. Configure your parameters, select assets, and set your risk tolerance. Review and activate your strategy.',
  },
  {
    question: "Is my data secure?",
    answer:
      "Yes, we take security very seriously. Bumblebee uses industry-standard encryption for all data, and we never store your private keys. We use secure connections (HTTPS) for all communications and implement multi-factor authentication. Your funds remain in your control through your connected wallet.",
  },
  {
    question: "How do I get help if I have a problem?",
    answer:
      "If you need assistance, you can use the live chat feature by clicking the chat icon in the bottom right corner. You can also email support@bumblebee.finance or visit our Help Center for detailed guides and tutorials. For urgent matters, premium users have access to priority support via phone.",
  },
  {
    question: "Can I use Bumblebee on my mobile device?",
    answer:
      "Yes, Bumblebee is fully responsive and works on mobile devices. You can access all features through your mobile browser. We also offer dedicated mobile apps for iOS and Android, which you can download from the App Store or Google Play Store.",
  },
  {
    question: "How do I withdraw my funds?",
    answer:
      'To withdraw funds, go to the Wallet section, select the asset you want to withdraw, and click "Withdraw". You can withdraw to a connected bank account, another crypto wallet, or convert to a stablecoin within the platform. Withdrawal times vary depending on the method chosen.',
  },
]

export function FaqAccordion() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Frequently Asked Questions</CardTitle>
        <CardDescription>Find answers to common questions about using Bumblebee Finance.</CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {faqItems.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
              <AccordionContent>
                <p className="text-muted-foreground">{item.answer}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  )
}
