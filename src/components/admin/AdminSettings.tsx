
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useToast } from "@/hooks/use-toast";
import { ChevronDown, Save, Loader2 } from "lucide-react";

const AdminSettings = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [basicPrice, setBasicPrice] = useState("1200");
  const [premiumPrice, setPremiumPrice] = useState("1500");
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>("pricing");
  const { toast } = useToast();

  const handleSaveSettings = async () => {
    setIsSubmitting(true);
    try {
      // This would call a function to save settings to the database
      // For now we'll just simulate a delay and show a success message
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Settings saved",
        description: "Your changes have been successfully saved.",
      });
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Admin Settings</h2>
        <Button onClick={handleSaveSettings} disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save All Settings
            </>
          )}
        </Button>
      </div>

      <Collapsible
        open={openSection === "pricing"}
        onOpenChange={() => toggleSection("pricing")}
        className="rounded-md border px-4 py-2"
      >
        <CollapsibleTrigger className="flex w-full items-center justify-between py-2 text-left">
          <h3 className="text-lg font-semibold">Pricing & Subscription Settings</h3>
          <ChevronDown className={`h-5 w-5 transform transition-transform ${openSection === "pricing" ? "rotate-180" : ""}`} />
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-4 py-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="basicPrice">Basic Plan Price (₹)</Label>
              <Input
                id="basicPrice"
                type="number"
                value={basicPrice}
                onChange={(e) => setBasicPrice(e.target.value)}
                placeholder="1200"
              />
              <p className="text-xs text-gray-500">Current price: ₹1,200</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="premiumPrice">Premium Plan Price (₹)</Label>
              <Input
                id="premiumPrice"
                type="number"
                value={premiumPrice}
                onChange={(e) => setPremiumPrice(e.target.value)}
                placeholder="1500"
              />
              <p className="text-xs text-gray-500">Current price: ₹1,500</p>
            </div>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="autoRenew" className="mb-1 block font-medium">Enable Auto-Renewal by Default</Label>
              <p className="text-sm text-gray-500">New subscriptions will be set to auto-renew</p>
            </div>
            <Switch id="autoRenew" defaultChecked />
          </div>
        </CollapsibleContent>
      </Collapsible>

      <Collapsible
        open={openSection === "system"}
        onOpenChange={() => toggleSection("system")}
        className="rounded-md border px-4 py-2"
      >
        <CollapsibleTrigger className="flex w-full items-center justify-between py-2 text-left">
          <h3 className="text-lg font-semibold">System Settings</h3>
          <ChevronDown className={`h-5 w-5 transform transition-transform ${openSection === "system" ? "rotate-180" : ""}`} />
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="maintenanceMode" className="mb-1 block font-medium">Maintenance Mode</Label>
              <p className="text-sm text-gray-500">
                When enabled, regular users will see a maintenance page
              </p>
            </div>
            <Switch 
              id="maintenanceMode" 
              checked={maintenanceMode} 
              onCheckedChange={setMaintenanceMode} 
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="emailVerification" className="mb-1 block font-medium">Require Email Verification</Label>
              <p className="text-sm text-gray-500">
                New users must verify their email before using the platform
              </p>
            </div>
            <Switch id="emailVerification" defaultChecked />
          </div>
          <Separator />
          <div className="space-y-2">
            <Label htmlFor="supportEmail">Support Email Address</Label>
            <Input
              id="supportEmail"
              type="email"
              defaultValue="support@solution.ai"
              placeholder="support@solution.ai"
            />
          </div>
        </CollapsibleContent>
      </Collapsible>

      <Collapsible
        open={openSection === "data"}
        onOpenChange={() => toggleSection("data")}
        className="rounded-md border px-4 py-2"
      >
        <CollapsibleTrigger className="flex w-full items-center justify-between py-2 text-left">
          <h3 className="text-lg font-semibold">Data Management</h3>
          <ChevronDown className={`h-5 w-5 transform transition-transform ${openSection === "data" ? "rotate-180" : ""}`} />
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-4 py-4">
          <p className="text-sm">
            These actions perform operations on system data. Please use with caution.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button variant="outline">Export All Users</Button>
            <Button variant="outline">Export Subscription Data</Button>
            <Button variant="outline">Database Backup</Button>
            <Button variant="destructive">Clear Cache</Button>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default AdminSettings;
