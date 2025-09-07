"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"
import { Activity, ArrowLeft, User, Heart, TrendingUp, Brain, Zap, Target, RefreshCw } from "lucide-react"

const mockPatientDetails = {
  P001: {
    id: "P001",
    name: "Sarah Johnson",
    age: 67,
    gender: "Female",
    condition: "Type 2 Diabetes",
    riskScore: 85,
    mlConfidence: 94,
    lastVisit: "2024-01-15",
    nextAppointment: "2024-02-15",
    vitals: {
      bloodPressure: "145/92",
      heartRate: 78,
      weight: 165,
      bmi: 28.2,
    },
    trends: [
      { date: "2023-07", hba1c: 8.2, glucose: 180, weight: 168, riskScore: 72 },
      { date: "2023-08", hba1c: 8.0, glucose: 175, weight: 167, riskScore: 74 },
      { date: "2023-09", hba1c: 7.8, glucose: 170, weight: 166, riskScore: 71 },
      { date: "2023-10", hba1c: 7.9, glucose: 172, weight: 165, riskScore: 76 },
      { date: "2023-11", hba1c: 8.1, glucose: 178, weight: 165, riskScore: 79 },
      { date: "2023-12", hba1c: 8.3, glucose: 185, weight: 165, riskScore: 82 },
      { date: "2024-01", hba1c: 8.5, glucose: 190, weight: 165, riskScore: 85 },
    ],
    riskFactors: [
      {
        factor: "HbA1c Level",
        value: "8.5%",
        impact: "High",
        shapValue: 0.24,
        description: "Above target range (>7%)",
      },
      {
        factor: "Medication Adherence",
        value: "65%",
        impact: "High",
        shapValue: 0.19,
        description: "Irregular medication taking pattern",
      },
      { factor: "BMI", value: "28.2", impact: "Moderate", shapValue: 0.11, description: "Overweight category" },
      {
        factor: "Blood Pressure",
        value: "145/92",
        impact: "Moderate",
        shapValue: 0.09,
        description: "Stage 1 hypertension",
      },
      { factor: "Age", value: "67", impact: "Low", shapValue: 0.12, description: "Advanced age factor" },
    ],
    mlPredictions: {
      thirtyDayReadmission: 0.78,
      sixMonthComplications: 0.65,
      medicationResponse: 0.42,
      lifestyleImpact: 0.73,
    },
    aiRecommendations: [
      {
        type: "immediate",
        title: "Urgent Medication Review",
        description: "HbA1c trending upward - consider insulin adjustment or GLP-1 agonist",
        confidence: 0.94,
        priority: "high",
      },
      {
        type: "behavioral",
        title: "Enhanced Monitoring Protocol",
        description: "Implement continuous glucose monitoring for better adherence tracking",
        confidence: 0.87,
        priority: "medium",
      },
      {
        type: "lifestyle",
        title: "Structured Diabetes Education",
        description: "Refer to certified diabetes educator for comprehensive lifestyle intervention",
        confidence: 0.82,
        priority: "medium",
      },
    ],
  },
}

async function fetchPatientDetails(id: string) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockPatientDetails[id as keyof typeof mockPatientDetails] || null), 800)
  })
}

async function runRealTimeMLPrediction(patientId: string) {
  return new Promise((resolve) => {
    setTimeout(
      () =>
        resolve({
          updatedRiskScore: Math.floor(Math.random() * 20) + 70,
          confidence: Math.floor(Math.random() * 10) + 90,
          newFactors: ["Recent Lab Results", "Medication Changes"],
        }),
      1500,
    )
  })
}

function getRiskBadge(score: number) {
  if (score >= 70) return <Badge variant="destructive">High Risk</Badge>
  if (score >= 40) return <Badge className="bg-yellow-500 hover:bg-yellow-600">Moderate Risk</Badge>
  return <Badge className="bg-green-500 hover:bg-green-600 text-white">Low Risk</Badge>
}

function getImpactColor(impact: string) {
  switch (impact) {
    case "High":
      return "text-destructive"
    case "Moderate":
      return "text-yellow-600"
    case "Low":
      return "text-green-600"
    default:
      return "text-muted-foreground"
  }
}

