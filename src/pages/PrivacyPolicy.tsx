import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShieldAlt, faCookieBite, faUserShield, faEnvelope, faLock, faCheckCircle, faImage, faGlobe, faChild } from '@fortawesome/free-solid-svg-icons';
import { updateMetaTags } from '../utils/seo';

export const PrivacyPolicy: React.FC = () => {
  useEffect(() => {
    updateMetaTags(
      "Privacy Policy - Rubik's Art",
      "Official Privacy Policy for rubiks-art.com. Fulfills GDPR requirements and Google AdSense disclosures including third-party advertising cookies, DART cookies, image privacy, and user opt-outs."
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
            <strong>Effective Date:</strong> August 5, 2026. Accessible from <a href="https://rubiks-art.com" className="text-blue-500 underline hover:text-blue-600">https://rubiks-art.com</a>.
          </p>
        </div>

        {/* Main Content Container */}
        <div className="rounded-3xl p-6 sm:p-10 backdrop-blur-md border border-[var(--glass-border)] bg-[var(--glass-bg)] shadow-xl space-y-10 text-left">

          {/* Introductory Preamble */}
          <section className="space-y-3">
            <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              At <strong>rubiks-art.com</strong>, accessible from <a href="https://rubiks-art.com" className="text-blue-500 hover:underline">https://rubiks-art.com</a>, one of our main priorities is the privacy of our visitors. This Privacy Policy document outlines the types of information that is collected and recorded by rubiks-art.com and how we use it.
            </p>
            <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us at <a href="mailto:contact@rubiks-art.com" className="text-blue-500 underline hover:text-blue-600 font-semibold">contact@rubiks-art.com</a>.
            </p>
          </section>

          {/* Section 1: GDPR Compliance */}
          <section className="space-y-4 p-6 sm:p-8 rounded-2xl bg-indigo-500/5 border border-indigo-500/20">
            <h2 className="text-2xl font-bold font-heading flex items-center gap-3 text-indigo-600 dark:text-indigo-400">
              <FontAwesomeIcon icon={faUserShield} className="text-xl" />
              1. General Data Protection Regulation (GDPR) Compliance
            </h2>
            <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              If you are a resident of the European Economic Area (EEA), the United Kingdom, or Switzerland, your data protection rights are governed by the General Data Protection Regulation (GDPR).
            </p>

            <div className="space-y-2 text-sm" style={{ color: 'var(--text-primary)' }}>
              <h3 className="font-bold text-base text-[var(--text-primary)] mt-3">Legal Basis for Processing Personal Data</h3>
              <ul className="list-disc list-inside space-y-1 text-[var(--text-secondary)]">
                <li><strong>Consent:</strong> You have given us explicit permission to process your data (e.g., accepting cookies for advertising personalization).</li>
                <li><strong>Legitimate Interests:</strong> Processing is necessary to operate, optimize, analyze performance, and secure our website.</li>
                <li><strong>Contractual & Legal Obligations:</strong> To respond to inquiries, support requests, and feedback sent to our contact email address.</li>
              </ul>
            </div>

            <div className="space-y-2 text-sm" style={{ color: 'var(--text-primary)' }}>
              <h3 className="font-bold text-base text-[var(--text-primary)] mt-3">Your GDPR Data Protection Rights</h3>
              <p className="text-xs text-[var(--text-secondary)]">Under the GDPR, European Union and UK visitors possess the following fundamental rights:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                <div className="p-3 rounded-xl bg-slate-500/5 border border-[var(--glass-border)]">
                  <strong className="text-indigo-500 block">• Right to Access & Erasure</strong>
                  <span className="text-xs text-[var(--text-secondary)]">The right to request copies of your personal data or request deletion.</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-500/5 border border-[var(--glass-border)]">
                  <strong className="text-indigo-500 block">• Right to Rectification</strong>
                  <span className="text-xs text-[var(--text-secondary)]">The right to request correction of inaccurate or incomplete information.</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-500/5 border border-[var(--glass-border)]">
                  <strong className="text-indigo-500 block">• Right to Object & Restrict</strong>
                  <span className="text-xs text-[var(--text-secondary)]">The right to object to or restrict processing of your personal data.</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-500/5 border border-[var(--glass-border)]">
                  <strong className="text-indigo-500 block">• Right to Data Portability & Revocation</strong>
                  <span className="text-xs text-[var(--text-secondary)]">The right to transfer data or withdraw consent at any time.</span>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Information We Collect & Local Image Privacy */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold font-heading flex items-center gap-3" style={{ color: 'var(--text-primary)' }}>
              <FontAwesomeIcon icon={faLock} className="text-blue-500 text-xl" />
              2. Information We Collect
            </h2>

            <div className="space-y-4">
              {/* Part A */}
              <div className="p-4 rounded-xl bg-slate-500/5 border border-[var(--glass-border)] space-y-2">
                <h3 className="font-bold text-base text-[var(--text-primary)]">A. Information Provided Directly</h3>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  When you contact us directly via <a href="mailto:contact@rubiks-art.com" className="text-blue-500 hover:underline">contact@rubiks-art.com</a> or our website contact form, we receive personal information such as your name, email address, message topic, message contents, and any attachments you choose to send.
                </p>
              </div>

              {/* Part B */}
              <div className="p-4 rounded-xl bg-slate-500/5 border border-[var(--glass-border)] space-y-2">
                <h3 className="font-bold text-base text-[var(--text-primary)]">B. Automatically Collected Information (Log Files)</h3>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  rubiks-art.com follows a standard procedure of using log files. These files log visitors when they visit websites. The information collected by log files includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and click counts. These metrics are not linked to any information that is personally identifiable.
                </p>
              </div>

              {/* Part C: Mosaic Image Privacy Guarantee */}
              <div className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-2">
                <h3 className="font-bold text-base text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                  <FontAwesomeIcon icon={faImage} />
                  C. Mosaic Art & Local Browser Processing (100% Private)
                </h3>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  When using our <strong>Mosaic Generator</strong> to transform personal photos into Rubik's Cube pixel art:
                </p>
                <div className="space-y-1.5 text-xs text-[var(--text-primary)] pt-1">
                  <div className="flex items-start gap-2">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-500 mt-0.5 shrink-0" />
                    <span><strong>100% Local Browser Engine:</strong> All image cropping, color matching, and blueprint rendering take place locally inside your browser memory.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-500 mt-0.5 shrink-0" />
                    <span><strong>No Remote Uploads:</strong> We do <strong>NOT</strong> upload, transfer, save, or store your photos on any external server or cloud service.</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Cookies and Google AdSense Disclosures */}
          <section className="space-y-4 p-6 sm:p-8 rounded-2xl bg-blue-500/5 border border-blue-500/20">
            <h2 className="text-2xl font-bold font-heading flex items-center gap-3 text-blue-600 dark:text-blue-400">
              <FontAwesomeIcon icon={faCookieBite} className="text-xl" />
              3. Cookies and Google AdSense Disclosures
            </h2>
            <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              rubiks-art.com uses cookies, web beacons, and third-party advertising services, primarily <strong>Google AdSense</strong>.
            </p>

            <div className="space-y-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <div className="p-4 rounded-xl bg-slate-500/5 border border-[var(--glass-border)] space-y-2">
                <h3 className="font-bold text-sm text-[var(--text-primary)]">A. Third-Party Vendors and Cookies</h3>
                <ul className="list-disc list-inside space-y-1.5 text-xs">
                  <li><strong>Google AdSense:</strong> Google, as a third-party vendor, uses cookies to serve advertisements on rubiks-art.com.</li>
                  <li><strong>DART Cookies:</strong> Google's use of advertising cookies (such as the DART cookie) enables it and its partners to serve targeted ads to our users based on their visit to our site and/or other sites on the Internet.</li>
                  <li><strong>Third-Party Ad Networks:</strong> Other third-party ad networks or vendors may also use cookies, JavaScript, or Web Beacons to measure campaign effectiveness and personalize advertising content.</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-500/5 border border-[var(--glass-border)] space-y-2">
                <h3 className="font-bold text-sm text-[var(--text-primary)]">B. How to Control & Opt-Out of Cookies & Personalized Ads</h3>
                <p className="text-xs">
                  Visitors can choose to disable or customize cookies through their individual browser options. Additionally, you have the following rights and direct options regarding targeted advertising:
                </p>
                <ul className="list-disc list-inside space-y-1.5 text-xs">
                  <li>
                    <strong>Google Ads Settings:</strong> Users may opt out of personalized advertising by visiting{' '}
                    <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline hover:text-blue-600">
                      Google Ads Settings (https://www.google.com/settings/ads)
                    </a>.
                  </li>
                  <li>
                    <strong>Network Advertising Initiative (NAI):</strong> You can opt out of third-party vendor use of cookies for personalized advertising by visiting{' '}
                    <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline hover:text-blue-600">
                      www.aboutads.info
                    </a>.
                  </li>
                  <li>
                    <strong>GDPR Consent Controls:</strong> European Union and UK visitors can review or withdraw cookie consent preferences at any time.
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 4: How We Use Your Information */}
          <section className="space-y-3">
            <h2 className="text-2xl font-bold font-heading flex items-center gap-3" style={{ color: 'var(--text-primary)' }}>
              <FontAwesomeIcon icon={faGlobe} className="text-emerald-500 text-xl" />
              4. How We Use Your Information
            </h2>
            <p className="leading-relaxed text-xs" style={{ color: 'var(--text-secondary)' }}>
              We use the information we collect in various ways to support and improve rubiks-art.com, including to:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-sm text-[var(--text-secondary)]">
              <li>Provide, operate, optimize, and maintain our website and 3D solvers.</li>
              <li>Improve, personalize, and expand our website capabilities and mosaic features.</li>
              <li>Understand and analyze how users navigate our puzzle tools and galleries.</li>
              <li>Respond directly to customer support requests, feedback, and user inquiry emails.</li>
              <li>Deliver relevant advertisements through Google AdSense based on user preferences and consent.</li>
            </ul>
          </section>

          {/* Section 5: Children's Information */}
          <section className="space-y-3 p-6 rounded-2xl bg-amber-500/5 border border-amber-500/20">
            <h2 className="text-2xl font-bold font-heading flex items-center gap-3 text-amber-600 dark:text-amber-400">
              <FontAwesomeIcon icon={faChild} className="text-xl" />
              5. Children's Information (COPPA & EU Protections)
            </h2>
            <p className="leading-relaxed text-xs" style={{ color: 'var(--text-secondary)' }}>
              Another key priority is protecting children while using the internet. We encourage parents and guardians to observe, participate in, and monitor their online activities.
            </p>
            <p className="leading-relaxed text-xs" style={{ color: 'var(--text-secondary)' }}>
              <strong>rubiks-art.com does not knowingly collect any Personal Identifiable Information (PII) from children under the age of 13 (or under 16 in the EU).</strong> If you believe your child provided this kind of information on our website, we strongly encourage you to contact us immediately at <a href="mailto:contact@rubiks-art.com" className="text-blue-500 underline hover:text-blue-600 font-semibold">contact@rubiks-art.com</a>, and we will make prompt efforts to remove such information from our records.
            </p>
          </section>

          {/* Section 6: Contact Us */}
          <section className="space-y-3 pt-6 border-t border-[var(--glass-border)]">
            <h2 className="text-2xl font-bold font-heading flex items-center gap-3" style={{ color: 'var(--text-primary)' }}>
              <FontAwesomeIcon icon={faEnvelope} className="text-purple-500 text-xl" />
              6. Contact Us
            </h2>
            <p className="leading-relaxed text-xs" style={{ color: 'var(--text-secondary)' }}>
              If you have any questions, wish to exercise any of your data protection rights, or need further details regarding our privacy practices, please contact us at:
            </p>
            <div className="p-4 rounded-xl bg-slate-500/5 border border-[var(--glass-border)] text-sm space-y-1 text-[var(--text-primary)]">
              <p><strong>• Website:</strong> <a href="https://rubiks-art.com" className="text-blue-500 underline hover:text-blue-600">https://rubiks-art.com</a></p>
              <p><strong>• Primary Email:</strong> <a href="mailto:contact@rubiks-art.com" className="text-blue-500 underline hover:text-blue-600">contact@rubiks-art.com</a></p>
            </div>
          </section>

        </div>
      </motion.div>
    </div>
  );
};
