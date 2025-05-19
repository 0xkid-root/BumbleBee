import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Shield, Loader2, Check, Info, KeyRound } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

interface PasskeyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onRegister: () => Promise<void>;
  isLoading: boolean;
  isRegistered: boolean;
}

export function PasskeyDialog({
  isOpen,
  onClose,
  onRegister,
  isLoading,
  isRegistered
}: PasskeyDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-lg bg-white border shadow-lg">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-xl font-semibold flex items-center gap-2 text-gray-900">
            <KeyRound className="h-5 w-5 text-blue-600" />
            Register Passkey
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Add an extra layer of security to your delegation account by registering a passkey
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Info Alert */}
          <Alert className="bg-blue-50 border-blue-200">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-sm text-blue-700">
              <strong className="font-medium">What is a passkey?</strong>
              <p className="mt-1 text-blue-600">
                A passkey uses your device's biometric security (like fingerprint or face recognition) 
                to protect your delegation account. It's more secure than traditional passwords.
              </p>
            </AlertDescription>
          </Alert>

          {/* Security Level Indicator */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Security Level</span>
              <span className="text-green-600 font-medium">
                {isRegistered ? "Enhanced" : "Basic"}
              </span>
            </div>
            <Progress 
              value={isRegistered ? 100 : 33} 
              className={`h-2 bg-gray-100 ${isRegistered ? "[&>div]:bg-green-500" : "[&>div]:bg-blue-500"}`}
            />
          </div>

          {/* Requirements List */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700">Requirements:</h4>
            <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
              <li>Device with biometric capabilities (fingerprint/face recognition)</li>
              <li>Latest browser version supporting WebAuthn</li>
              <li>Connected wallet</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <Button
              onClick={onRegister}
              disabled={isLoading || isRegistered}
              className={`w-full ${
                isRegistered 
                  ? "bg-green-500 hover:bg-green-600" 
                  : "bg-blue-600 hover:bg-blue-700"
              } text-white transition-colors`}
              aria-live="polite"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  <span>Registering Passkey...</span>
                </>
              ) : isRegistered ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  <span>Passkey Successfully Registered</span>
                </>
              ) : (
                <>
                  <Shield className="h-4 w-4 mr-2" />
                  <span>Register Passkey</span>
                </>
              )}
            </Button>

            <Button
              variant="outline"
              onClick={onClose}
              className="w-full border-gray-200 text-gray-700 hover:bg-gray-50"
            >
              {isRegistered ? "Close" : "Skip for Now"}
            </Button>
          </div>
        </div>

        {/* Status Messages */}
        {isRegistered && (
          <div className="mt-4 p-3 bg-green-50 rounded-md border border-green-200">
            <p className="text-sm text-green-700 flex items-center">
              <Check className="h-4 w-4 mr-2 text-green-600" />
              Your account is now protected with enhanced security
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}