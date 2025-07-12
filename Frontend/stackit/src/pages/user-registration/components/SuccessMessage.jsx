import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SuccessMessage = ({ email, onContinue }) => {
  const handleResendEmail = () => {
    // Mock resend email functionality
    console.log('Resending verification email to:', email);
  };

  return (
    <div className="text-center space-y-6">
      <div className="flex justify-center">
        <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center">
          <Icon name="CheckCircle" size={32} className="text-success" />
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-foreground">
          Account Created Successfully!
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          We've sent a verification email to{' '}
          <span className="font-medium text-foreground">{email}</span>.
          Please check your inbox and click the verification link to activate your account.
        </p>
      </div>

      <div className="space-y-4">
        <Button
          variant="default"
          size="lg"
          fullWidth
          onClick={onContinue}
          className="max-w-sm mx-auto"
        >
          Continue to Dashboard
        </Button>

        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-2">
            Didn't receive the email?
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleResendEmail}
            className="text-primary"
          >
            Resend verification email
          </Button>
        </div>
      </div>

      <div className="bg-muted/50 rounded-lg p-4 text-left max-w-md mx-auto">
        <div className="flex items-start space-x-3">
          <Icon name="Info" size={16} className="text-primary mt-0.5 flex-shrink-0" />
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">
              What's next?
            </p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Check your email for verification link</li>
              <li>• Complete your profile setup</li>
              <li>• Start asking and answering questions</li>
              <li>• Join the community discussions</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessMessage;