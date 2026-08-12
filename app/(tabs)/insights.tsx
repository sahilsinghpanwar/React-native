import ListHeading from "@/components/ListHeading";
import { useSubscriptionStore } from "@/lib/subscriptionStore";
import { formatCurrency } from "@/lib/utils";
import { styled } from "nativewind";
import { useMemo } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

const Insights = () => {
  const { subscriptions } = useSubscriptionStore();

  const stats = useMemo(() => {
    let monthlyTotal = 0;
    let yearlyTotal = 0;
    let activeCount = 0;
    let pausedCount = 0;
    let cancelledCount = 0;

    const categoryMap: Record<string, number> = {};
    let highestSub: Subscription | null = null;

    subscriptions.forEach((sub) => {
      const isMonthly =
        sub.billing?.toLowerCase() === "monthly" ||
        sub.frequency === "Monthly";
      const monthlyCost = isMonthly ? sub.price : sub.price / 12;
      const yearlyCost = isMonthly ? sub.price * 12 : sub.price;

      if (sub.status === "active" || !sub.status) {
        activeCount++;
        monthlyTotal += monthlyCost;
        yearlyTotal += yearlyCost;

        const cat = sub.category || "Other";
        categoryMap[cat] = (categoryMap[cat] || 0) + monthlyCost;

        if (!highestSub || sub.price > highestSub.price) {
          highestSub = sub;
        }
      } else if (sub.status === "paused") {
        pausedCount++;
      } else if (sub.status === "cancelled") {
        cancelledCount++;
      }
    });

    const categoryBreakdown = Object.entries(categoryMap)
      .map(([name, amount]) => ({
        name,
        amount,
        percentage:
          monthlyTotal > 0 ? Math.round((amount / monthlyTotal) * 100) : 0,
      }))
      .sort((a, b) => b.amount - a.amount);

    return {
      monthlyTotal,
      yearlyTotal,
      activeCount,
      pausedCount,
      cancelledCount,
      categoryBreakdown,
      highestSub: highestSub as Subscription | null,
    };
  }, [subscriptions]);

  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <Text className="text-3xl font-sans-bold text-primary mb-6">
          Spending Insights
        </Text>

        {/* Overview Banner Card */}
        <View className="bg-accent rounded-3xl p-6 mb-6">
          <Text className="text-sm font-sans-medium text-white/70 uppercase tracking-wider">
            Total Monthly Spend
          </Text>
          <Text className="text-4xl font-sans-extrabold text-white my-2">
            {formatCurrency(stats.monthlyTotal)}
          </Text>
          <View className="flex-row items-center justify-between pt-4 border-t border-white/10">
            <View>
              <Text className="text-xs font-sans-medium text-white/60">
                Annual Estimate
              </Text>
              <Text className="text-lg font-sans-bold text-accent">
                {formatCurrency(stats.yearlyTotal)}/yr
              </Text>
            </View>
            <View className="items-end">
              <Text className="text-xs font-sans-medium text-white/60">
                Active Subscriptions
              </Text>
              <Text className="text-lg font-sans-bold text-white">
                {stats.activeCount} active
              </Text>
            </View>
          </View>
        </View>

        {/* Status Metrics Cards */}
        <View className="flex-row gap-3 mb-6">
          <View className="flex-1 bg-card rounded-2xl p-4 border border-border">
            <Text className="text-2xl font-sans-bold text-success">
              {stats.activeCount}
            </Text>
            <Text className="text-xs font-sans-semibold text-muted-foreground mt-1">
              Active
            </Text>
          </View>
          <View className="flex-1 bg-card rounded-2xl p-4 border border-border">
            <Text className="text-2xl font-sans-bold text-accent">
              {stats.pausedCount}
            </Text>
            <Text className="text-xs font-sans-semibold text-muted-foreground mt-1">
              Paused
            </Text>
          </View>
          <View className="flex-1 bg-card rounded-2xl p-4 border border-border">
            <Text className="text-2xl font-sans-bold text-destructive">
              {stats.cancelledCount}
            </Text>
            <Text className="text-xs font-sans-semibold text-muted-foreground mt-1">
              Cancelled
            </Text>
          </View>
        </View>

        {/* Top Expense Card */}
        {stats.highestSub && (
          <View className="bg-card rounded-2xl p-5 border border-border mb-6">
            <Text className="text-xs font-sans-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Highest Expense
            </Text>
            <View className="flex-row justify-between items-center">
              <View>
                <Text className="text-lg font-sans-bold text-primary">
                  {stats.highestSub.name}
                </Text>
                <Text className="text-xs font-sans-medium text-muted-foreground">
                  {stats.highestSub.category || stats.highestSub.billing}
                </Text>
              </View>
              <Text className="text-xl font-sans-bold text-accent">
                {formatCurrency(
                  stats.highestSub.price,
                  stats.highestSub.currency,
                )}
              </Text>
            </View>
          </View>
        )}

        {/* Category Breakdown */}
        <View className="mb-6">
          <ListHeading title="Category Breakdown" />
          <View className="gap-3 mt-3">
            {stats.categoryBreakdown.length > 0 ? (
              stats.categoryBreakdown.map((cat) => (
                <View
                  key={cat.name}
                  className="bg-card rounded-2xl p-4 border border-border gap-2"
                >
                  <View className="flex-row justify-between items-center">
                    <Text className="text-base font-sans-bold text-primary">
                      {cat.name}
                    </Text>
                    <Text className="text-base font-sans-bold text-primary">
                      {formatCurrency(cat.amount)}/mo ({cat.percentage}%)
                    </Text>
                  </View>
                  <View className="h-2 bg-muted rounded-full overflow-hidden">
                    <View
                      className="h-full bg-accent rounded-full"
                      style={{ width: `${cat.percentage}%` }}
                    />
                  </View>
                </View>
              ))
            ) : (
              <Text className="home-empty-state">
                No active subscription categories.
              </Text>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Insights;
