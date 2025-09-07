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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  Upload,
  FileText,
  Users,
  AlertTriangle,
  TrendingUp,
  Settings,
  BarChart3,
  Target,
  Zap,
  Stethoscope,
  RefreshCw,
  Download,
  Plus,
  Database,
  Filter,
  Search,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

// Mock patient data
const mockPatients = [
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

// Placeholder functions for future API integration
async function fetchPatients() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockPatients), 500);
  });
}

async function processCSVData(csvData: string) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const results = {
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

interface NewPatientData {
  name: string;
  age: string;
  condition: string;
  medicalHistory: string;
  currentMedications: string;
  vitalSigns: {
    bloodPressure: string;
    heartRate: string;
    temperature: string;
    oxygenSaturation: string;
  };
  labResults: {
    bloodGlucose: string;
    hba1c: string;
    cholesterol: string;
    creatinine: string;
  };
  symptoms: string;
  notes: string;
}

interface MLPredictionResult {
  riskScore: number;
  confidence: number;
  factors: string[];
  recommendations: string[];
  predictedOutcome: string;
}

export default function Dashboard({ initialScanData }: { initialScanData: any[] }) {
  const { userId, isLoaded } = useAuth();
  const router = useRouter();

  // Redirect unauthenticated users to sign-in
  useEffect(() => {
    if (isLoaded && !userId) {
      router.push("/sign-in");
    }
  }, [isLoaded, userId, router]);

  const [patients, setPatients] = useState<any[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [riskFilter, setRiskFilter] = useState("all");
  const [conditionFilter, setConditionFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [loading, setLoading] = useState(true);
  const [mlProcessing, setMlProcessing] = useState(false);
  const [showAddPatient, setShowAddPatient] = useState(false);
  const [showDataEntry, setShowDataEntry] = useState(false);
  const [selectedPatientForData, setSelectedPatientForData] = useState<string>("");
  const [newPatientData, setNewPatientData] = useState<NewPatientData>({
    name: "",
    age: "",
    condition: "",
    medicalHistory: "",
    currentMedications: "",
    vitalSigns: {
      bloodPressure: "",
      heartRate: "",
      temperature: "",
      oxygenSaturation: "",
    },
    labResults: {
      bloodGlucose: "",
      hba1c: "",
      cholesterol: "",
      creatinine: "",
    },
    symptoms: "",
    notes: "",
  });
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvResults, setCsvResults] = useState<any>(null);
  const [mlPredictionResult, setMlPredictionResult] = useState<MLPredictionResult | null>(null);
  const [data, setData] = useState<any[]>(initialScanData); // Initialize with server-fetched data

  useEffect(() => {
    fetchPatients().then((data: any) => {
      setPatients(data);
      setFilteredPatients(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const filtered = patients.filter((patient) => {
      const matchesSearch =
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRisk =
        riskFilter === "all" ||
        (riskFilter === "high" && patient.riskScore >= 70) ||
        (riskFilter === "moderate" && patient.riskScore >= 40 && patient.riskScore < 70) ||
        (riskFilter === "low" && patient.riskScore < 40);

      const matchesCondition = conditionFilter === "all" || patient.condition === conditionFilter;

      return matchesSearch && matchesRisk && matchesCondition;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "risk":
          return b.riskScore - a.riskScore;
        case "age":
          return b.age - a.age;
        case "condition":
          return a.condition.localeCompare(b.condition);
        default:
          return 0;
      }
    });

    setFilteredPatients(filtered);
  }, [patients, searchTerm, riskFilter, conditionFilter, sortBy]);

  const handleMLBatchProcess = async () => {
    setMlProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setMlProcessing(false);
    const updatedData = await fetchPatients();
    setPatients(updatedData as any);
    setFilteredPatients(updatedData as any);
  };

  const handleMLPredictionWithData = async (patientData: NewPatientData): Promise<MLPredictionResult> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const riskFactors = [];
        let baseRisk = 30;

        if (
          patientData.vitalSigns.bloodPressure &&
          Number.parseInt(patientData.vitalSigns.bloodPressure.split("/")[0]) > 140
        ) {
          baseRisk += 20;
          riskFactors.push("Elevated Blood Pressure");
        }
        if (patientData.labResults.hba1c && Number.parseFloat(patientData.labResults.hba1c) > 7.0) {
          baseRisk += 25;
          riskFactors.push("Poor Glycemic Control");
        }
        if (patientData.age && Number.parseInt(patientData.age) > 65) {
          baseRisk += 15;
          riskFactors.push("Advanced Age");
        }

        const recommendations = [];
        if (riskFactors.includes("Elevated Blood Pressure")) {
          recommendations.push("Consider ACE inhibitor adjustment");
        }
        if (riskFactors.includes("Poor Glycemic Control")) {
          recommendations.push("Diabetes education and medication review");
        }

        resolve({
          riskScore: Math.min(baseRisk, 95),
          confidence: Math.floor(Math.random() * 15) + 85,
          factors: riskFactors,
          recommendations: recommendations.length > 0 ? recommendations : ["Continue current treatment plan"],
          predictedOutcome: baseRisk > 70 ? "High risk for complications" : "Stable with monitoring",
        });
      }, 1500);
    });
  };

  const handleSubmitNewPatient = async () => {
    setMlProcessing(true);
    try {
      const mlResult = await handleMLPredictionWithData(newPatientData);
      setMlPredictionResult(mlResult);

      const newPatient = {
        id: `P${String(patients.length + 1).padStart(3, "0")}`,
        name: newPatientData.name,
        age: Number.parseInt(newPatientData.age),
        condition: newPatientData.condition,
        riskScore: mlResult.riskScore,
        lastVisit: new Date().toISOString().split("T")[0],
        mlConfidence: mlResult.confidence,
        trendDirection: mlResult.riskScore > 70 ? "increasing" : "stable",
        interventionRecommended: mlResult.riskScore > 60,
        predictedOutcome: mlResult.predictedOutcome,
      };

      const updatedPatients = [...patients, newPatient];
      setPatients(updatedPatients);
      setFilteredPatients(updatedPatients);

      setNewPatientData({
        name: "",
        age: "",
        condition: "",
        medicalHistory: "",
        currentMedications: "",
        vitalSigns: { bloodPressure: "", heartRate: "", temperature: "", oxygenSaturation: "" },
        labResults: { bloodGlucose: "", hba1c: "", cholesterol: "", creatinine: "" },
        symptoms: "",
        notes: "",
      });
      setCsvFile(null);
    } catch (error) {
      console.error("Error processing new patient:", error);
    } finally {
      setMlProcessing(false);
    }
  };

  const handleDataEntry = async (patientId: string) => {
    setMlProcessing(true);
    try {
      const mlResult = await handleMLPredictionWithData(newPatientData);
      setMlPredictionResult(mlResult);

      const updatedPatients = patients.map((patient) =>
        patient.id === patientId
          ? {
              ...patient,
              riskScore: mlResult.riskScore,
              mlConfidence: mlResult.confidence,
              lastVisit: new Date().toISOString().split("T")[0],
              trendDirection: mlResult.riskScore > patient.riskScore ? "increasing" : "improving",
              interventionRecommended: mlResult.riskScore > 60,
              predictedOutcome: mlResult.predictedOutcome,
            }
          : patient
      );

      setPatients(updatedPatients);
      setFilteredPatients(updatedPatients);
      setShowDataEntry(false);
      setSelectedPatientForData("");
      setNewPatientData({
        name: "",
        age: "",
        condition: "",
        medicalHistory: "",
        currentMedications: "",
        vitalSigns: { bloodPressure: "", heartRate: "", temperature: "", oxygenSaturation: "" },
        labResults: { bloodGlucose: "", hba1c: "", cholesterol: "", creatinine: "" },
        symptoms: "",
        notes: "",
      });
      setCsvFile(null);
    } catch (error) {
      console.error("Error updating patient data:", error);
    } finally {
      setMlProcessing(false);
    }
  };

  const handleCSVUpload = async () => {
    if (!csvFile) return;

    setMlProcessing(true);
    const reader = new FileReader();
    reader.onload = async (e) => {
      const csvData = e.target?.result as string;
      const results = await processCSVData(csvData);
      setCsvResults(results);
      setMlPredictionResult(null); // Clear patient-specific results
      setMlProcessing(false);
    };
    reader.readAsText(csvFile);
  };

  const highRiskCount = patients.filter((p) => p.riskScore >= 70).length;
  const moderateRiskCount = patients.filter((p) => p.riskScore >= 40 && p.riskScore < 70).length;
  const lowRiskCount = patients.filter((p) => p.riskScore < 40).length;
  const interventionCount = patients.filter((p) => p.interventionRecommended).length;

  const getRiskBadge = (riskScore: number) => {
    if (riskScore >= 70) {
      return <Badge variant="destructive">High Risk</Badge>;
    } else if (riskScore >= 40) {
      return <Badge variant="secondary">Moderate Risk</Badge>;
    } else {
      return <Badge>Low Risk</Badge>;
    }
  };

  const getTrendIndicator = (trendDirection: string) => {
    if (trendDirection === "increasing") {
      return <TrendingUp className="h-4 w-4 text-red-500" />;
    } else if (trendDirection === "improving") {
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    } else {
      return <TrendingUp className="h-4 w-4 text-gray-500" />;
    }
  };

  // Show loading state while checking authentication
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
              
              {isAdminMode && (
                <Link href="/analytics">
                  <Button variant="ghost">ML Analytics</Button>
                </Link>
              )}
              <div className="flex items-center space-x-2">
                <Settings className="h-4 w-4" />
                <Label htmlFor="admin-mode" className="text-sm">Admin Mode</Label>
                <Switch id="admin-mode" checked={isAdminMode} onCheckedChange={setIsAdminMode} />
              </div>
              <SignedOut>
                <SignInButton mode="modal" afterSignInUrl="/dashboard">
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
                    Add Patient / Upload Data
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Stethoscope className="h-5 w-5" />
                      Add Patient or Upload Data
                    </DialogTitle>
                    <DialogDescription>
                      Enter patient data manually or upload a CSV file for AI-powered risk predictions
                    </DialogDescription>
                  </DialogHeader>

                  <Tabs defaultValue="manual" className="space-y-4">
                    <TabsContent value="manual" className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">Basic Information</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div>
                              <Label htmlFor="name">Patient Name</Label>
                              <Input
                                id="name"
                                value={newPatientData.name}
                                onChange={(e) => setNewPatientData({ ...newPatientData, name: e.target.value })}
                                placeholder="Enter full name"
                              />
                            </div>
                            <div>
                              <Label htmlFor="age">Age</Label>
                              <Input
                                id="age"
                                type="number"
                                value={newPatientData.age}
                                onChange={(e) => setNewPatientData({ ...newPatientData, age: e.target.value })}
                                placeholder="Enter age"
                              />
                            </div>
                            <div>
                              <Label htmlFor="condition">Primary Condition</Label>
                              <Select
                                value={newPatientData.condition}
                                onValueChange={(value) => setNewPatientData({ ...newPatientData, condition: value })}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select condition" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Type 2 Diabetes">Type 2 Diabetes</SelectItem>
                                  <SelectItem value="Type 1 Diabetes">Type 1 Diabetes</SelectItem>
                                  <SelectItem value="Hypertension">Hypertension</SelectItem>
                                  <SelectItem value="COPD">COPD</SelectItem>
                                  <SelectItem value="Heart Disease">Heart Disease</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">Vital Signs</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div>
                              <Label htmlFor="bp">Blood Pressure (mmHg)</Label>
                              <Input
                                id="bp"
                                value={newPatientData.vitalSigns.bloodPressure}
                                onChange={(e) =>
                                  setNewPatientData({
                                    ...newPatientData,
                                    vitalSigns: { ...newPatientData.vitalSigns, bloodPressure: e.target.value },
                                  })
                                }
                                placeholder="e.g., 120/80"
                              />
                            </div>
                            <div>
                              <Label htmlFor="hr">Heart Rate (bpm)</Label>
                              <Input
                                id="hr"
                                value={newPatientData.vitalSigns.heartRate}
                                onChange={(e) =>
                                  setNewPatientData({
                                    ...newPatientData,
                                    vitalSigns: { ...newPatientData.vitalSigns, heartRate: e.target.value },
                                  })
                                }
                                placeholder="e.g., 72"
                              />
                            </div>
                            <div>
                              <Label htmlFor="temp">Temperature (°F)</Label>
                              <Input
                                id="temp"
                                value={newPatientData.vitalSigns.temperature}
                                onChange={(e) =>
                                  setNewPatientData({
                                    ...newPatientData,
                                    vitalSigns: { ...newPatientData.vitalSigns, temperature: e.target.value },
                                  })
                                }
                                placeholder="e.g., 98.6"
                              />
                            </div>
                            <div>
                              <Label htmlFor="o2">Oxygen Saturation (%)</Label>
                              <Input
                                id="o2"
                                value={newPatientData.vitalSigns.oxygenSaturation}
                                onChange={(e) =>
                                  setNewPatientData({
                                    ...newPatientData,
                                    vitalSigns: { ...newPatientData.vitalSigns, oxygenSaturation: e.target.value },
                                  })
                                }
                                placeholder="e.g., 98"
                              />
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">Lab Results</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div>
                              <Label htmlFor="glucose">Blood Glucose (mg/dL)</Label>
                              <Input
                                id="glucose"
                                value={newPatientData.labResults.bloodGlucose}
                                onChange={(e) =>
                                  setNewPatientData({
                                    ...newPatientData,
                                    labResults: { ...newPatientData.labResults, bloodGlucose: e.target.value },
                                  })
                                }
                                placeholder="e.g., 120"
                              />
                            </div>
                            <div>
                              <Label htmlFor="hba1c">HbA1c (%)</Label>
                              <Input
                                id="hba1c"
                                value={newPatientData.labResults.hba1c}
                                onChange={(e) =>
                                  setNewPatientData({
                                    ...newPatientData,
                                    labResults: { ...newPatientData.labResults, hba1c: e.target.value },
                                  })
                                }
                                placeholder="e.g., 7.2"
                              />
                            </div>
                            <div>
                              <Label htmlFor="cholesterol">Total Cholesterol (mg/dL)</Label>
                              <Input
                                id="cholesterol"
                                value={newPatientData.labResults.cholesterol}
                                onChange={(e) =>
                                  setNewPatientData({
                                    ...newPatientData,
                                    labResults: { ...newPatientData.labResults, cholesterol: e.target.value },
                                  })
                                }
                                placeholder="e.g., 180"
                              />
                            </div>
                            <div>
                              <Label htmlFor="creatinine">Creatinine (mg/dL)</Label>
                              <Input
                                id="creatinine"
                                value={newPatientData.labResults.creatinine}
                                onChange={(e) =>
                                  setNewPatientData({
                                    ...newPatientData,
                                    labResults: { ...newPatientData.labResults, creatinine: e.target.value },
                                  })
                                }
                                placeholder="e.g., 1.0"
                              />
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">Clinical Information</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div>
                              <Label htmlFor="history">Medical History</Label>
                              <Textarea
                                id="history"
                                value={newPatientData.medicalHistory}
                                onChange={(e) => setNewPatientData({ ...newPatientData, medicalHistory: e.target.value })}
                                placeholder="Previous conditions, surgeries, family history..."
                                rows={3}
                              />
                            </div>
                            <div>
                              <Label htmlFor="medications">Current Medications</Label>
                              <Textarea
                                id="medications"
                                value={newPatientData.currentMedications}
                                onChange={(e) =>
                                  setNewPatientData({ ...newPatientData, currentMedications: e.target.value })
                                }
                                placeholder="List current medications and dosages..."
                                rows={3}
                              />
                            </div>
                            <div>
                              <Label htmlFor="symptoms">Current Symptoms</Label>
                              <Textarea
                                id="symptoms"
                                value={newPatientData.symptoms}
                                onChange={(e) => setNewPatientData({ ...newPatientData, symptoms: e.target.value })}
                                placeholder="Describe current symptoms..."
                                rows={2}
                              />
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Upload Patient Data CSV</CardTitle>
                          <CardDescription>
                            Upload a CSV file containing patient data for batch ML analysis
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
                          <div className="flex justify-end">
                            <Button
                              onClick={handleCSVUpload}
                              disabled={!csvFile || mlProcessing}
                              className="bg-gradient-to-r from-primary to-primary/80"
                            >
                              {mlProcessing ? (
                                <>
                                  <Brain className="h-4 w-4 mr-2 animate-pulse" />
                                  Processing ML Analysis...
                                </>
                              ) : (
                                <>
                                  <FileText className="h-4 w-4 mr-2" />
                                  Process with ML Model
                                </>
                              )}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                      <div className="flex justify-end gap-3 mt-6">
                        <Button variant="outline" onClick={() => setShowAddPatient(false)}>
                          Cancel
                        </Button>
                        <Button
                          onClick={handleSubmitNewPatient}
                          disabled={!newPatientData.name || !newPatientData.age || mlProcessing}
                          className="bg-gradient-to-r from-primary to-primary/80"
                        >
                          {mlProcessing ? (
                            <>
                              <Brain className="h-4 w-4 mr-2 animate-pulse" />
                              Analyzing with AI...
                            </>
                          ) : (
                            <>
                              <Database className="h-4 w-4 mr-2" />
                              Add Patient & Run ML Analysis
                            </>
                          )}
                        </Button>
                      </div>
                    </TabsContent>
                  </Tabs>
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

        {!isAdminMode && (csvResults || mlPredictionResult) && (
          <Card className="mt-6 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <Brain className="h-5 w-5" />
                ML Analysis Report
              </CardTitle>
              <CardDescription>
                Results from {csvResults ? "CSV batch processing" : "manual patient entry"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {csvResults && (
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
              )}
              {mlPredictionResult && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-white rounded-lg border">
                      <div className="text-2xl font-bold text-primary">{mlPredictionResult.riskScore}%</div>
                      <div className="text-sm text-muted-foreground">Risk Score</div>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg border">
                      <div className="text-2xl font-bold text-blue-600">{mlPredictionResult.confidence}%</div>
                      <div className="text-sm text-muted-foreground">Confidence</div>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg border">
                      <div className="text-sm font-medium">{mlPredictionResult.predictedOutcome}</div>
                      <div className="text-sm text-muted-foreground">Predicted Outcome</div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium">Risk Factors:</h4>
                    <ul className="list-disc pl-5">
                      {mlPredictionResult.factors.map((factor, index) => (
                        <li key={index} className="text-sm">{factor}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium">Recommendations:</h4>
                    <ul className="list-disc pl-5">
                      {mlPredictionResult.recommendations.map((rec, index) => (
                        <li key={index} className="text-sm">{rec}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
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
                      <TableHead>Created At</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.map((scan: any) => (
                      <TableRow key={scan.id}>
                        <TableCell className="font-medium">{scan.id}</TableCell>
                        <TableCell>{scan.user_id}</TableCell>
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

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">High Risk Patients</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-700">{highRiskCount}</div>
              <p className="text-xs text-muted-foreground">Requiring immediate attention</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Moderate Risk</CardTitle>
              <TrendingUp className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-700">{moderateRiskCount}</div>
              <p className="text-xs text-muted-foreground">Monitor closely</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low Risk Patients</CardTitle>
              <Users className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-700">{lowRiskCount}</div>
              <p className="text-xs text-muted-foreground">Stable condition</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
              <Activity className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-700">{patients.length}</div>
              <p className="text-xs text-muted-foreground">Under AI monitoring</p>
            </CardContent>
          </Card>
        </div>

        {isAdminMode && (
          <>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filters & Search
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search patients..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={riskFilter} onValueChange={setRiskFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Risk Level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Risk Levels</SelectItem>
                      <SelectItem value="high">High Risk</SelectItem>
                      <SelectItem value="moderate">Moderate Risk</SelectItem>
                      <SelectItem value="low">Low Risk</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={conditionFilter} onValueChange={setConditionFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Conditions</SelectItem>
                      <SelectItem value="Type 2 Diabetes">Type 2 Diabetes</SelectItem>
                      <SelectItem value="Type 1 Diabetes">Type 1 Diabetes</SelectItem>
                      <SelectItem value="Hypertension">Hypertension</SelectItem>
                      <SelectItem value="COPD">COPD</SelectItem>
                      <SelectItem value="Heart Disease">Heart Disease</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Name</SelectItem>
                      <SelectItem value="risk">Risk Score</SelectItem>
                      <SelectItem value="age">Age</SelectItem>
                      <SelectItem value="condition">Condition</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  AI-Enhanced Patient Cohort ({filteredPatients.length} patients)
                </CardTitle>
                <CardDescription>Click on a patient to view detailed ML insights and predictions</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <Brain className="h-8 w-8 text-primary mx-auto mb-4 animate-pulse" />
                    <div>Loading AI predictions...</div>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Patient ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Age</TableHead>
                        <TableHead>Condition</TableHead>
                        <TableHead>Risk Score</TableHead>
                        <TableHead>ML Confidence</TableHead>
                        <TableHead>Trend</TableHead>
                        <TableHead>AI Recommendation</TableHead>
                        <TableHead>Last Visit</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPatients.map((patient) => (
                        <TableRow key={patient.id} className="hover:bg-muted/50">
                          <TableCell className="font-medium">
                            <Link href={`/patient/${patient.id}`} className="text-primary hover:underline">
                              {patient.id}
                            </Link>
                          </TableCell>
                          <TableCell>{patient.name}</TableCell>
                          <TableCell>{patient.age}</TableCell>
                          <TableCell>{patient.condition}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold">{patient.riskScore}%</span>
                              {getRiskBadge(patient.riskScore)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className="text-sm font-medium">{patient.mlConfidence}%</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getTrendIndicator(patient.trendDirection)}
                              <span className="text-sm capitalize">{patient.trendDirection}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {patient.interventionRecommended ? (
                              <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                                <Zap className="w-3 h-3 mr-1" />
                                Action Required
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-green-600">
                                Continue Monitoring
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>{patient.lastVisit}</TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedPatientForData(patient.id);
                                setShowDataEntry(true);
                              }}
                              className="text-xs"
                            >
                              <Upload className="h-3 w-3 mr-1" />
                              Update Data
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </>
        )}

        <Dialog open={showDataEntry} onOpenChange={setShowDataEntry}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Update Patient Data - {selectedPatientForData}
              </DialogTitle>
              <DialogDescription>
                Enter new clinical data to update ML predictions and risk assessment
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="update-bp">Blood Pressure</Label>
                  <Input
                    id="update-bp"
                    value={newPatientData.vitalSigns.bloodPressure}
                    onChange={(e) =>
                      setNewPatientData({
                        ...newPatientData,
                        vitalSigns: { ...newPatientData.vitalSigns, bloodPressure: e.target.value },
                      })
                    }
                    placeholder="e.g., 120/80"
                  />
                </div>
                <div>
                  <Label htmlFor="update-hba1c">HbA1c (%)</Label>
                  <Input
                    id="update-hba1c"
                    value={newPatientData.labResults.hba1c}
                    onChange={(e) =>
                      setNewPatientData({
                        ...newPatientData,
                        labResults: { ...newPatientData.labResults, hba1c: e.target.value },
                      })
                    }
                    placeholder="e.g., 7.2"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="update-symptoms">Current Symptoms</Label>
                <Textarea
                  id="update-symptoms"
                  value={newPatientData.symptoms}
                  onChange={(e) => setNewPatientData({ ...newPatientData, symptoms: e.target.value })}
                  placeholder="Describe any new or changed symptoms..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="update-notes">Clinical Notes</Label>
                <Textarea
                  id="update-notes"
                  value={newPatientData.notes}
                  onChange={(e) => setNewPatientData({ ...newPatientData, notes: e.target.value })}
                  placeholder="Additional clinical observations..."
                  rows={3}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={() => setShowDataEntry(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => handleDataEntry(selectedPatientForData)}
                disabled={mlProcessing}
                className="bg-gradient-to-r from-primary to-primary/80"
              >
                {mlProcessing ? (
                  <>
                    <Brain className="h-4 w-4 mr-2 animate-pulse" />
                    Updating ML Analysis...
                  </>
                ) : (
                  <>
                    <Database className="h-4 w-4 mr-2" />
                    Update & Reanalyze
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}