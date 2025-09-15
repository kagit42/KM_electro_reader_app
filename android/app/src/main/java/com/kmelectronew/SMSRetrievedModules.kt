package com.kmelectronew
import android.app.Activity
import android.content.Intent
import android.content.IntentFilter
import android.util.Log
import androidx.annotation.Nullable
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.google.android.gms.auth.api.phone.SmsRetriever
import com.google.android.gms.tasks.Task
class SMSRetrievedModules internal constructor(private var reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    private var receiver: SmsRetrieveBroadcastReceiver? = null
    private val E_OTP_ERROR = "E_OTP_ERROR"
    private val RECEIVED_OTP_PROPERTY = "receivedOtpMessage"
    val SMS_CONSENT_REQUEST = 1244
    private val mActivityEventListener: ActivityEventListener = object : BaseActivityEventListener() {
        override fun onActivityResult(activity: Activity, requestCode: Int, resultCode: Int, intent: Intent?) {
            try {
                if (requestCode == SMS_CONSENT_REQUEST) {
                    unregisterReceiver()
                    val map = Arguments.createMap()
                    if (resultCode === Activity.RESULT_OK) {
                        // Get SMS message content
                        val message = intent!!.getStringExtra(SmsRetriever.EXTRA_SMS_MESSAGE)
                        map.putString(RECEIVED_OTP_PROPERTY, message)
                        sendEvent(Constants.SMS_CONSTANT_EVENT, map)
                    } else {
                        map.putString(RECEIVED_OTP_PROPERTY, null)
                        sendEvent(Constants.SMS_CONSTANT_EVENT, map)
                    }
                } else if (requestCode == MY_REQUEST_CODE) {
                    if (resultCode != Activity.RESULT_OK) {
                        // If the update is cancelled or fails,
                        // you can request to start the update again.
                    }
                }
            } catch (e: Exception) {
            }
        }
    }
    override fun getName(): String {
        return "SMSRetrived"
    }
    @ReactMethod
    fun checkUpdate() {
        Log.d("chado","method");
       val task: Task<Void> = SmsRetriever.getClient(reactContext.currentActivity!!).startSmsUserConsent(null)
        task.addOnSuccessListener { // successfully started an SMS Retriever for one SMS message
            registerReceiver()
        }
        task.addOnFailureListener {
        }
    }
   private fun registerReceiver() {
  receiver = SmsRetrieveBroadcastReceiver()

    val intentFilter = IntentFilter(SmsRetriever.SMS_RETRIEVED_ACTION)

    if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.TIRAMISU) {
        reactContext.currentActivity!!.registerReceiver(
            receiver,
            intentFilter,
            android.content.Context.RECEIVER_EXPORTED  // required since SMS_RETRIEVED comes from Google Play Services
        )
    } else if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.S) {
        reactContext.currentActivity!!.registerReceiver(
            receiver,
            intentFilter,
            android.content.Context.RECEIVER_EXPORTED
        )
    } else {
        @Suppress("DEPRECATION")
        reactContext.currentActivity!!.registerReceiver(receiver, intentFilter)
    }
}

    @ReactMethod
    private fun unregisterReceiver() {
        try {
            if (receiver != null) {
                reactContext.currentActivity!!.unregisterReceiver(receiver)
                receiver = null
            }
        } catch (e: Exception) {
            e.message
        }
    }
    private fun sendEvent(eventName: String,
                          @Nullable params: WritableMap) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java) //supply the result in params
                .emit(eventName, params)
    }
    companion object {
        private const val STALE_DAYS = 5
        private const val MY_REQUEST_CODE = 0
    }
    init {
        reactContext.addActivityEventListener(mActivityEventListener)
    }
}