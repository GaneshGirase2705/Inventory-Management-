package com.powerplant.sms.model.enums;

public enum VedClass {
    V, // Vital (Stops plant generation immediately if failed)
    E, // Essential (Causes boiler/turbine load derating if degraded)
    D  // Desirable (General consumables and non-critical spares)
}
