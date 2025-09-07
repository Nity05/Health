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

        <Tabs defaultValue="performance" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="performance">Model Performance</TabsTrigger>
            <TabsTrigger value="features">Feature Analysis</TabsTrigger>
            <TabsTrigger value="predictions">Prediction Insights</TabsTrigger>
            <TabsTrigger value="distribution">Risk Distribution</TabsTrigger>
          </TabsList>

          <TabsContent value="performance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Model Performance Trends</CardTitle>
                <CardDescription>
                  Tracking accuracy, precision, recall, and F1-score over the past 6 months
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={analyticsData.modelPerformance}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis domain={[80, 100]} />
                      <Tooltip />
                      <Line type="monotone" dataKey="accuracy" stroke="#3b82f6" strokeWidth={3} name="Accuracy" />
                      <Line type="monotone" dataKey="precision" stroke="#10b981" strokeWidth={2} name="Precision" />
                      <Line type="monotone" dataKey="recall" stroke="#f59e0b" strokeWidth={2} name="Recall" />
                      <Line type="monotone" dataKey="f1Score" stroke="#8b5cf6" strokeWidth={2} name="F1-Score" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Prediction Accuracy by Timeframe</CardTitle>
                  <CardDescription>Model accuracy decreases with longer prediction horizons</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData.predictionAccuracy.map((item: any, index: number) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{item.timeframe}</span>
                          <span className="font-medium">{item.accuracy}%</span>
                        </div>
                        <Progress value={item.accuracy} className="h-2" />
                        <div className="text-xs text-muted-foreground">
                          {item.predictions.toLocaleString()} predictions made
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Model Confidence Distribution</CardTitle>
                  <CardDescription>Distribution of prediction confidence scores</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>High Confidence (90-100%)</span>
                        <span className="font-medium">68%</span>
                      </div>
                      <Progress value={68} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Medium Confidence (70-89%)</span>
                        <span className="font-medium">24%</span>
                      </div>
                      <Progress value={24} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Low Confidence (50-69%)</span>
                        <span className="font-medium">8%</span>
                      </div>
                      <Progress value={8} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="features" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Feature Importance Analysis</CardTitle>
                <CardDescription>
                  SHAP values showing which features contribute most to risk predictions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analyticsData.featureImportance} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" domain={[0, 0.3]} />
                      <YAxis dataKey="feature" type="category" width={150} />
                      <Tooltip />
                      <Bar dataKey="importance" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {["Lab Values", "Behavioral", "Demographics"].map((category) => (
                <Card key={category}>
                  <CardHeader>
                    <CardTitle className="text-lg">{category} Features</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {analyticsData.featureImportance
                        .filter((item: any) => item.category === category)
                        .map((feature: any, index: number) => (
                          <div key={index} className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>{feature.feature}</span>
                              <span className="font-medium">{(feature.importance * 100).toFixed(1)}%</span>
                            </div>
                            <Progress value={feature.importance * 100} className="h-1" />
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="predictions" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Real-time Prediction Stream</CardTitle>
                  <CardDescription>Live predictions being made by the ML model</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { id: "P847", risk: 89, confidence: 94, time: "2 min ago" },
                      { id: "P923", risk: 34, confidence: 87, time: "3 min ago" },
                      { id: "P156", risk: 67, confidence: 91, time: "5 min ago" },
                      { id: "P445", risk: 78, confidence: 89, time: "7 min ago" },
                      { id: "P672", risk: 23, confidence: 95, time: "9 min ago" },
                    ].map((prediction, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Badge
                            variant={
                              prediction.risk >= 70 ? "destructive" : prediction.risk >= 40 ? "secondary" : "default"
                            }
                          >
                            {prediction.id}
                          </Badge>
                          <span className="font-medium">{prediction.risk}% risk</span>
                        </div>
                        <div className="text-right text-sm text-muted-foreground">
                          <div>{prediction.confidence}% confidence</div>
                          <div>{prediction.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Intervention Success Rate</CardTitle>
                  <CardDescription>Outcomes when AI recommendations are followed</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">87.3%</div>
                      <div className="text-sm text-muted-foreground">Success rate when recommendations followed</div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">Medication adjustments</span>
                        <span className="text-sm font-medium">92% success</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Lifestyle interventions</span>
                        <span className="text-sm font-medium">84% success</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Follow-up scheduling</span>
                        <span className="text-sm font-medium">89% success</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="distribution" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Risk Score Distribution</CardTitle>
                  <CardDescription>Current patient population by risk level</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={analyticsData.riskDistribution}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {analyticsData.riskDistribution.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Risk Trend Analysis</CardTitle>
                  <CardDescription>Population risk changes over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-green-700">Patients Improved</div>
                          <div className="text-sm text-green-600">Risk score decreased</div>
                        </div>
                        <div className="text-2xl font-bold text-green-700">127</div>
                      </div>
                    </div>
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-yellow-700">Patients Stable</div>
                          <div className="text-sm text-yellow-600">Risk score unchanged</div>
                        </div>
                        <div className="text-2xl font-bold text-yellow-700">456</div>
                      </div>
                    </div>
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-red-700">Patients Deteriorated</div>
                          <div className="text-sm text-red-600">Risk score increased</div>
                        </div>
                        <div className="text-2xl font-bold text-red-700">35</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
