<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>TechStore Invoice {{ $order->order_number }}</title>
  <style>
    @page { margin: 18px 18px 24px; }
    * { box-sizing: border-box; }
    body {
      font-family: DejaVu Sans, sans-serif;
      font-size: 11px;
      color: #0f172a;
      margin: 0;
      padding: 0;
    }

    /* Header — matches frontend jsPDF design */
    .header {
      position: relative;
      background: #f8fafc;
      border-radius: 10px;
      padding: 18px 20px 16px;
      overflow: hidden;
      margin-bottom: 18px;
    }
    .header-accent {
      position: absolute;
      left: 0;
      top: 10px;
      width: 5px;
      height: 48px;
      background: #2563eb;
      border-radius: 0 4px 4px 0;
    }
    .header-band {
      position: absolute;
      top: 8px;
      height: 48px;
      border-radius: 10px;
      opacity: 0.55;
    }
    .band-1 { left: 0; width: 90px; background: #dbeafe; }
    .band-2 { left: 50px; width: 100px; background: #bfdbfe; }
    .band-3 { left: 110px; width: 90px; background: #eff6ff; }
    .header-circle {
      position: absolute;
      right: -10px;
      top: -8px;
      width: 56px;
      height: 56px;
      background: #dbeafe;
      border-radius: 50%;
    }
    .header-circle-2 {
      position: absolute;
      right: -4px;
      bottom: 4px;
      width: 36px;
      height: 36px;
      background: #bfdbfe;
      border-radius: 50%;
    }
    .header-inner { position: relative; z-index: 2; }
    .brand-row { overflow: hidden; }
    .brand {
      float: left;
      font-size: 22px;
      font-weight: bold;
      color: #0f172a;
      margin: 0 0 8px;
      padding-left: 10px;
    }
    .meta-block {
      float: right;
      text-align: right;
      padding-right: 4px;
    }
    .meta-label {
      font-size: 8px;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      margin: 0;
    }
    .meta-value {
      font-size: 11px;
      font-weight: bold;
      color: #0f172a;
      margin: 2px 0 8px;
    }
    .meta-date { color: #2563eb; font-size: 10px; }
    .invoice-pill {
      display: inline-block;
      background: #2563eb;
      color: #fff;
      font-size: 8px;
      font-weight: bold;
      letter-spacing: 0.06em;
      padding: 4px 10px;
      border-radius: 4px;
      margin-left: 10px;
    }
    .header-line {
      clear: both;
      height: 2px;
      margin-top: 10px;
      margin-left: 10px;
      background: linear-gradient(to right, #2563eb 0%, #2563eb 70%, #93c5fd 70%, #93c5fd 100%);
    }
    .header-line-bar {
      height: 2px;
      background: #2563eb;
      width: 78%;
      float: left;
    }
    .header-line-bar-soft {
      height: 2px;
      background: #93c5fd;
      width: 22%;
      float: left;
    }

    /* Bill to card */
    .bill-card {
      background: #f8fafc;
      border-radius: 8px;
      padding: 12px 14px;
      margin-bottom: 16px;
    }
    .section-label {
      color: #2563eb;
      font-size: 9px;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      margin: 0 0 6px;
    }
    .customer-name {
      font-size: 12px;
      font-weight: bold;
      color: #0f172a;
      margin: 0 0 4px;
    }
    .customer-line {
      font-size: 9px;
      color: #475569;
      margin: 0 0 3px;
      line-height: 1.4;
    }

    .payment {
      margin-bottom: 14px;
      font-size: 10px;
    }
    .payment strong { color: #0f172a; }
    .payment span { color: #475569; margin-left: 8px; }

    .items-title {
      font-size: 10px;
      font-weight: bold;
      color: #0f172a;
      margin: 0 0 8px;
    }

    table.items {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 14px;
    }
    table.items thead th {
      background: #eff6ff;
      color: #2563eb;
      font-size: 8px;
      font-weight: bold;
      text-transform: uppercase;
      text-align: left;
      padding: 8px 6px;
    }
    table.items thead th:last-child { text-align: right; }
    table.items tbody td {
      font-size: 9px;
      padding: 8px 6px;
      border-bottom: 1px solid #f1f5f9;
      color: #0f172a;
    }
    table.items tbody tr:nth-child(even) td { background: #f8fafc; }
    table.items .muted { color: #475569; }
    table.items .right { text-align: right; }
    table.items .bold { font-weight: bold; }

    .summary-wrap { width: 100%; overflow: hidden; }
    .summary {
      float: right;
      width: 200px;
    }
    .summary-row {
      overflow: hidden;
      margin-bottom: 6px;
      font-size: 10px;
    }
    .summary-row .lbl { float: left; color: #64748b; }
    .summary-row .val { float: right; color: #0f172a; font-weight: bold; }
    .total-pill {
      clear: both;
      background: #2563eb;
      color: #fff;
      border-radius: 6px;
      padding: 10px 12px;
      margin-top: 6px;
      overflow: hidden;
    }
    .total-pill .lbl { float: left; font-weight: bold; font-size: 11px; }
    .total-pill .val { float: right; font-weight: bold; font-size: 11px; }

    .footer {
      clear: both;
      margin-top: 28px;
      padding-top: 10px;
      font-size: 9px;
      color: #64748b;
      line-height: 1.5;
    }
  </style>
</head>
<body>
  @php
    $dateStr = optional($order->created_at)->format('d M Y') ?? now()->format('d M Y');
    $payment = match ($order->payment_method) {
      'cash_on_delivery' => 'Cash on Delivery',
      'card', 'stripe' => 'Credit / Debit Card',
      default => $order->payment_method ?: '—',
    };
    $shippingLabel = (float) $order->shipping_cost == 0
      ? 'Free'
      : number_format($order->shipping_cost, 2).' MAD';
  @endphp

  <div class="header">
    <div class="header-band band-1"></div>
    <div class="header-band band-2"></div>
    <div class="header-band band-3"></div>
    <div class="header-circle"></div>
    <div class="header-circle-2"></div>
    <div class="header-accent"></div>
    <div class="header-inner">
      <div class="brand-row">
        <div class="brand">
          TechStore
          <div><span class="invoice-pill">INVOICE</span></div>
        </div>
        <div class="meta-block">
          <p class="meta-label">Order Number</p>
          <p class="meta-value">{{ $order->order_number }}</p>
          <p class="meta-label">Date</p>
          <p class="meta-value meta-date">{{ $dateStr }}</p>
        </div>
      </div>
      <div class="header-line">
        <div class="header-line-bar"></div>
        <div class="header-line-bar-soft"></div>
      </div>
    </div>
  </div>

  <div class="bill-card">
    <p class="section-label">Bill To</p>
    <p class="customer-name">{{ $order->customer_name }}</p>
    <p class="customer-line">{{ $order->customer_email }}</p>
    <p class="customer-line">{{ $order->customer_phone }}</p>
    <p class="customer-line">{{ $order->shipping_address }}</p>
    <p class="customer-line">{{ $order->city }}, {{ $order->country }} {{ $order->postal_code }}</p>
  </div>

  <div class="payment">
    <strong>Payment Method</strong>
    <span>{{ $payment }}</span>
  </div>

  <p class="items-title">Order Items</p>
  <table class="items">
    <thead>
      <tr>
        <th style="width:50%">Product</th>
        <th style="width:12%">Qty</th>
        <th style="width:18%">Unit</th>
        <th style="width:20%" class="right">Total</th>
      </tr>
    </thead>
    <tbody>
      @forelse($order->items as $item)
        <tr>
          <td>{{ \Illuminate\Support\Str::limit($item->product_name, 48) }}</td>
          <td class="muted">{{ $item->quantity }}</td>
          <td class="muted">{{ number_format($item->unit_price, 2) }} MAD</td>
          <td class="right bold">{{ number_format($item->total_price, 2) }} MAD</td>
        </tr>
      @empty
        <tr>
          <td colspan="4" class="muted">No line items available.</td>
        </tr>
      @endforelse
    </tbody>
  </table>

  <div class="summary-wrap">
    <div class="summary">
      <div class="summary-row">
        <span class="lbl">Subtotal</span>
        <span class="val">{{ number_format($order->subtotal, 2) }} MAD</span>
      </div>
      <div class="summary-row">
        <span class="lbl">Shipping</span>
        <span class="val">{{ $shippingLabel }}</span>
      </div>
      <div class="summary-row">
        <span class="lbl">Tax</span>
        <span class="val">{{ number_format($order->tax, 2) }} MAD</span>
      </div>
      <div class="total-pill">
        <span class="lbl">Total</span>
        <span class="val">{{ number_format($order->total, 2) }} MAD</span>
      </div>
    </div>
  </div>

  <div class="footer">
    Thank you for shopping with TechStore!<br>
    support@techstore.com &nbsp;·&nbsp; +1 (234) 567-8900<br>
    123 Technology Avenue, Innovation City
  </div>
</body>
</html>
