package com.jhipster.demo.store.domain;

import static com.jhipster.demo.store.domain.CustomerTestSamples.*;
import static com.jhipster.demo.store.domain.OrderItemTestSamples.*;
import static com.jhipster.demo.store.domain.ProductOrderTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.jhipster.demo.store.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class ProductOrderTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ProductOrder.class);
        ProductOrder productOrder1 = getProductOrderSample1();
        ProductOrder productOrder2 = new ProductOrder();
        assertThat(productOrder1).isNotEqualTo(productOrder2);

        productOrder2.setId(productOrder1.getId());
        assertThat(productOrder1).isEqualTo(productOrder2);

        productOrder2 = getProductOrderSample2();
        assertThat(productOrder1).isNotEqualTo(productOrder2);
    }

    @Test
    void orderItemTest() {
        ProductOrder productOrder = getProductOrderRandomSampleGenerator();
        OrderItem orderItemBack = getOrderItemRandomSampleGenerator();

        productOrder.addOrderItem(orderItemBack);
        assertThat(productOrder.getOrderItems()).containsOnly(orderItemBack);
        assertThat(orderItemBack.getOrder()).isEqualTo(productOrder);

        productOrder.removeOrderItem(orderItemBack);
        assertThat(productOrder.getOrderItems()).doesNotContain(orderItemBack);
        assertThat(orderItemBack.getOrder()).isNull();

        productOrder.orderItems(new HashSet<>(Set.of(orderItemBack)));
        assertThat(productOrder.getOrderItems()).containsOnly(orderItemBack);
        assertThat(orderItemBack.getOrder()).isEqualTo(productOrder);

        productOrder.setOrderItems(new HashSet<>());
        assertThat(productOrder.getOrderItems()).doesNotContain(orderItemBack);
        assertThat(orderItemBack.getOrder()).isNull();
    }

    @Test
    void customerTest() {
        ProductOrder productOrder = getProductOrderRandomSampleGenerator();
        Customer customerBack = getCustomerRandomSampleGenerator();

        productOrder.setCustomer(customerBack);
        assertThat(productOrder.getCustomer()).isEqualTo(customerBack);

        productOrder.customer(null);
        assertThat(productOrder.getCustomer()).isNull();
    }
}
