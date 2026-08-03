import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileContract, faGavel, faExclamationTriangle, faLaptopCode, faBalanceScale } from '@fortawesome/free-solid-svg-icons';
import { updateMetaTags } from '../utils/seo';

export const TermsOfService: React.FC = () => {
  useEffect(() => {
    updateMetaTags(
      "Terms of Service - Rubik's Art",
      "Read the official Terms of Service for using Rubik's Art tools, 3D Rubik's cube visualizers, solvers, and mosaic generator."
    );
  }, []);

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-purple-500/10 text-purple-500 mb-2">
            <FontAwesomeIcon icon={faFileContract} className="text-3xl" />
          </div>
          <h1 className="text-4xl font-extrabold font-heading tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Terms of Service
          </h1>
          <p className="text-sm max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Last updated: August 3, 2026. Please read these terms carefully before using the Rubik's Art web application.
          </p>
        </div>

        {/* Main Content Card */}
        <div className="rounded-3xl p-6 sm:p-10 backdrop-blur-md border border-[var(--glass-border)] bg-[var(--glass-bg)] shadow-xl space-y-8 text-left">

          {/* Section 1: Agreement to Terms */}
          <section className="space-y-3">
            <h2 className="text-2xl font-bold font-heading flex items-center gap-3" style={{ color: 'var(--text-primary)' }}>
              <FontAwesomeIcon icon={faGavel} className="text-purple-500 text-xl" />
              1. Agreement to Terms
            </h2>
            <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              By accessing or using <strong>Rubik's Art</strong> (accessible via www.rubiks-art.com), you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree with any part of these terms, you are prohibited from using or accessing our website and web applications.
            </p>
          </section>

          {/* Section 2: Intellectual Property & Use License */}
          <section className="space-y-3">
            <h2 className="text-2xl font-bold font-heading flex items-center gap-3" style={{ color: 'var(--text-primary)' }}>
              <FontAwesomeIcon icon={faLaptopCode} className="text-xl text-blue-500" />
              2. Use License & Intellectual Property
            </h2>
            <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Permission is granted to temporarily access and use the interactive 3D Rubik's Cube view tools, step-by-step solvers (2x2, 3x3, 4x4, 5x5), puzzle art showcases, and custom mosaic generator for personal, non-commercial educational and entertainment purposes.
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm pl-2" style={{ color: 'var(--text-secondary)' }}>
              <li>You may not modify or copy the underlying proprietary source code or algorithms without written consent.</li>
              <li>You may not use the web application for any commercial exploitation or automated data scraping without authorization.</li>
              <li>"Rubik's Cube" is a registered trademark of Spin Master Toys UK Limited. Rubik's Art is an independent fan-made speedcubing tool and art visualizer.</li>
            </ul>
          </section>

          {/* Section 3: User Conduct & Automated Abuse */}
          <section className="space-y-3">
            <h2 className="text-2xl font-bold font-heading flex items-center gap-3" style={{ color: 'var(--text-primary)' }}>
              <FontAwesomeIcon icon={faBalanceScale} className="text-emerald-500 text-xl" />
              3. User Conduct & Acceptable Use
            </h2>
            <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              When using Rubik's Art, you agree not to engage in any activity that interferes with or disrupts the functionality of our servers, web services, or APIs. Automated bot submissions to our solver services or attempts to reverse-engineer our web infrastructure are strictly prohibited.
            </p>
          </section>

          {/* Section 4: Third-Party Advertising & Advertisements */}
          <section className="space-y-3 p-6 rounded-2xl bg-purple-500/5 border border-purple-500/20">
            <h2 className="text-2xl font-bold font-heading text-purple-600 dark:text-purple-400">
              4. Advertisements & Third-Party Content
            </h2>
            <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Rubik's Art may display third-party advertisements served by platforms such as Google AdSense. We do not endorse or assume responsibility for any third-party products, services, or content linked within advertising banners. Any interactions with third-party advertisers are solely between you and the advertiser.
            </p>
          </section>

          {/* Section 5: Disclaimer of Warranties */}
          <section className="space-y-3">
            <h2 className="text-2xl font-bold font-heading flex items-center gap-3" style={{ color: 'var(--text-primary)' }}>
              <FontAwesomeIcon icon={faExclamationTriangle} className="text-amber-500 text-xl" />
              5. Disclaimer of Warranties & Limitation of Liability
            </h2>
            <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              The materials and interactive tools on Rubik's Art are provided on an <strong>"AS IS"</strong> and <strong>"AS AVAILABLE"</strong> basis. We make no warranties, expressed or implied, regarding solver execution speed, accuracy, uninterrupted uptime, or fitness for a particular purpose. In no event shall Rubik's Art or its creators be liable for any damages arising out of the use or inability to use our tools.
            </p>
          </section>

          {/* Section 6: Modifications & Governing Law */}
          <section className="space-y-3 pt-4 border-t border-[var(--glass-border)]">
            <h2 className="text-2xl font-bold font-heading" style={{ color: 'var(--text-primary)' }}>
              6. Changes to Terms & Contact Information
            </h2>
            <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              We reserve the right to modify or replace these Terms of Service at any time. Continued use of the website following any changes constitutes acceptance of the new terms. If you have questions about these Terms, please contact us at <a href="mailto:support@rubiks-art.com" className="text-purple-500 underline hover:text-purple-600">support@rubiks-art.com</a>.
            </p>
          </section>

        </div>
      </motion.div>
    </div>
  );
};
