export const Message = {
  notFound: (id) => `Order ${id} not found`,
  cannotCancel: (id, status) => `Order ${id} can not cancel with status ${status}`,
  mustBeGreaterThan: (key, target) => `${key} must be greater than ${target}`,
  cannotCheckout: (id) => `Unable to execute payment. Order ${id} is in processing or finished.`,
  rejectPayment: (id) => `Checkout order ${id} failed. Payment has been rejected.`,
  paymentComplete: (id) => `Order ${id} Checkout completed.`,
  notEmpty: (key) => `${key} can not empty`
}