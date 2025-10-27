import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import PaymentService from '@/services/paymentService';
import { PaymentHistory } from '@/lib/mockData';
import { formatDate, formatCurrency } from '@/lib/utils';

export default function PaymentsScreen() {
  const [payments, setPayments] = useState<PaymentHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showPricing, setShowPricing] = useState(false);

  const pricing = PaymentService.getPaymentPricing();
  const paymentMethods = PaymentService.getPaymentMethods();

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      const data = await PaymentService.getPaymentHistory();
      setPayments(data);
    } catch (error) {
      console.error('Error loading payments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPayments();
    setRefreshing(false);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'success': return 'success';
      case 'pending': return 'warning';
      case 'failed': return 'destructive';
      default: return 'secondary';
    }
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen text="Loading payments..." />;
  }

  return (
    <View className="flex-1 bg-background">
      {/* Toggle Button */}
      <View className="bg-card border-b border-border px-4 py-3">
        <View className="flex-row">
          <TouchableOpacity
            onPress={() => setShowPricing(false)}
            className={`flex-1 py-2 ${
              !showPricing ? 'border-b-2 border-primary' : ''
            }`}
          >
            <Text
              className={`text-center font-semibold ${
                !showPricing ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Payment History
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setShowPricing(true)}
            className={`flex-1 py-2 ${
              showPricing ? 'border-b-2 border-primary' : ''
            }`}
          >
            <Text
              className={`text-center font-semibold ${
                showPricing ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Pricing Plans
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#22c55e']} />
        }
      >
        {showPricing ? (
          // Pricing Plans View
          <View className="p-4">
            <Text className="text-2xl font-bold text-foreground mb-2">
              Job Listing Plans
            </Text>
            <Text className="text-muted-foreground mb-6">
              Choose the best plan for your hiring needs
            </Text>

            {Object.entries(pricing).map(([key, plan]) => (
              <Card key={key} className="mb-4">
                <CardHeader>
                  <View className="flex-row justify-between items-center">
                    <Text className="text-xl font-bold text-foreground capitalize">
                      {key} Plan
                    </Text>
                    <Badge variant="default">
                      {formatCurrency(plan.amount)}
                    </Badge>
                  </View>
                </CardHeader>
                <CardContent>
                  {plan.features.map((feature, index) => (
                    <View key={index} className="flex-row items-start mb-2">
                      <Text className="text-primary mr-2">✓</Text>
                      <Text className="text-foreground flex-1">{feature}</Text>
                    </View>
                  ))}
                  <Button className="mt-4">
                    Choose {key}
                  </Button>
                </CardContent>
              </Card>
            ))}

            {/* Payment Methods */}
            <Card className="mt-4">
              <CardHeader>
                <Text className="text-lg font-semibold text-foreground">
                  Accepted Payment Methods
                </Text>
              </CardHeader>
              <CardContent>
                {paymentMethods.map(method => (
                  <View
                    key={method.id}
                    className="flex-row items-center justify-between py-3 border-b border-border"
                  >
                    <Text className="text-foreground">{method.name}</Text>
                    <Badge variant={method.available ? 'success' : 'secondary'}>
                      {method.available ? 'Available' : 'Coming Soon'}
                    </Badge>
                  </View>
                ))}
              </CardContent>
            </Card>
          </View>
        ) : (
          // Payment History View
          <View className="p-4">
            {payments.length === 0 ? (
              <EmptyState
                title="No payment history"
                description="Your payment transactions will appear here"
              />
            ) : (
              payments.map(payment => (
                <Card key={payment.id} className="mb-4">
                  <CardContent className="pt-4">
                    <View className="flex-row justify-between items-start mb-3">
                      <View className="flex-1">
                        <Text className="text-lg font-bold text-foreground mb-1">
                          {formatCurrency(payment.amount, payment.currency)}
                        </Text>
                        <Text className="text-sm text-muted-foreground">
                          {payment.description}
                        </Text>
                      </View>
                      <Badge variant={getStatusBadgeVariant(payment.status)}>
                        {payment.status}
                      </Badge>
                    </View>

                    {payment.jobTitle && (
                      <Text className="text-sm text-foreground mb-2">
                        Job: {payment.jobTitle}
                      </Text>
                    )}

                    <View className="flex-row justify-between">
                      <Text className="text-xs text-muted-foreground">
                        {formatDate(payment.createdAt)}
                      </Text>
                      <Text className="text-xs text-muted-foreground">
                        Ref: {payment.reference}
                      </Text>
                    </View>

                    {payment.paymentMethod && (
                      <Text className="text-xs text-muted-foreground mt-1">
                        via {payment.paymentMethod}
                      </Text>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}


