"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Scan, Package, MapPin, AlertTriangle, Loader2 } from "lucide-react"
import { useParts } from "@/contexts/parts-context"
import { useLanguage } from "@/contexts/language-context"
import { useToast } from "@/hooks/use-toast"

export function BarcodeScanner() {
  const [scannedCode, setScannedCode] = useState("")
  const [scannedPart, setScannedPart] = useState<any>(null)
  const [isScanning, setIsScanning] = useState(false)
  const { t } = useLanguage()
  const { parts, loading } = useParts()
  const { toast } = useToast()

  const handleScan = async () => {
    if (!scannedCode.trim()) {
      toast({
        title: "Error",
        description: "Please enter a barcode or part number",
        variant: "destructive",
      })
      return
    }

    setIsScanning(true)
    
    try {
      // Search for part by part_number or barcode
      const foundPart = parts.find(part => 
        part.part_number.toLowerCase().includes(scannedCode.toLowerCase()) ||
        part.description?.toLowerCase().includes(scannedCode.toLowerCase())
      )

      if (foundPart) {
        setScannedPart(foundPart)
        toast({
          title: "Success",
          description: `Found part: ${foundPart.part_number}`,
        })
      } else {
        toast({
          title: "Not Found",
          description: "No part found with this barcode or part number",
          variant: "destructive",
        })
        setScannedPart(null)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to search for part",
        variant: "destructive",
      })
    } finally {
      setIsScanning(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleScan()
    }
  }

  return (
    <div className="space-y-6">
      {/* Scanner Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scan className="h-5 w-5" />
            Barcode Scanner
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Scan or enter barcode manually"
              value={scannedCode}
              onChange={(e) => setScannedCode(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button onClick={handleScan} disabled={!scannedCode || isScanning}>
              {isScanning ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Scan className="h-4 w-4 mr-2" />
              )}
              Scan
            </Button>
          </div>

          <div className="text-center p-8 border-2 border-dashed border-muted-foreground/25 rounded-lg">
            <Scan className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Position barcode in camera view or enter manually above</p>
          </div>
        </CardContent>
      </Card>

      {/* Scanned Result */}
      {scannedPart && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Scanned Part Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Part Number</label>
                  <p className="font-mono text-lg">{scannedPart.partNumber}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Part Name</label>
                  <p className="text-lg">{scannedPart.partName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Current Stock</label>
                  <div className="flex items-center gap-2">
                    <p className="text-2xl font-bold">{scannedPart.currentStock}</p>
                    {scannedPart.currentStock <= scannedPart.minimumStock && (
                      <AlertTriangle className="h-5 w-5 text-warning" />
                    )}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Location</label>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <p>{scannedPart.location}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button>Issue Part</Button>
                <Button variant="outline">Return Part</Button>
                <Button variant="outline">View Details</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
