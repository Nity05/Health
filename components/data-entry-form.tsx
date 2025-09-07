"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Brain, Upload, Activity, TrendingUp, AlertTriangle } from "lucide-react"

interface DataEntryFormProps {
  patientId?: string
  onSubmit: (data: any) => Promise<void>
  onCancel: () => void
  isProcessing?: boolean
}

export function DataEntryForm({ patientId, onSubmit, onCancel, isProcessing = false }: DataEntryFormProps) {
  const [formData, setFormData] = useState({
    // Vital Signs
    bloodPressure: "",
    heartRate: "",
    temperature: "",
    respiratoryRate: "",
    oxygenSaturation: "",
    weight: "",
    height: "",

    // Lab Results
    bloodGlucose: "",
    hba1c: "",
    cholesterol: "",
    hdl: "",
    ldl: "",
    triglycerides: "",
    creatinine: "",
    bun: "",
    egfr: "",

    // Clinical Assessment
    symptoms: "",
    painLevel: "",
    functionalStatus: "",
    medicationAdherence: "",

    // Risk Factors
    smokingStatus: "",
    alcoholUse: "",
    exerciseFrequency: "",
    dietCompliance: "",

    // Clinical Notes
    clinicalNotes: "",
    treatmentPlan: "",
    followUpDate: "",
  })

  const [mlPrediction, setMlPrediction] = useState<any>(null)
  const [showPrediction, setShowPrediction] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handlePreviewML = async () => {
    // Simulate ML prediction preview
    setShowPrediction(true)
    setTimeout(() => {
      const riskScore = Math.floor(Math.random() * 100)
      setMlPrediction({
        riskScore,
        confidence: Math.floor(Math.random() * 20) + 80,
        keyFactors: ["Blood Pressure", "HbA1c", "Age"],
        recommendations: [
          "Monitor blood glucose closely",
          "Consider medication adjustment",
          "Schedule follow-up in 2 weeks",
        ],
        riskLevel: riskScore > 70 ? "High" : riskScore > 40 ? "Moderate" : "Low",
      })
    }, 1000)
  }

  const handleSubmit = async () => {
    await onSubmit(formData)
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Vital Signs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Activity className="h-5 w-5 text-blue-600" />
              Vital Signs
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="bp">Blood Pressure (mmHg)</Label>
              <Input
                id="bp"
                value={formData.bloodPressure}
                onChange={(e) => handleInputChange("bloodPressure", e.target.value)}
                placeholder="120/80"
              />
            </div>
            <div>
              <Label htmlFor="hr">Heart Rate (bpm)</Label>
              <Input
                id="hr"
                value={formData.heartRate}
                onChange={(e) => handleInputChange("heartRate", e.target.value)}
                placeholder="72"
              />
            </div>
            <div>
              <Label htmlFor="temp">Temperature (°F)</Label>
              <Input
                id="temp"
                value={formData.temperature}
                onChange={(e) => handleInputChange("temperature", e.target.value)}
                placeholder="98.6"
              />
            </div>
            <div>
              <Label htmlFor="o2sat">O2 Saturation (%)</Label>
              <Input
                id="o2sat"
                value={formData.oxygenSaturation}
                onChange={(e) => handleInputChange("oxygenSaturation", e.target.value)}
                placeholder="98"
              />
            </div>
            <div>
              <Label htmlFor="weight">Weight (lbs)</Label>
              <Input
                id="weight"
                value={formData.weight}
                onChange={(e) => handleInputChange("weight", e.target.value)}
                placeholder="150"
              />
            </div>
            <div>
              <Label htmlFor="height">Height (inches)</Label>
              <Input
                id="height"
                value={formData.height}
                onChange={(e) => handleInputChange("height", e.target.value)}
                placeholder="68"
              />
            </div>
          </CardContent>
        </Card>

        {/* Lab Results */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Lab Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="glucose">Blood Glucose (mg/dL)</Label>
              <Input
                id="glucose"
                value={formData.bloodGlucose}
                onChange={(e) => handleInputChange("bloodGlucose", e.target.value)}
                placeholder="120"
              />
            </div>
            <div>
              <Label htmlFor="hba1c">HbA1c (%)</Label>
              <Input
                id="hba1c"
                value={formData.hba1c}
                onChange={(e) => handleInputChange("hba1c", e.target.value)}
                placeholder="7.0"
              />
            </div>
            <div>
              <Label htmlFor="cholesterol">Total Cholesterol (mg/dL)</Label>
              <Input
                id="cholesterol"
                value={formData.cholesterol}
                onChange={(e) => handleInputChange("cholesterol", e.target.value)}
                placeholder="200"
              />
            </div>
            <div>
              <Label htmlFor="creatinine">Creatinine (mg/dL)</Label>
              <Input
                id="creatinine"
                value={formData.creatinine}
                onChange={(e) => handleInputChange("creatinine", e.target.value)}
                placeholder="1.0"
              />
            </div>
            <div>
              <Label htmlFor="egfr">eGFR (mL/min/1.73m²)</Label>
              <Input
                id="egfr"
                value={formData.egfr}
                onChange={(e) => handleInputChange("egfr", e.target.value)}
                placeholder="90"
              />
            </div>
          </CardContent>
        </Card>

        {/* Clinical Assessment */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              Clinical Assessment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="symptoms">Current Symptoms</Label>
              <Textarea
                id="symptoms"
                value={formData.symptoms}
                onChange={(e) => handleInputChange("symptoms", e.target.value)}
                placeholder="Describe symptoms..."
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="pain">Pain Level (0-10)</Label>
              <Select value={formData.painLevel} onValueChange={(value) => handleInputChange("painLevel", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select pain level" />
                </SelectTrigger>
                <SelectContent>
                  {[...Array(11)].map((_, i) => (
                    <SelectItem key={i} value={i.toString()}>
                      {i} - {i === 0 ? "No pain" : i <= 3 ? "Mild" : i <= 6 ? "Moderate" : "Severe"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="adherence">Medication Adherence</Label>
              <Select
                value={formData.medicationAdherence}
                onValueChange={(value) => handleInputChange("medicationAdherence", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select adherence" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excellent">Excellent &gt;95%</SelectItem>
                  <SelectItem value="good">Good 80-95%</SelectItem>
                  <SelectItem value="fair">Fair 60-79%</SelectItem>
                  <SelectItem value="poor">Poor &lt;60%</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ML Prediction Preview */}
      {showPrediction && mlPrediction && (
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-blue-600" />
              ML Risk Prediction Preview
            </CardTitle>
            <CardDescription>AI-generated risk assessment based on entered data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-700">{mlPrediction.riskScore}%</div>
                <Badge
                  variant={
                    mlPrediction.riskLevel === "High"
                      ? "destructive"
                      : mlPrediction.riskLevel === "Moderate"
                        ? "secondary"
                        : "default"
                  }
                >
                  {mlPrediction.riskLevel} Risk
                </Badge>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Key Risk Factors:</h4>
                <ul className="text-sm space-y-1">
                  {mlPrediction.keyFactors.map((factor: string, index: number) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      {factor}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">AI Recommendations:</h4>
                <ul className="text-sm space-y-1">
                  {mlPrediction.recommendations.map((rec: string, index: number) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Clinical Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Clinical Notes & Treatment Plan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="notes">Clinical Notes</Label>
            <Textarea
              id="notes"
              value={formData.clinicalNotes}
              onChange={(e) => handleInputChange("clinicalNotes", e.target.value)}
              placeholder="Enter clinical observations, assessment, and notes..."
              rows={4}
            />
          </div>
          <div>
            <Label htmlFor="treatment">Treatment Plan</Label>
            <Textarea
              id="treatment"
              value={formData.treatmentPlan}
              onChange={(e) => handleInputChange("treatmentPlan", e.target.value)}
              placeholder="Outline treatment plan and interventions..."
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="followup">Follow-up Date</Label>
            <Input
              id="followup"
              type="date"
              value={formData.followUpDate}
              onChange={(e) => handleInputChange("followUpDate", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={handlePreviewML} disabled={isProcessing}>
          <Brain className="h-4 w-4 mr-2" />
          Preview ML Analysis
        </Button>

        <div className="flex gap-3">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isProcessing}
            className="bg-gradient-to-r from-primary to-primary/80"
          >
            {isProcessing ? (
              <>
                <Upload className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Submit & Run ML Analysis
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
