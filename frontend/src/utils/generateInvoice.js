import { jsPDF } from 'jspdf'
import { formatMoney as money } from './money'

function drawModernHeader(doc, pageWidth, order) {
  const margin = 18

  // Soft canvas background
  doc.setFillColor(248, 250, 252)
  doc.rect(0, 0, pageWidth, 52, 'F')

  // Fluid gradient bands (left → right blue fade)
  const bands = [
    { color: [37, 99, 235], alpha: 0.18, x: 0, w: 42 },
    { color: [59, 130, 246], alpha: 0.12, x: 28, w: 50 },
    { color: [96, 165, 250], alpha: 0.08, x: 60, w: 55 },
    { color: [147, 197, 253], alpha: 0.05, x: 95, w: 60 },
  ]

  bands.forEach((b) => {
    const [r, g, bl] = b.color
    doc.setFillColor(
      Math.round(248 + (r - 248) * b.alpha),
      Math.round(250 + (g - 250) * b.alpha),
      Math.round(252 + (bl - 252) * b.alpha)
    )
    doc.roundedRect(b.x, 6, b.w, 40, 10, 10, 'F')
  })

  // Accent bar (fluid left strip)
  doc.setFillColor(37, 99, 235)
  doc.roundedRect(0, 8, 4, 36, 0, 0, 'F')

  // Decorative soft circle (top-right)
  doc.setFillColor(219, 234, 254)
  doc.circle(pageWidth - 12, 10, 22, 'F')
  doc.setFillColor(191, 219, 254)
  doc.circle(pageWidth - 4, 40, 14, 'F')

  // Brand
  doc.setTextColor(15, 23, 42)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(22)
  doc.text('TechStore', margin + 4, 24)

  // Invoice pill badge
  doc.setFillColor(37, 99, 235)
  doc.roundedRect(margin + 4, 30, 34, 8, 2, 2, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  doc.text('INVOICE', margin + 9, 35.5)

  // Order meta (right)
  const orderNo = order.order_number || '—'
  const dateStr = new Date(order.created_at || Date.now()).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })

  doc.setTextColor(100, 116, 139)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.text('ORDER NUMBER', pageWidth - margin, 18, { align: 'right' })
  doc.setTextColor(15, 23, 42)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.text(orderNo, pageWidth - margin, 25, { align: 'right' })

  doc.setTextColor(100, 116, 139)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.text('DATE', pageWidth - margin, 33, { align: 'right' })
  doc.setTextColor(37, 99, 235)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.text(dateStr, pageWidth - margin, 40, { align: 'right' })

  // Fluid bottom accent line
  doc.setDrawColor(37, 99, 235)
  doc.setLineWidth(0.8)
  doc.line(margin, 50, pageWidth - margin - 40, 50)
  doc.setDrawColor(147, 197, 253)
  doc.setLineWidth(0.5)
  doc.line(pageWidth - margin - 38, 50, pageWidth - margin, 50)
}

