
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/storage';
import { PaymentMethod, Merchant } from '@/types';

const PaymentConfigForm = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [merchant, setMerchant] = useState<Merchant | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('mobile');
  
  // Mobile money config
  const [mobileProvider, setMobileProvider] = useState('');
  const [mobileAccount, setMobileAccount] = useState('');
  const [mobileAccountName, setMobileAccountName] = useState('');
  
  // Card config
  const [cardProcessor, setCardProcessor] = useState('');
  const [merchantId, setMerchantId] = useState('');
  const [apiKey, setApiKey] = useState('');
  
  // Bank config
  const [bankName, setBankName] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [bankAccountName, setBankAccountName] = useState('');
  const [routingNumber, setRoutingNumber] = useState('');

  useEffect(() => {
    if (user?.merchantId) {
      const merchantData = db.getMerchantById(user.merchantId);
      if (merchantData) {
        setMerchant(merchantData);
        setPaymentMethod(merchantData.preferredPaymentMethod);
        
        // Load existing config
        if (merchantData.paymentConfig.mobile) {
          setMobileProvider(merchantData.paymentConfig.mobile.provider);
          setMobileAccount(merchantData.paymentConfig.mobile.accountNumber);
          setMobileAccountName(merchantData.paymentConfig.mobile.accountName);
        }
        if (merchantData.paymentConfig.card) {
          setCardProcessor(merchantData.paymentConfig.card.processor);
          setMerchantId(merchantData.paymentConfig.card.merchantId);
          setApiKey(merchantData.paymentConfig.card.apiKey);
        }
        if (merchantData.paymentConfig.bank) {
          setBankName(merchantData.paymentConfig.bank.bankName);
          setBankAccount(merchantData.paymentConfig.bank.accountNumber);
          setBankAccountName(merchantData.paymentConfig.bank.accountName);
          setRoutingNumber(merchantData.paymentConfig.bank.routingNumber);
        }
      }
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!merchant) return;

      const updatedMerchant: Merchant = {
        ...merchant,
        preferredPaymentMethod: paymentMethod,
        paymentConfig: {
          ...merchant.paymentConfig,
          ...(paymentMethod === 'mobile' && {
            mobile: {
              provider: mobileProvider,
              accountNumber: mobileAccount,
              accountName: mobileAccountName,
            }
          }),
          ...(paymentMethod === 'card' && {
            card: {
              processor: cardProcessor,
              merchantId: merchantId,
              apiKey: apiKey,
            }
          }),
          ...(paymentMethod === 'bank' && {
            bank: {
              bankName: bankName,
              accountNumber: bankAccount,
              accountName: bankAccountName,
              routingNumber: routingNumber,
            }
          }),
        }
      };

      db.saveMerchant(updatedMerchant);
      setMerchant(updatedMerchant);

      toast({
        title: "Payment configuration updated",
        description: "Your payment settings have been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update payment configuration.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!merchant) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Configuration</CardTitle>
        <CardDescription>
          Configure your preferred payment method for receiving customer payments
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="paymentMethod">Preferred Payment Method</Label>
            <Select value={paymentMethod} onValueChange={(value: PaymentMethod) => setPaymentMethod(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mobile">Mobile Money</SelectItem>
                <SelectItem value="card">Card Payment</SelectItem>
                <SelectItem value="bank">Bank Transfer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {paymentMethod === 'mobile' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Mobile Money Configuration</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="mobileProvider">Provider</Label>
                  <Select value={mobileProvider} onValueChange={setMobileProvider}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select provider" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="M-Pesa">M-Pesa</SelectItem>
                      <SelectItem value="Airtel Money">Airtel Money</SelectItem>
                      <SelectItem value="T-Kash">T-Kash</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mobileAccount">Account Number</Label>
                  <Input
                    id="mobileAccount"
                    value={mobileAccount}
                    onChange={(e) => setMobileAccount(e.target.value)}
                    placeholder="+254700123456"
                    required
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="mobileAccountName">Account Name</Label>
                  <Input
                    id="mobileAccountName"
                    value={mobileAccountName}
                    onChange={(e) => setMobileAccountName(e.target.value)}
                    placeholder="Business Name"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {paymentMethod === 'card' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Card Payment Configuration</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cardProcessor">Processor</Label>
                  <Select value={cardProcessor} onValueChange={setCardProcessor}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select processor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Stripe">Stripe</SelectItem>
                      <SelectItem value="PayPal">PayPal</SelectItem>
                      <SelectItem value="Flutterwave">Flutterwave</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="merchantId">Merchant ID</Label>
                  <Input
                    id="merchantId"
                    value={merchantId}
                    onChange={(e) => setMerchantId(e.target.value)}
                    placeholder="merchant_12345"
                    required
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="apiKey">API Key</Label>
                  <Input
                    id="apiKey"
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="sk_test_..."
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {paymentMethod === 'bank' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Bank Transfer Configuration</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bankName">Bank Name</Label>
                  <Input
                    id="bankName"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    placeholder="Kenya Commercial Bank"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bankAccount">Account Number</Label>
                  <Input
                    id="bankAccount"
                    value={bankAccount}
                    onChange={(e) => setBankAccount(e.target.value)}
                    placeholder="1234567890"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bankAccountName">Account Name</Label>
                  <Input
                    id="bankAccountName"
                    value={bankAccountName}
                    onChange={(e) => setBankAccountName(e.target.value)}
                    placeholder="Business Name Ltd"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="routingNumber">Branch Code</Label>
                  <Input
                    id="routingNumber"
                    value={routingNumber}
                    onChange={(e) => setRoutingNumber(e.target.value)}
                    placeholder="001"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Saving...' : 'Save Configuration'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PaymentConfigForm;
