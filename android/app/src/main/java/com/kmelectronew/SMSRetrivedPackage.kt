package com.kmelectronew
import com.facebook.react.ReactPackage
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.NativeModule
import com.facebook.react.uimanager.ViewManager
import com.kmelectronew.SMSRetrievedModules
import java.util.ArrayList
class SMSRetrivedPackage : ReactPackage {
    override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> {
        val modules: MutableList<NativeModule> = ArrayList()
        modules.add(SMSRetrievedModules(reactContext))
        return modules
    }
    override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> {
        return emptyList()
    }
}