export function downloadInvoicePdf(order) {
  if (!order) return

  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 18

  drawModernHeader(doc, pageWidth, order)

  let y = 62

  // Bill To card
  doc.setFillColor(248, 250, 252)
  doc.roundedRect(margin, y - 4, pageWidth - margin * 2, 42, 3, 3, 'F')

  doc.setTextColor(37, 99, 235)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.text('BILL TO', margin + 4, y + 3)

  y += 10
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.setTextColor(15, 23, 42)
  doc.text(String(order.customer_name || ''), margin + 4, y)

  y += 6
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(71, 85, 105)
  const customerLines = [
    order.customer_email,
    order.customer_phone,
    order.shipping_address,
    `${order.city}, ${order.country} ${order.postal_code}`,
  ].filter(Boolean)

  customerLines.forEach((line) => {
    doc.text(String(line), margin + 4, y)
    y += 4.8
  })

  y += 10

  // Payment
  doc.setTextColor(15, 23, 42)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.text('Payment Method', margin, y)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(71, 85, 105)
  const payment =
    order.payment_method === 'cash_on_delivery'
      ? 'Cash on Delivery'
      : order.payment_method === 'card'
        ? 'Credit / Debit Card'
        : String(order.payment_method || '—')
  doc.text(payment, margin + 42, y)

  y += 12
  doc.setTextColor(15, 23, 42)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.text('Order Items', margin, y)
  y += 8

  // Table header
  doc.setFillColor(239, 246, 255)
  doc.roundedRect(margin, y - 5, pageWidth - margin * 2, 9, 2, 2, 'F')
  doc.setFontSize(8)
  doc.setTextColor(37, 99, 235)
  doc.setFont('helvetica', 'bold')
  doc.text('PRODUCT', margin + 3, y)
  doc.text('QTY', pageWidth - margin - 55, y)
  doc.text('UNIT', pageWidth - margin - 35, y)
  doc.text('TOTAL', pageWidth - margin - 2, y, { align: 'right' })
  y += 9

  doc.setFont('helvetica', 'normal')
  doc.setTextColor(15, 23, 42)
  doc.setFontSize(9)

  const items = order.items || []
  if (items.length === 0) {
    doc.setTextColor(100, 116, 139)
    doc.text('No line items available.', margin + 2, y)
    y += 8
  } else {
    items.forEach((item, index) => {
      if (y > 270) {
        doc.addPage()
        y = 20
      }
      if (index % 2 === 0) {
        doc.setFillColor(248, 250, 252)
        doc.roundedRect(margin, y - 4, pageWidth - margin * 2, 8, 1, 1, 'F')
      }
      const name = String(item.product_name || 'Product').slice(0, 48)
      doc.setTextColor(15, 23, 42)
      doc.text(name, margin + 3, y)
      doc.setTextColor(71, 85, 105)
      doc.text(String(item.quantity), pageWidth - margin - 55, y)
      doc.text(money(item.unit_price), pageWidth - margin - 35, y)
      doc.setTextColor(15, 23, 42)
      doc.setFont('helvetica', 'bold')
      doc.text(money(item.total_price), pageWidth - margin - 2, y, { align: 'right' })
      doc.setFont('helvetica', 'normal')
      y += 8
    })
  }

  y += 6
  doc.setDrawColor(226, 232, 240)
  doc.setLineWidth(0.3)
  doc.line(margin, y, pageWidth - margin, y)
  y += 10

  const summaryX = pageWidth - margin
  const labelX = pageWidth - margin - 55
  doc.setFontSize(10)
  doc.setTextColor(100, 116, 139)
  doc.setFont('helvetica', 'normal')

  ;[
    ['Subtotal', money(order.subtotal)],
    ['Shipping', Number(order.shipping_cost) === 0 ? 'Free' : money(order.shipping_cost)],
    ['Tax', money(order.tax ?? Math.max(0, Number(order.total) - Number(order.subtotal) - Number(order.shipping_cost)))],
  ].forEach(([label, value]) => {
    doc.text(label, labelX, y)
    doc.setTextColor(15, 23, 42)
    doc.text(value, summaryX, y, { align: 'right' })
    doc.setTextColor(100, 116, 139)
    y += 6
  })

  y += 3
  // Total highlight pill
  doc.setFillColor(37, 99, 235)
  doc.roundedRect(labelX - 4, y - 5, summaryX - labelX + 8, 12, 3, 3, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.text('Total', labelX, y + 2)
  doc.text(money(order.total), summaryX, y + 2, { align: 'right' })

  y += 20
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(100, 116, 139)
  doc.text('Thank you for shopping with TechStore!', margin, y)
  doc.text('support@techstore.com  ·  +1 (234) 567-8900', margin, y + 5)
  doc.text('123 Technology Avenue, Innovation City', margin, y + 10)

  const filename = `TechStore-Invoice-${order.order_number || 'order'}.pdf`
  doc.save(filename)
}
