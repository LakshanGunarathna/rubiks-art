import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShieldAlt, faCookieBite, faUserSecret, faEnvelope, faLock, faCheckCircle, faImage } from '@fortawesome/free-solid-svg-icons';
import { updateMetaTags } from '../utils/seo';

export const PrivacyPolicy: React.FC = () => {
  useEffect(() => {
    updateMetaTags(
      "Privacy Policy - Rubik's Art",
      "Read the official Privacy Policy for Rubik's Art. Learn how we handle privacy, image security, local browser processing, analytics, and advertising cookies."
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
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-blue-500/10 text-blue-500 mb-2">
            <FontAwesomeIcon icon={faShieldAlt} className="text-3xl" />
          </div>
          <h1 className="text-4xl font-extrabold font-heading tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Privacy Policy
          </h1>
          <p className="text-sm max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Last updated: August 3, 2026. Your privacy is important to us. This policy outlines how we handle your data, image uploads, and privacy when using Rubik's Art.
          </p>
        </div>

        {/* Main Content Card */}
        <div className="rounded-3xl p-6 sm:p-10 backdrop-blur-md border border-[var(--glass-border)] bg-[var(--glass-bg)] shadow-xl space-y-8 text-left">

          {/* Section 1: Overview */}
          <section className="space-y-3">
            <h2 className="text-2xl font-bold font-heading flex items-center gap-3" style={{ color: 'var(--text-primary)' }}>
              <FontAwesomeIcon icon={faLock} className="text-blue-500 text-xl" />
              1. Overview & Information We Collect
            </h2>
            <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Welcome to <strong>Rubik's Art</strong> ("we", "our", or "us"). We respect your privacy and are committed to protecting it.
              When you interact with our website, 3D Rubik's Cube solvers, interactive visualizers, and mosaic generator tools, we collect minimal data such as non-personally identifiable technical information (browser type, device type, operating system, and anonymized IP addresses) to optimize your experience.
            </p>
          </section>

          {/* Section 2: Mosaic Art & Image Upload Privacy (CRITICAL) */}
          <section className="space-y-3 p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/20">
            <h2 className="text-2xl font-bold font-heading flex items-center gap-3 text-emerald-600 dark:text-emerald-400">
              <FontAwesomeIcon icon={faImage} className="text-xl" />
              2. Mosaic Art & User Image Upload Privacy
            </h2>
            <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              When you use our <strong>Mosaic Generator</strong> tool to create Rubik's Cube pixel art from your personal photos or graphics:
            </p>
            <div className="space-y-2 mt-4 text-sm" style={{ color: 'var(--text-primary)' }}>
              <div className="flex items-start gap-3">
                <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-500 mt-1 flex-shrink-0" />
                <span>
                  <strong>100% Local Browser Processing:</strong> All image processing, color mapping, and mosaic blueprint generation occur entirely within your local web browser.
                </span>
              </div>
              <div className="flex items-start gap-3">
                <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-500 mt-1 flex-shrink-0" />
                <span>
                  <strong>No External Server Uploads:</strong> We do <strong>NOT</strong> upload, store, save, or transmit your images to any external server or cloud database. Your uploaded files never leave your computer or mobile device.
                </span>
              </div>
            </div>
          </section>

          {/* Section 3: Cookies & Advertising */}
          <section className="space-y-3 p-6 rounded-2xl bg-blue-500/5 border border-blue-500/20">
            <h2 className="text-2xl font-bold font-heading flex items-center gap-3 text-blue-600 dark:text-blue-400">
              <FontAwesomeIcon icon={faCookieBite} className="text-xl" />
              3. Cookies & Third-Party Advertising
            </h2>
            <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              We use cookies and similar tracking technologies to enhance site navigation, analyze site usage, and support advertising partners displaying ads on our website.
            </p>
            <div className="space-y-2 mt-4 text-sm" style={{ color: 'var(--text-primary)' }}>
              <div className="flex items-start gap-3">
                <FontAwesomeIcon icon={faCheckCircle} className="text-blue-500 mt-1 flex-shrink-0" />
                <span>
                  <strong>Third-Party Vendors & Advertisers:</strong> Third-party vendors and advertising partners use cookies to serve relevant advertisements based on a user's prior visits to our website or other websites on the Internet.
                </span>
              </div>
              <div className="flex items-start gap-3">
                <FontAwesomeIcon icon={faCheckCircle} className="text-blue-500 mt-1 flex-shrink-0" />
                <span>
                  <strong>Opting Out of Personalized Ads:</strong> You may opt out of personalized advertising at any time by adjusting your browser settings or visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline hover:text-blue-600">Ad Settings</a> or <a href="https://www.aboutads.info/choices" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline hover:text-blue-600">aboutads.info</a>.
                </span>
              </div>
            </div>
          </section>

          {/* Section 4: Web Analytics */}
          <section className="space-y-3">
            <h2 className="text-2xl font-bold font-heading flex items-center gap-3" style={{ color: 'var(--text-primary)' }}>
              <FontAwesomeIcon icon={faUserSecret} className="text-emerald-500 text-xl" />
              4. Analytics & Performance Tracking
            </h2>
            <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              We utilize web analytics services to understand how visitors interact with our 3D Rubik's Cube tools, solver engines, and mosaic generation features. Analytics tools collect standard internet log data and visitor behavior in an aggregated, anonymous format. No personally identifiable information (PII) is sold or shared.
            </p>
          </section>

          {/* Section 5: Local Browser Storage */}
          <section className="space-y-3">
            <h2 className="text-2xl font-bold font-heading" style={{ color: 'var(--text-primary)' }}>
              5. Local Browser Storage
            </h2>
            <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              To ensure a seamless user experience, our application uses local browser storage (`localStorage` and `sessionStorage`) strictly to remember your theme preferences (Dark Mode / Light Mode) and temporary solver inputs. This data remains on your device and is not saved on external servers.
            </p>
          </section>

          {/* Section 6: Children's Online Privacy */}
          <section className="space-y-3">
            <h2 className="text-2xl font-bold font-heading" style={{ color: 'var(--text-primary)' }}>
              6. Children's Online Privacy Protection
            </h2>
            <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Rubik's Art is designed for general audiences and speedcubing enthusiasts of all ages. We do not knowingly collect personal data from children under the age of 13.
            </p>
          </section>

          {/* Section 7: Policy Updates & Contact */}
          <section className="space-y-3 pt-4 border-t border-[var(--glass-border)]">
            <h2 className="text-2xl font-bold font-heading flex items-center gap-3" style={{ color: 'var(--text-primary)' }}>
              <FontAwesomeIcon icon={faEnvelope} className="text-purple-500 text-xl" />
              7. Contact Us Regarding Privacy
            </h2>
            <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              If you have any questions or concerns regarding this Privacy Policy or our data practices, please contact us via our official contact page or send an email to <a href="mailto:contact@rubiks-art.com" className="text-blue-500 underline hover:text-blue-600">contact@rubiks-art.com</a>.
            </p>
          </section>

        </div>
      </motion.div>
    </div>
  );
};
