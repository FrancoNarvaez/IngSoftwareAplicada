import product from 'app/entities/product/product.reducer';
import productCategory from 'app/entities/product-category/product-category.reducer';
import customer from 'app/entities/customer/customer.reducer';
import productOrder from 'app/entities/product-order/product-order.reducer';
import orderItem from 'app/entities/order-item/order-item.reducer';
import invoice from 'app/entities/invoice/invoice/invoice.reducer';
import shipment from 'app/entities/invoice/shipment/shipment.reducer';
import notification from 'app/entities/notification/notification/notification.reducer';
/* jhipster-needle-add-reducer-import - JHipster will add reducer here */

const entitiesReducers = {
  product,
  productCategory,
  customer,
  productOrder,
  orderItem,
  invoice,
  shipment,
  notification,
  /* jhipster-needle-add-reducer-combine - JHipster will add reducer here */
};

export default entitiesReducers;
