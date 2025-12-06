package com.jhipster.demo.invoice.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

import com.jhipster.demo.invoice.domain.Invoice;
import com.jhipster.demo.invoice.domain.enumeration.InvoiceStatus;
import com.jhipster.demo.invoice.domain.enumeration.PaymentMethod;
import com.jhipster.demo.invoice.repository.InvoiceRepository;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

class InvoiceServiceTest {

    @Mock
    private InvoiceRepository invoiceRepository;

    @InjectMocks
    private InvoiceService invoiceService;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void partialUpdate_shouldUpdateOnlyProvidedFields() {
        // Existing invoice in repository
        Invoice existing = new Invoice()
            .id(1L)
            .code("INV-001")
            .date(Instant.parse("2024-01-01T00:00:00Z"))
            .details("old")
            .status(InvoiceStatus.PAID)
            .paymentMethod(PaymentMethod.CREDIT_CARD)
            .paymentDate(Instant.parse("2024-01-02T00:00:00Z"))
            .paymentAmount(new BigDecimal("100.00"));

        when(invoiceRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(invoiceRepository.save(any(Invoice.class))).thenAnswer(inv -> inv.getArgument(0));

        // Partial with new details and amount only
        Invoice partial = new Invoice().id(1L).details("updated").paymentAmount(new BigDecimal("150.00"));

    Optional<Invoice> result = invoiceService.partialUpdate(partial);
    assertThat(result).isPresent();
    Invoice updated = result.orElseThrow();

        assertThat(updated.getDetails()).isEqualTo("updated");
        assertThat(updated.getPaymentAmount()).isEqualByComparingTo("150.00");
        // Unchanged fields
        assertThat(updated.getCode()).isEqualTo("INV-001");
        assertThat(updated.getStatus()).isEqualTo(InvoiceStatus.PAID);
        assertThat(updated.getPaymentMethod()).isEqualTo(PaymentMethod.CREDIT_CARD);
    }

    @Test
    void findAll_shouldDelegateToRepository() {
        when(invoiceRepository.findAll(any(org.springframework.data.domain.Pageable.class)))
            .thenReturn(new PageImpl<>(java.util.List.of(new Invoice().id(1L))));
        var page = invoiceService.findAll(PageRequest.of(0, 20));
        assertThat(page.getTotalElements()).isEqualTo(1);
        assertThat(page.getContent().getFirst().getId()).isEqualTo(1L);
        verify(invoiceRepository, times(1)).findAll(any(org.springframework.data.domain.Pageable.class));
    }
}
