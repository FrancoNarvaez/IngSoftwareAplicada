package com.jhipster.demo.notification.management;

import static org.assertj.core.api.Assertions.assertThat;

import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.simple.SimpleMeterRegistry;
import org.junit.jupiter.api.Test;

class SecurityMetersServiceTest {

    @Test
    void countersIncrementOnTrackMethods() {
        MeterRegistry registry = new SimpleMeterRegistry();
        SecurityMetersService service = new SecurityMetersService(registry);

        // Act
        service.trackTokenInvalidSignature();
        service.trackTokenExpired();
        service.trackTokenUnsupported();
        service.trackTokenMalformed();
        service.trackTokenMalformed(); // twice

        // Assert
        assertThat(registry.get(SecurityMetersService.INVALID_TOKENS_METER_NAME)
            .tag(SecurityMetersService.INVALID_TOKENS_METER_CAUSE_DIMENSION, "invalid-signature")
            .counter().count()).isEqualTo(1.0);

        assertThat(registry.get(SecurityMetersService.INVALID_TOKENS_METER_NAME)
            .tag(SecurityMetersService.INVALID_TOKENS_METER_CAUSE_DIMENSION, "expired")
            .counter().count()).isEqualTo(1.0);

        assertThat(registry.get(SecurityMetersService.INVALID_TOKENS_METER_NAME)
            .tag(SecurityMetersService.INVALID_TOKENS_METER_CAUSE_DIMENSION, "unsupported")
            .counter().count()).isEqualTo(1.0);

        assertThat(registry.get(SecurityMetersService.INVALID_TOKENS_METER_NAME)
            .tag(SecurityMetersService.INVALID_TOKENS_METER_CAUSE_DIMENSION, "malformed")
            .counter().count()).isEqualTo(2.0);
    }
}
