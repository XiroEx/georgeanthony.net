import React from "react";

export default function AboutPage() {
  return (
    <div className="bg-gray-50 text-gray-900 font-sans">
      <main className="px-6 py-12 max-w-5xl mx-auto">
        <section className="mb-16 text-center">
          <h1 className="text-4xl font-bold mb-4">About George Anthony</h1>
          <p className="text-lg text-gray-600 mb-6">
            At George Anthony, we are dedicated to providing comprehensive financial and insurance services to empower individuals, families, and businesses. Our mission is to guide you with experience, clarity, and care.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-4">Our Vision</h2>
          <p className="text-gray-700 leading-relaxed">
            We believe in creating a future where financial security and growth are accessible to everyone. Through innovative solutions and personalized strategies, we aim to help you achieve your goals and protect what matters most.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-4">Our Values</h2>
          <ul className="list-disc list-inside text-gray-700 leading-relaxed">
            <li>Integrity: We uphold the highest standards of honesty and transparency.</li>
            <li>Excellence: We strive to deliver exceptional service and results.</li>
            <li>Innovation: We embrace change and continuously seek better solutions.</li>
            <li>Empathy: We listen, understand, and prioritize your needs.</li>
          </ul>
        </section>

        <section className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
          <p className="text-gray-700 mb-6">
            Ready to take the next step? Contact us today to learn how we can help you achieve your financial goals.
          </p>
          <a href="/#contact" className="px-6 py-3 text-lg bg-[#7200a2] hover:bg-purple-800 text-white rounded">
            Contact Us
          </a>
        </section>
      </main>
    </div>
  );
}