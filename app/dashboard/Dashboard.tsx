
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useAuth,
} from "@clerk/nextjs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import {
  Activity,
  Brain,
  FileText,
  Users,
  AlertTriangle,
  Settings,
  BarChart3,
  Target,
  Zap,
  Stethoscope,
  RefreshCw,
  Download,
  Plus,
  Database,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";

// Define interfaces for type safety
interface Patient {
  id: string;
  name: string;
  age: number;
  condition: string;
  riskScore: number;
  lastVisit: string;
  interventionRecommended: boolean;
  mlConfidence: number;
  trendDirection: string;
  predictedOutcome: string;
}

interface MLScanData {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
}

interface CSVResults {
  patientsProcessed: number;
  highRiskIdentified: number;
  averageRiskScore: number;
  processingTime: string;
  predictions: Array<{
    day: number;
    patientId: string;
    riskScore: number;
    confidence: number;
  }>;
}

// Mock patient data
const mockPatients: Patient[] = [
  {
    id: "P001",
    name: "Sarah Johnson",
    age: 67,
    condition: "Type 2 Diabetes",
    riskScore: 78,
    lastVisit: "2024-01-15",
    interventionRecommended: true,
    mlConfidence: 94,
    trendDirection: "increasing",
    predictedOutcome: "30-day readmission risk",
  },
  {
    id: "P008",
    name: "James Wilson",
    age: 52,
    condition: "Type 2 Diabetes",
    riskScore: 28,
    lastVisit: "2024-01-21",
    mlConfidence: 92,
    trendDirection: "improving",
    interventionRecommended: false,
    predictedOutcome: "excellent progress",
  },
];

const mlAnalyticsData = {
  totalScans: 1247,
  modelAccuracy: 94.2,
  avgConfidence: 92.8,
  scanHistory: [
    { date: "2024-01-15", scans: 45, accuracy: 94.1, avgConfidence: 93.2 },
    { date: "2024-01-11", scans: 47, accuracy: 94.3, avgConfidence: 93.5 },
  ],
  predictionBreakdown: [
    { risk: "High Risk", count: 87, percentage: 14.1 },
    { risk: "Moderate Risk", count: 189, percentage: 30.6 },
    { risk: "Low Risk", count: 342, percentage: 55.3 },
  ],
};

// Function to generate randomized ML Model Performance Report data
const generateMLModelPerformanceData = () => {
  const topFeatures = [
    "chronic_condition_2",
    "mean_systolic_bp",
    "triglycerides",
    "medication_burden",
    "social_support_score",
    "icu_admissions_last180",
    "blood_glucose_level",
    "cholesterol_ratio",
    "daily_activity_score",
    "hospital_visits",
  ];

  return {
    subModels: [
      {
        name: "Demographics",
        type: "Logistic",
        classes: "0–3",
        accuracy: (0.98 + (Math.random() * 0.04 - 0.02)).toFixed(2),
        topFeature: topFeatures[Math.floor(Math.random() * topFeatures.length)],
      },
      {
        name: "Vitals",
        type: "Random Forest",
        classes: "0–1",
        accuracy: (0.98 + (Math.random() * 0.04 - 0.02)).toFixed(2),
        topFeature: topFeatures[Math.floor(Math.random() * topFeatures.length)],
      },
      {
        name: "Labs",
        type: "XGBoost",
        classes: "0–3",
        accuracy: (0.96 + (Math.random() * 0.04 - 0.02)).toFixed(2),
        topFeature: topFeatures[Math.floor(Math.random() * topFeatures.length)],
      },
      {
        name: "Medication",
        type: "LightGBM",
        classes: "0–3",
        accuracy: (0.99 + (Math.random() * 0.04 - 0.02)).toFixed(2),
        topFeature: topFeatures[Math.floor(Math.random() * topFeatures.length)],
      },
      {
        name: "Lifestyle",
        type: "Random Forest",
        classes: "0–1",
        accuracy: (0.99 + (Math.random() * 0.04 - 0.02)).toFixed(2),
        topFeature: topFeatures[Math.floor(Math.random() * topFeatures.length)],
      },
      {
        name: "Healthcare Usage",
        type: "Logistic",
        classes: "0–3",
        accuracy: (1.00 + (Math.random() * 0.04 - 0.02)).toFixed(2),
        topFeature: topFeatures[Math.floor(Math.random() * topFeatures.length)],
      },
    ],
    fusionModel: {
      type: "XGBoost (binary)",
      accuracy: (0.57 + (Math.random() * 0.04 - 0.02)).toFixed(2),
      precisionRecall: [
        { class: 0, precision: (0.46 + (Math.random() * 0.04 - 0.02)).toFixed(2), recall: (0.09 + (Math.random() * 0.04 - 0.02)).toFixed(2) },
        { class: 1, precision: (0.58 + (Math.random() * 0.04 - 0.02)).toFixed(2), recall: (0.93 + (Math.random() * 0.04 - 0.02)).toFixed(2) },
      ],
      observation: "Strong recall for high-risk patients (Class 1), low performance for low-risk (Class 0)",
    },
  };
};

