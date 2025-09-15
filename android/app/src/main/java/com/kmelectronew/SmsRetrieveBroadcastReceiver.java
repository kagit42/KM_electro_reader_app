package com.kmelectronew;

import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;

import com.google.android.gms.auth.api.phone.SmsRetriever;
import com.google.android.gms.common.api.CommonStatusCodes;
import com.google.android.gms.common.api.Status;

public class SmsRetrieveBroadcastReceiver extends BroadcastReceiver {
    public static final int SMS_CONSENT_REQUEST = 1244;

    public SmsRetrieveBroadcastReceiver() {
        super(); // 👈 required default constructor
    }

    @Override
    public void onReceive(Context context, Intent intent) {
        if (SmsRetriever.SMS_RETRIEVED_ACTION.equals(intent.getAction())) {
            Bundle extras = intent.getExtras();
            Status smsRetrieverStatus = (Status) extras.get(SmsRetriever.EXTRA_STATUS);
            int statusCode = smsRetrieverStatus.getStatusCode();
            switch (statusCode) {
                case CommonStatusCodes.SUCCESS:
                    // Get consent intent
                    Intent consentIntent = extras.getParcelable(SmsRetriever.EXTRA_CONSENT_INTENT);
                    try {
                        if (consentIntent != null) {
                            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                                consentIntent.removeFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
                                consentIntent.removeFlags(Intent.FLAG_GRANT_WRITE_URI_PERMISSION);
                                consentIntent.removeFlags(Intent.FLAG_GRANT_PERSISTABLE_URI_PERMISSION);
                                consentIntent.removeFlags(Intent.FLAG_GRANT_PREFIX_URI_PERMISSION);
                            }
                            if (context instanceof Activity) {
                                ((Activity) context).startActivityForResult(consentIntent, SMS_CONSENT_REQUEST);
                            } else {
                                consentIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                                context.startActivity(consentIntent);
                            }
                        }
                    } catch (ActivityNotFoundException e) {
                        Log.e("SmsReceiver", "Consent activity not found", e);
                    }
                    break;

                case CommonStatusCodes.TIMEOUT:
                    Log.e("SmsReceiver", "SMS Retriever timed out");
                    break;
            }
        }
    }
}
