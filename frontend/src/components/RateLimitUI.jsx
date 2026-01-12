import { ZapIcon } from "lucide-react";
import React from "react";

const RateLimitUI = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="max-w-md w-full mx-4 bg-secondary rounded-lg shadow-lg p-8 border border-gray-200">
        <div className="flex items-center gap-4 mb-6">
          <ZapIcon className="size-10 text-primary" />
          <h3 className="text-2xl font-semibold text-gray-200">
            Rate Limit Reached
          </h3>
        </div>
        <div className="space-y-3 text-gray-200">
          <p>
            You've made too many requests in a short period. Please wait a
            moment.
          </p>
          <p>Try again in a few seconds for the best experience.</p>
        </div>
      </div>
    </div>
  );
};

export default RateLimitUI;
