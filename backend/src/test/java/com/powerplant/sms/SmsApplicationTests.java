package com.powerplant.sms;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("dev")
class SmsApplicationTests {

    @Test
    void contextLoads() {
        // Verifies Spring context, security configuration, JPA entity mappings, and repositories load cleanly
    }
}