export default function PatientDetail() {
  const params = useParams()
  const [patient, setPatient] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [mlProcessing, setMlProcessing] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetchPatientDetails(params.id as string).then((data) => {
        setPatient(data)
        setLoading(false)
      })
    }
  }, [params.id])

  const handleMLRefresh = async () => {
    setMlProcessing(true)
    const prediction = await runRealTimeMLPrediction(params.id as string)
    setPatient((prev: any) => ({
      ...prev,
      riskScore: (prediction as any).updatedRiskScore,
      mlConfidence: (prediction as any).confidence,
    }))
    setMlProcessing(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Brain className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
          <div className="text-lg">Loading AI patient analysis...</div>
        </div>
      </div>
    )
  }

  if (!patient) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Patient Not Found</h2>
          <Link href="/dashboard">
            <Button>Return to Dashboard</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
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
              <Link href="/evaluation">
                <Button variant="ghost">Model Evaluation</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/dashboard" className="inline-flex items-center text-primary hover:underline mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">{patient.name}</h1>
              <p className="text-muted-foreground">Patient ID: {patient.id}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-3 mb-2">
                {getRiskBadge(patient.riskScore)}
                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                  <Brain className="w-3 h-3 mr-1" />
                  {patient.mlConfidence}% Confidence
                </Badge>
              </div>
              <div className="text-2xl font-bold">{patient.riskScore}% Risk</div>
              <Button
                onClick={handleMLRefresh}
                disabled={mlProcessing}
                variant="outline"
                size="sm"
                className="mt-2 bg-transparent"
              >
                {mlProcessing ? (
                  <>
                    <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Zap className="h-3 w-3 mr-1" />
                    Refresh ML
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Patient Overview</TabsTrigger>
            <TabsTrigger value="predictions">ML Predictions</TabsTrigger>
            <TabsTrigger value="trends">Health Trends</TabsTrigger>
            <TabsTrigger value="recommendations">AI Recommendations</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Demographics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Age:</span>
                    <span className="font-medium">{patient.age} years</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Gender:</span>
                    <span className="font-medium">{patient.gender}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Condition:</span>
                    <span className="font-medium">{patient.condition}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Visit:</span>
                    <span className="font-medium">{patient.lastVisit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Next Appointment:</span>
                    <span className="font-medium">{patient.nextAppointment}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    Current Vitals
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Blood Pressure:</span>
                    <span className="font-medium">{patient.vitals.bloodPressure} mmHg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Heart Rate:</span>
                    <span className="font-medium">{patient.vitals.heartRate} bpm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Weight:</span>
                    <span className="font-medium">{patient.vitals.weight} lbs</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">BMI:</span>
                    <span className="font-medium">{patient.vitals.bmi}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    AI Risk Assessment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Overall Risk</span>
                        <span className="text-sm font-medium">{patient.riskScore}%</span>
                      </div>
                      <Progress value={patient.riskScore} className="h-3" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-muted-foreground">ML Confidence</span>
                        <span className="text-sm font-medium">{patient.mlConfidence}%</span>
                      </div>
                      <Progress value={patient.mlConfidence} className="h-2" />
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Risk calculated using ensemble ML models with SHAP explainability and validated on 2M+ patient
                      records.
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="predictions" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-primary" />
                    Predictive Analytics
                  </CardTitle>
                  <CardDescription>AI-generated outcome predictions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">30-Day Readmission</span>
                      <div className="flex items-center gap-2">
                        <Progress value={patient.mlPredictions.thirtyDayReadmission * 100} className="w-20 h-2" />
                        <span className="text-sm font-medium">
                          {(patient.mlPredictions.thirtyDayReadmission * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">6-Month Complications</span>
                      <div className="flex items-center gap-2">
                        <Progress value={patient.mlPredictions.sixMonthComplications * 100} className="w-20 h-2" />
                        <span className="text-sm font-medium">
                          {(patient.mlPredictions.sixMonthComplications * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Medication Response</span>
                      <div className="flex items-center gap-2">
                        <Progress value={patient.mlPredictions.medicationResponse * 100} className="w-20 h-2" />
                        <span className="text-sm font-medium">
                          {(patient.mlPredictions.medicationResponse * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Lifestyle Impact</span>
                      <div className="flex items-center gap-2">
                        <Progress value={patient.mlPredictions.lifestyleImpact * 100} className="w-20 h-2" />
                        <span className="text-sm font-medium">
                          {(patient.mlPredictions.lifestyleImpact * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>SHAP Feature Importance</CardTitle>
                  <CardDescription>Factors contributing to risk prediction</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={patient.riskFactors} layout="horizontal">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" domain={[0, 0.3]} />
                        <YAxis dataKey="factor" type="category" width={100} />
                        <Tooltip />
                        <Bar dataKey="shapValue" fill="#3b82f6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  ML-Enhanced Health Trends
                </CardTitle>
                <CardDescription>Key health metrics and AI risk predictions over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={patient.trends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="hba1c"
                        stroke="hsl(var(--chart-1))"
                        strokeWidth={2}
                        name="HbA1c (%)"
                      />
                      <Line
                        type="monotone"
                        dataKey="glucose"
                        stroke="hsl(var(--chart-2))"
                        strokeWidth={2}
                        name="Glucose (mg/dL)"
                      />
                      <Line type="monotone" dataKey="riskScore" stroke="#ef4444" strokeWidth={3} name="AI Risk Score" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  AI-Generated Clinical Recommendations
                </CardTitle>
                <CardDescription>Evidence-based recommendations powered by machine learning</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {patient.aiRecommendations.map((rec: any, index: number) => (
                    <div
                      key={index}
                      className={`p-4 border rounded-lg ${
                        rec.priority === "high"
                          ? "bg-red-50 border-red-200"
                          : rec.priority === "medium"
                            ? "bg-yellow-50 border-yellow-200"
                            : "bg-blue-50 border-blue-200"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant={rec.priority === "high" ? "destructive" : "secondary"}>
                              {rec.priority.toUpperCase()} PRIORITY
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {(rec.confidence * 100).toFixed(0)}% confidence
                            </span>
                          </div>
                          <h4 className="font-medium mb-1">{rec.title}</h4>
                          <p className="text-sm text-muted-foreground">{rec.description}</p>
                        </div>
                        <Button size="sm" variant="outline">
                          Implement
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
