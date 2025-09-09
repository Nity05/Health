"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Activity, Brain, Target, Zap, AlertTriangle, BarChart3 } from "lucide-react"

// Mock ML analytics data
const modelPerformanceData = [
  { month: "Jan", accuracy: 91.2, precision: 89.5, recall: 87.3, f1Score: 88.4 },
  { month: "Feb", accuracy: 92.1, precision: 90.2, recall: 88.1, f1Score: 89.1 },
  { month: "Mar", accuracy: 93.4, precision: 91.8, recall: 89.7, f1Score: 90.7 },
  { month: "Apr", accuracy: 94.1, precision: 92.5, recall: 90.4, f1Score: 91.4 },
  { month: "May", accuracy: 94.8, precision: 93.2, recall: 91.1, f1Score: 92.1 },
  { month: "Jun", accuracy: 94.2, precision: 92.8, recall: 90.8, f1Score: 91.8 },
]

const featureImportanceData = [
  { feature: "HbA1c Level", importance: 0.24, category: "Lab Values" },
  { feature: "Medication Adherence", importance: 0.19, category: "Behavioral" },
  { feature: "Previous Hospitalizations", importance: 0.16, category: "History" },
  { feature: "Age", importance: 0.12, category: "Demographics" },
  { feature: "BMI", importance: 0.11, category: "Vitals" },
  { feature: "Blood Pressure", importance: 0.09, category: "Vitals" },
  { feature: "Comorbidities", importance: 0.09, category: "Medical" },
]

const riskDistributionData = [
  { name: "Low Risk (0-39%)", value: 342, color: "#10b981" },
  { name: "Moderate Risk (40-69%)", value: 189, color: "#f59e0b" },
  { name: "High Risk (70-100%)", value: 87, color: "#ef4444" },
]

const predictionAccuracyData = [
  { timeframe: "24 Hours", accuracy: 96.8, predictions: 1247 },
  { timeframe: "7 Days", accuracy: 94.2, predictions: 8934 },
  { timeframe: "30 Days", accuracy: 91.5, predictions: 12456 },
  { timeframe: "90 Days", accuracy: 87.3, predictions: 15678 },
]

// Placeholder function for future API integration
async function fetchMLAnalytics() {
  return new Promise((resolve) => {
    setTimeout(
      () =>
        resolve({
          modelPerformance: modelPerformanceData,
          featureImportance: featureImportanceData,
          riskDistribution: riskDistributionData,
          predictionAccuracy: predictionAccuracyData,
        }),
      800,
    )
  })
}

export default function MLAnalytics() {
  const [analyticsData, setAnalyticsData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMLAnalytics().then((data) => {
      setAnalyticsData(data)
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Brain className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
          <div className="text-lg">Loading ML Analytics...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <Activity className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-foreground">CarePredict AI</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost">Dashboard</Button>
              </Link>
              
              <Link href="/analytics">
                <Button variant="default">ML Analytics</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Brain className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">ML Analytics Dashboard</h1>
              <p className="text-muted-foreground">Real-time machine learning model performance and insights</p>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Model Accuracy</CardTitle>
              <Target className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">94.2%</div>
              <p className="text-xs text-muted-foreground">+2.1% from last month</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Predictions Made</CardTitle>
              <Zap className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-700">15,847</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">High-Risk Identified</CardTitle>
              <AlertTriangle className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-700">87</div>
              <p className="text-xs text-muted-foreground">Requiring intervention</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Model Confidence</CardTitle>
              <BarChart3 className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-700">92.8%</div>
              <p className="text-xs text-muted-foreground">Average confidence score</p>
            </CardContent>
          </Card>
        </div>

        
      </div>
    </div>
  )
}
