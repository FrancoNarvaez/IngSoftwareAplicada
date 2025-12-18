package com.jhipster.demo.store.web.rest;

import com.jhipster.demo.store.domain.ProductOrder;
import com.jhipster.demo.store.repository.ProductOrderRepository;
import com.jhipster.demo.store.service.ProductOrderService;
import com.jhipster.demo.store.web.rest.errors.BadRequestAlertException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.util.ForwardedHeaderUtils;
import reactor.core.publisher.Mono;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.reactive.ResponseUtil;

/**
 * REST controller for managing {@link com.jhipster.demo.store.domain.ProductOrder}.
 */
@RestController
@RequestMapping("/api/product-orders")
public class ProductOrderResource {

    private static final Logger LOG = LoggerFactory.getLogger(ProductOrderResource.class);

    private static final String ENTITY_NAME = "productOrder";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ProductOrderService productOrderService;

    private final ProductOrderRepository productOrderRepository;

    public ProductOrderResource(ProductOrderService productOrderService, ProductOrderRepository productOrderRepository) {
        this.productOrderService = productOrderService;
        this.productOrderRepository = productOrderRepository;
    }

    /**
     * {@code POST  /product-orders} : Create a new productOrder.
     *
     * @param productOrder the productOrder to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new productOrder, or with status {@code 400 (Bad Request)} if the productOrder has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public Mono<ResponseEntity<ProductOrder>> createProductOrder(@Valid @RequestBody ProductOrder productOrder) throws URISyntaxException {
        LOG.info("Creating new order - Customer: {}, Items count: {}, Status: {}, Code: {}",
            productOrder.getCustomer() != null ? productOrder.getCustomer().getId() : "N/A",
            productOrder.getOrderItems() != null ? productOrder.getOrderItems().size() : 0,
            productOrder.getStatus(),
            productOrder.getCode()
        );
        
        if (productOrder.getId() != null) {
            LOG.error("Order creation failed - Order already has ID: {}", productOrder.getId());
            throw new BadRequestAlertException("A new productOrder cannot already have an ID", ENTITY_NAME, "idexists");
        }
        
        return productOrderService
            .save(productOrder)
            .doOnSuccess(result -> {
                LOG.info("Order created successfully - Order ID: {}, Customer: {}, Status: {}, Code: {}",
                    result.getId(),
                    result.getCustomer() != null ? result.getCustomer().getId() : "N/A",
                    result.getStatus(),
                    result.getCode()
                );
            })
            .doOnError(error -> {
                LOG.error("Order creation failed - Customer: {}, Error: {}",
                    productOrder.getCustomer() != null ? productOrder.getCustomer().getId() : "N/A",
                    error.getMessage(),
                    error
                );
            })
            .map(result -> {
                try {
                    return ResponseEntity.created(new URI("/api/product-orders/" + result.getId()))
                        .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
                        .body(result);
                } catch (URISyntaxException e) {
                    throw new RuntimeException(e);
                }
            });
    }

    /**
     * {@code PUT  /product-orders/:id} : Updates an existing productOrder.
     *
     * @param id the id of the productOrder to save.
     * @param productOrder the productOrder to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated productOrder,
     * or with status {@code 400 (Bad Request)} if the productOrder is not valid,
     * or with status {@code 500 (Internal Server Error)} if the productOrder couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public Mono<ResponseEntity<ProductOrder>> updateProductOrder(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody ProductOrder productOrder
    ) throws URISyntaxException {
        LOG.debug("REST request to update ProductOrder : {}, {}", id, productOrder);
        if (productOrder.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, productOrder.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        return productOrderRepository
            .existsById(id)
            .flatMap(exists -> {
                if (!exists) {
                    return Mono.error(new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound"));
                }

                return productOrderService
                    .update(productOrder)
                    .switchIfEmpty(Mono.error(new ResponseStatusException(HttpStatus.NOT_FOUND)))
                    .map(result ->
                        ResponseEntity.ok()
                            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
                            .body(result)
                    );
            });
    }

    /**
     * {@code PATCH  /product-orders/:id} : Partial updates given fields of an existing productOrder, field will ignore if it is null
     *
     * @param id the id of the productOrder to save.
     * @param productOrder the productOrder to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated productOrder,
     * or with status {@code 400 (Bad Request)} if the productOrder is not valid,
     * or with status {@code 404 (Not Found)} if the productOrder is not found,
     * or with status {@code 500 (Internal Server Error)} if the productOrder couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public Mono<ResponseEntity<ProductOrder>> partialUpdateProductOrder(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody ProductOrder productOrder
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update ProductOrder partially : {}, {}", id, productOrder);
        if (productOrder.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, productOrder.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        return productOrderRepository
            .existsById(id)
            .flatMap(exists -> {
                if (!exists) {
                    return Mono.error(new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound"));
                }

                Mono<ProductOrder> result = productOrderService.partialUpdate(productOrder);

                return result
                    .switchIfEmpty(Mono.error(new ResponseStatusException(HttpStatus.NOT_FOUND)))
                    .map(res ->
                        ResponseEntity.ok()
                            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, res.getId().toString()))
                            .body(res)
                    );
            });
    }

    /**
     * {@code GET  /product-orders} : get all the productOrders.
     *
     * @param pageable the pagination information.
     * @param request a {@link ServerHttpRequest} request.
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of productOrders in body.
     */
    @GetMapping(value = "", produces = MediaType.APPLICATION_JSON_VALUE)
    public Mono<ResponseEntity<List<ProductOrder>>> getAllProductOrders(
        @org.springdoc.core.annotations.ParameterObject Pageable pageable,
        ServerHttpRequest request,
        @RequestParam(name = "eagerload", required = false, defaultValue = "true") boolean eagerload
    ) {
        LOG.info("Fetching orders - Page: {}, Size: {}, Eager load: {}",
            pageable.getPageNumber(),
            pageable.getPageSize(),
            eagerload
        );
        
        return productOrderService
            .countAll()
            .zipWith(productOrderService.findAll(pageable).collectList())
            .doOnSuccess(countWithEntities -> {
                LOG.info("Orders retrieved successfully - Total orders: {}, Page items: {}",
                    countWithEntities.getT1(),
                    countWithEntities.getT2().size()
                );
            })
            .map(countWithEntities ->
                ResponseEntity.ok()
                    .headers(
                        PaginationUtil.generatePaginationHttpHeaders(
                            ForwardedHeaderUtils.adaptFromForwardedHeaders(request.getURI(), request.getHeaders()),
                            new PageImpl<>(countWithEntities.getT2(), pageable, countWithEntities.getT1())
                        )
                    )
                    .body(countWithEntities.getT2())
            );
    }

    /**
     * {@code GET  /product-orders/:id} : get the "id" productOrder.
     *
     * @param id the id of the productOrder to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the productOrder, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public Mono<ResponseEntity<ProductOrder>> getProductOrder(@PathVariable("id") Long id) {
        LOG.debug("REST request to get ProductOrder : {}", id);
        Mono<ProductOrder> productOrder = productOrderService.findOne(id);
        return ResponseUtil.wrapOrNotFound(productOrder);
    }

    /**
     * {@code DELETE  /product-orders/:id} : delete the "id" productOrder.
     *
     * @param id the id of the productOrder to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public Mono<ResponseEntity<Void>> deleteProductOrder(@PathVariable("id") Long id) {
        LOG.info("Deleting order - Order ID: {}", id);
        
        return productOrderService
            .delete(id)
            .doOnSuccess(v -> {
                LOG.info("Order deleted successfully - Order ID: {}", id);
            })
            .doOnError(error -> {
                LOG.error("Order deletion failed - Order ID: {}, Error: {}", id, error.getMessage(), error);
            })
            .then(
                Mono.just(
                    ResponseEntity.noContent()
                        .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
                        .build()
                )
            );
    }
}