// Placeholder functions for future API integration
async function fetchPatients(): Promise<Patient[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockPatients), 500);
  });
}

async function processCSVData(csvData: string): Promise<CSVResults> {
  return new Promise((resolve) => {
    // Bypassing header validation for dummy data
    setTimeout(() => {
      const results: CSVResults = {
        patientsProcessed: 30,
        highRiskIdentified: 8,
        averageRiskScore: 52.3,
        processingTime: "2.4 seconds",
        predictions: Array.from({ length: 30 }, (_, i) => ({
          day: i + 1,
          patientId: `P${String(i + 100).padStart(3, "0")}`,
          riskScore: Math.floor(Math.random() * 100),
          confidence: Math.floor(Math.random() * 20) + 80,
        })),
      };
      resolve(results);
    }, 2400);
  });
}

export default function Dashboard({ initialScanData }: { initialScanData: MLScanData[] }) {
  const { userId, isLoaded } = useAuth();
  const router = useRouter();

  // State definitions
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [mlProcessing, setMlProcessing] = useState(false);
  const [showAddPatient, setShowAddPatient] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvResults, setCsvResults] = useState<CSVResults | null>(null);
  const [data, setData] = useState<MLScanData[]>(initialScanData);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [mlModelPerformanceData, setMLModelPerformanceData] = useState<any | null>(null);

  // Redirect unauthenticated users to sign-in
  useEffect(() => {
    if (isLoaded && !userId) {
      router.push("/sign-in");
    }
  }, [isLoaded, userId, router]);

  // Fetch initial patient data
  useEffect(() => {
    fetchPatients().then((data) => {
      setPatients(data);
      setLoading(false);
    });
  }, []);

  // Handle CSV upload
  const handleCSVUpload = async () => {
    if (!csvFile) {
      toast({
        title: "Validation Error",
        description: "Please select a CSV file",
        variant: "destructive",
      });
      return;
    }

    if (!csvFile.name.toLowerCase().endsWith(".csv")) {
      toast({
        title: "Validation Error",
        description: "File must be a CSV",
        variant: "destructive",
      });
      return;
    }

    setMlProcessing(true);
    const reader = new FileReader();
    reader.onload = async (e) => {
      const csvData = e.target?.result;
      if (typeof csvData !== "string") {
        toast({
          title: "Error",
          description: "Failed to read CSV file content",
          variant: "destructive",
        });
        setMlProcessing(false);
        return;
      }
      try {
        const results = await processCSVData(csvData);
        setCsvResults(results);
        setMLModelPerformanceData(generateMLModelPerformanceData()); // Generate new report data
        setShowAddPatient(false);
        setCsvFile(null);
        toast({
          title: "Success",
          description: "CSV data processed successfully",
        });
      } catch (error) {
        console.error("Error processing CSV:", error);
        toast({
          title: "Error",
          description: (error as Error).message || "Failed to process CSV data",
          variant: "destructive",
        });
      } finally {
        setMlProcessing(false);
      }
    };
    reader.onerror = () => {
      toast({
        title: "Error",
        description: "Failed to read CSV file",
        variant: "destructive",
      });
      setMlProcessing(false);
    };
    reader.readAsText(csvFile);
  };

  // Batch ML processing
  const handleMLBatchProcess = async () => {
    setMlProcessing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const updatedData = await fetchPatients();
      setPatients(updatedData);
      toast({
        title: "Success",
        description: "Batch ML analysis completed",
      });
    } catch (error) {
      console.error("Error in batch processing:", error);
      toast({
        title: "Error",
        description: "Failed to run batch ML analysis",
        variant: "destructive",
      });
    } finally {
      setMlProcessing(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Activity className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
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
                <Button variant="default">Dashboard</Button>
              </Link>
              {isAdminMode ? (
                <Link href="/analytics">
                  <Button variant="ghost">ML Analytics</Button>
                </Link>
              ) : (
                <span className="text-sm text-muted-foreground">Analytics (Admin Only)</span>
              )}
              <div className="flex items-center space-x-2">
                <Settings className="h-4 w-4" />
                <Label htmlFor="admin-mode" className="text-sm">Admin Mode</Label>
                <Switch
                  id="admin-mode"
                  checked={isAdminMode}
                  onCheckedChange={(checked) => {
                    console.log("Admin Mode Toggled:", checked);
                    setIsAdminMode(checked);
                  }}
                />
              </div>
              <SignedOut>
                <SignInButton mode="modal" forceRedirectUrl="/dashboard">
                  <Button variant="default">Sign In</Button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">AI-Powered Patient Dashboard</h1>
              <p className="text-muted-foreground">
                Real-time ML risk assessment and predictive analytics for chronic care management
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Dialog open={showAddPatient} onOpenChange={setShowAddPatient}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="bg-gradient-to-r from-green-500 to-green-600 text-white border-green-600"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Upload Patient Data
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Upload Patient Data CSV
                    </DialogTitle>
                    <DialogDescription>
                      Upload a CSV file containing patient data for batch ML analysis
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Upload CSV</CardTitle>
                        <CardDescription>
                          Select a CSV file with patient data for AI-powered risk predictions
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label htmlFor="csv-upload">Select CSV File</Label>
                          <Input
                            id="csv-upload"
                            type="file"
                            accept=".csv"
                            onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
                            className="cursor-pointer"
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            Expected format: patient_id, date, vitals, lab_results, symptoms
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                    <div className="flex justify-end gap-3">
                      <Button variant="outline" onClick={() => setShowAddPatient(false)}>
                        Cancel
                      </Button>
                      <Button
                        onClick={handleCSVUpload}
                        disabled={mlProcessing || !csvFile}
                        className="bg-gradient-to-r from-primary to-primary/80"
                      >
                        {mlProcessing ? (
                          <>
                            <Brain className="h-4 w-4 mr-2 animate-pulse" />
                            Processing CSV...
                          </>
                        ) : (
                          <>
                            <FileText className="h-4 w-4 mr-2" />
                            Process CSV
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              <Button
                onClick={handleMLBatchProcess}
                disabled={mlProcessing}
                className="bg-gradient-to-r from-primary to-primary/80"
              >
                {mlProcessing ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Brain className="h-4 w-4 mr-2" />
                    Run ML Analysis
                  </>
                )}
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
            </div>
          </div>
        </div>

        {csvResults && (
          <Card className="mt-6 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <Brain className="h-5 w-5" />
                ML Analysis Report
              </CardTitle>
              <CardDescription>Results from CSV batch processing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 bg-white rounded-lg border">
                    <div className="text-2xl font-bold text-primary">{csvResults.patientsProcessed}</div>
                    <div className="text-sm text-muted-foreground">Patients Processed</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg border">
                    <div className="text-2xl font-bold text-red-600">{csvResults.highRiskIdentified}</div>
                    <div className="text-sm text-muted-foreground">High Risk Identified</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg border">
                    <div className="text-2xl font-bold text-blue-600">{csvResults.averageRiskScore}%</div>
                    <div className="text-sm text-muted-foreground">Average Risk Score</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg border">
                    <div className="text-2xl font-bold text-green-600">{csvResults.processingTime}</div>
                    <div className="text-sm text-muted-foreground">Processing Time</div>
                  </div>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={csvResults.predictions.slice(0, 10)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="riskScore" stroke="#3b82f6" strokeWidth={2} name="Risk Score" />
                      <Line type="monotone" dataKey="confidence" stroke="#10b981" strokeWidth={2} name="Confidence" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {mlModelPerformanceData && csvResults && (
          <Card className="mt-6 bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-700">
                <BarChart3 className="h-5 w-5" />
                ML Model Performance Report
              </CardTitle>
              <CardDescription>Sub-model and fusion model performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Sub-Model Performance & Key Features</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Sub-Model</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Classes</TableHead>
                        <TableHead>Accuracy</TableHead>
                        <TableHead>Top Contributing Feature</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mlModelPerformanceData.subModels.map((model: any, index: number) => (
                        <TableRow key={index}>
                          <TableCell>{model.name}</TableCell>
                          <TableCell>{model.type}</TableCell>
                          <TableCell>{model.classes}</TableCell>
                          <TableCell>{model.accuracy}</TableCell>
                          <TableCell>{model.topFeature}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Fusion Model (Final Prediction)</h3>
                  <div className="space-y-2">
                    <p><strong>Type:</strong> {mlModelPerformanceData.fusionModel.type}</p>
                    <p><strong>Accuracy:</strong> {mlModelPerformanceData.fusionModel.accuracy}</p>
                    <p><strong>Precision/Recall:</strong></p>
                    <ul className="list-disc pl-5">
                      {mlModelPerformanceData.fusionModel.precisionRecall.map((pr: any, index: number) => (
                        <li key={index}>
                          Class {pr.class} → Precision: {pr.precision} | Recall: {pr.recall}
                        </li>
                      ))}
                    </ul>
                    <p><strong>Observation:</strong> {mlModelPerformanceData.fusionModel.observation}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {isAdminMode && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-primary" />
                Scan History
              </CardTitle>
              <CardDescription>Recent scans retrieved from Supabase</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <Brain className="h-8 w-8 text-primary mx-auto mb-4 animate-pulse" />
                  <div>Loading scan history...</div>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Scan ID</TableHead>
                      <TableHead>User ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Created At</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.map((scan) => (
                      <TableRow key={scan.id}>
                        <TableCell className="font-medium">{scan.id}</TableCell>
                        <TableCell>{scan.user_id}</TableCell>
                        <TableCell>{scan.name}</TableCell>
                        <TableCell>{new Date(scan.created_at).toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        )}

        {isAdminMode && (
          <Card className="mb-8 bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-700">
                <BarChart3 className="h-5 w-5" />
                ML Model Analytics (Admin View)
              </CardTitle>
              <CardDescription>Real-time model performance metrics and scan history</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="history">Scan History</TabsTrigger>
                  <TabsTrigger value="predictions">Prediction Breakdown</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Scans</CardTitle>
                        <Target className="h-4 w-4 text-primary" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{mlAnalyticsData.totalScans}</div>
                        <p className="text-xs text-muted-foreground">This month</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Model Accuracy</CardTitle>
                        <Zap className="h-4 w-4 text-green-600" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{mlAnalyticsData.modelAccuracy}%</div>
                        <p className="text-xs text-muted-foreground">Current performance</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg Confidence</CardTitle>
                        <Brain className="h-4 w-4 text-blue-600" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{mlAnalyticsData.avgConfidence}%</div>
                        <p className="text-xs text-muted-foreground">Prediction confidence</p>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                <TabsContent value="history" className="space-y-4">
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={mlAnalyticsData.scanHistory}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="scans" fill="#3b82f6" name="Daily Scans" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>
                <TabsContent value="predictions" className="space-y-4">
                  <div className="space-y-3">
                    {mlAnalyticsData.predictionBreakdown.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Badge
                            variant={
                              item.risk === "High Risk"
                                ? "destructive"
                                : item.risk === "Moderate Risk"
                                ? "secondary"
                                : "default"
                            }
                          >
                            {item.risk}
                          </Badge>
                          <span>{item.count} patients</span>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{item.percentage}%</div>
                          <Progress value={item.percentage} className="w-20 h-2" />
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
