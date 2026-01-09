import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  const mailOptions = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    html: options.html
  };

  await transporter.sendMail(mailOptions);
};

export const sendOrderConfirmationEmail = async (order, user) => {
  const itemsHtml = order.items.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">
        <img src="${item.image}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover;">
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">x${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">$${(item.price * item.quantity).toFixed(2)}</td>
    </tr>
  `).join('');

  const html = `
    <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
      <div style="background: #232F3E; padding: 20px; text-align: center;">
        <h1 style="color: #FEBD69; margin: 0;">Electro Store</h1>
      </div>
      
      <div style="padding: 20px;">
        <h2 style="color: #232F3E;">Order Confirmation</h2>
        <p>Hi ${user.name},</p>
        <p>Thank you for your order! We've received your order and will begin processing it soon.</p>
        
        <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p style="margin: 0;"><strong>Order Number:</strong> ${order.orderNumber}</p>
          <p style="margin: 5px 0 0;"><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
        </div>
        
        <h3 style="color: #232F3E;">Order Details</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background: #f5f5f5;">
              <th style="padding: 10px; text-align: left;">Image</th>
              <th style="padding: 10px; text-align: left;">Product</th>
              <th style="padding: 10px; text-align: left;">Qty</th>
              <th style="padding: 10px; text-align: left;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>
        
        <div style="margin-top: 20px; text-align: right;">
          <p><strong>Subtotal:</strong> $${order.subtotal.toFixed(2)}</p>
          <p><strong>Shipping:</strong> $${order.shippingCost.toFixed(2)}</p>
          <p><strong>Tax:</strong> $${order.tax.toFixed(2)}</p>
          <p style="font-size: 18px;"><strong>Total:</strong> $${order.total.toFixed(2)}</p>
        </div>
        
        <h3 style="color: #232F3E;">Shipping Address</h3>
        <p>
          ${order.shippingAddress.fullName}<br>
          ${order.shippingAddress.street}<br>
          ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postalCode}<br>
          ${order.shippingAddress.country}
        </p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
          <p style="color: #666;">If you have any questions, please contact our support team.</p>
        </div>
      </div>
      
      <div style="background: #232F3E; padding: 15px; text-align: center;">
        <p style="color: #fff; margin: 0; font-size: 12px;">© 2024 Electro Store. All rights reserved.</p>
      </div>
    </div>
  `;

  await sendEmail({
    email: user.email,
    subject: `Order Confirmation - ${order.orderNumber}`,
    html
  });
};

export const sendOrderStatusUpdateEmail = async (order, user) => {
  const statusColors = {
    pending: '#FFC107',
    processing: '#2196F3',
    shipped: '#9C27B0',
    delivered: '#4CAF50',
    cancelled: '#F44336'
  };

  const html = `
    <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
      <div style="background: #232F3E; padding: 20px; text-align: center;">
        <h1 style="color: #FEBD69; margin: 0;">Electro Store</h1>
      </div>
      
      <div style="padding: 20px;">
        <h2 style="color: #232F3E;">Order Status Update</h2>
        <p>Hi ${user.name},</p>
        <p>Your order status has been updated.</p>
        
        <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p style="margin: 0;"><strong>Order Number:</strong> ${order.orderNumber}</p>
          <p style="margin: 5px 0;">
            <strong>Status:</strong> 
            <span style="background: ${statusColors[order.status]}; color: white; padding: 3px 10px; border-radius: 3px; text-transform: uppercase;">
              ${order.status}
            </span>
          </p>
        </div>
        
        <p>You can track your order status by logging into your account.</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
          <p style="color: #666;">If you have any questions, please contact our support team.</p>
        </div>
      </div>
      
      <div style="background: #232F3E; padding: 15px; text-align: center;">
        <p style="color: #fff; margin: 0; font-size: 12px;">© 2024 Electro Store. All rights reserved.</p>
      </div>
    </div>
  `;

  await sendEmail({
    email: user.email,
    subject: `Order ${order.orderNumber} - Status Updated to ${order.status.toUpperCase()}`,
    html
  });
};

export default sendEmail;

