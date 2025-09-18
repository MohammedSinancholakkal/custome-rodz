import React from "react";

const PrivacyTerms = () => {
  return (


    <div className="container my-5 " style={{ lineHeight: "1.8", fontSize: "16px" }}>
      <h1 className="text-center mb-4 text-info">Privacy Policy & Terms & Conditions</h1>
      <p className="text-muted text-center">Effective Date: 14 August 2025</p>

      {/* Privacy Policy */}
      <section className="mb-5">
        <h2 className="mb-3 text-info">1. Privacy Policy</h2>
        <h5 className="text-info">Information We Collect</h5>
        <ul>
          <li>Personal Information: Name, email, phone, billing/shipping address.</li>
          <li>Account Information: Login details if you create an account.</li>
          <li>Payment Information: Processed securely via third-party gateways.</li>
          <li>Service Details: Bike details, service history, bookings.</li>
          <li>Technical Data: IP address, browser type, usage data via cookies.</li>
        </ul>

        <h5 className="text-info">How We Use Your Information</h5>
        <ul>
          <li>Process orders and deliver products.</li>
          <li>Manage bike service bookings.</li>
          <li>Send confirmations, invoices, and reminders.</li>
          <li>Improve our services and website performance.</li>
          <li>Send promotional updates (if opted-in).</li>
        </ul>

        <h5 className="text-info">Sharing Your Information</h5>
        <p>
          We never sell your data. We may share it with service providers (couriers, payment
          gateways, IT support) and legal authorities when required.
        </p>

        <h5 className="text-info">Cookies & Tracking</h5>
        <p>
          Our site uses cookies to enhance your browsing experience and analyze traffic. You
          can manage or disable cookies in your browser settings.
        </p>

        <h5 className="text-info">Data Security</h5>
        <p>
          We implement secure systems to protect your data, but no online method is 100% safe.
        </p>

        <h5 className="text-info">Your Rights</h5>
        <ul>
          <li>Request, update, or delete your personal data.</li>
          <li>Opt out of marketing emails anytime.</li>
        </ul>
      </section>

      {/* Terms & Conditions */}
      <section>
        <h2 className="mb-3 text-info">2. Terms & Conditions</h2>
        <h5 className="text-info">General</h5>
        <p>
          By using our website, you agree to these terms. You must be at least 18 years old or
          have guardian consent to use our services.
        </p>

        <h5 className="text-info">Products & Services</h5>
        <p>
          Images are for reference only; actual items may differ. Services are subject to
          booking availability.
        </p>

        <h5 className="text-info">Pricing & Payment</h5>
        <ul>
          <li>Prices are in INR and include applicable taxes unless stated otherwise.</li>
          <li>Payment is required before processing orders or services.</li>
        </ul>

        <h5 className="text-info">Orders & Delivery</h5>
        <ul>
          <li>Orders are processed after payment confirmation.</li>
          <li>Delivery times vary depending on courier and location.</li>
        </ul>

        <h5 className="text-info">Service Bookings</h5>
        <ul>
          <li>Provide accurate bike details for booking.</li>
          <li>Additional repairs or parts will be charged after approval.</li>
        </ul>

        <h5 className="text-info">Returns & Refunds</h5>
        <ul>
          <li>Products must be unused and returned within 7 days.</li>
          <li>Service fees are non-refundable once completed.</li>
        </ul>

        <h5 className="text-info">User Responsibilities</h5>
        <ul>
          <li>Keep your account details secure.</li>
          <li>Do not misuse our website or commit fraud.</li>
        </ul>

        <h5 className="text-info">Liability</h5>
        <p>
          Custom Rodz is not responsible for indirect or incidental damages. Our liability is
          limited to the amount paid by you.
        </p>

        <h5 className="text-info">Intellectual Property</h5>
        <p>
          All content on this site belongs to Custom Rodz and may not be reused without
          permission.
        </p>
      </section>

      {/* Footer */}
      <section className="mt-5">
        <h5 className="text-info">3. Changes & Updates</h5>
        <p>
          We may update this page from time to time. The latest version will always be
          available here with an updated date.
        </p>

        <h5 className="text-info">4. Contact Us</h5>
        <p>
          <strong>Custom Rodz</strong>  <br />
          <strong>Kottakkal</strong>  <br />
          📧 Email: <strong>cutomrodz@gmail.com</strong>  <br />
          📞 Phone: <strong>9876543210</strong>
        </p>
      </section>
    </div>
  );
};

export default PrivacyTerms;